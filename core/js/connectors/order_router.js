 /**
 * ============================================================
 * QuantumTrader-AI (Qonexai)
 * TITLE: ORDER ROUTER
 * Serial 3.6.2 — Order Routing Layer
 * Production Version 1.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * Controlled routing boundary between validated execution
 * requests and the Exchange Gateway.
 *
 * The Order Router does NOT:
 *
 * • generate trading decisions
 * • select trading strategies
 * • calculate risk
 * • authorize trades
 * • override governance decisions
 * • communicate directly with exchanges
 * • execute orders directly
 * • perform paper execution
 * • perform live execution
 * • manage exchange connections
 * • duplicate execution confirmation
 * • duplicate execution failure handling
 *
 * The Order Router is responsible for:
 *
 * 1. Receiving an approved execution-routing request.
 * 2. Validating the routing envelope.
 * 3. Resolving the configured Exchange Gateway.
 * 4. Routing a normalized order to ExchangeGateway.submitOrder().
 * 5. Routing a transport contract to
 *    ExchangeGateway.processTransportContract().
 * 6. Publishing router-level lifecycle events.
 * 7. Returning a standardized routing result.
 * 8. Preserving execution traceability.
 *
 * ============================================================
 * ARCHITECTURAL POSITION
 * ============================================================
 *
 * Strategy / Decision Layer
 *          ↓
 * Risk / Governance Layer
 *          ↓
 * Execution Request / Transport Contract
 *          ↓
 * ------------------------------------------------
 *              ORDER ROUTER
 *                 3.6.2
 * ------------------------------------------------
 *          ↓
 * ExchangeGateway.submitOrder()
 *          OR
 * ExchangeGateway.processTransportContract()
 *          ↓
 * Exchange Gateway Execution
 *          ↓
 * Execution Confirmation
 *          ↓
 * Execution Feedback Layer
 *
 * ============================================================
 * IMPORTANT EXCHANGE GATEWAY CONTRACT
 * ============================================================
 *
 * This router is explicitly aligned with the current
 * ExchangeGateway implementation.
 *
 * Supported gateway methods:
 *
 * • submitOrder(order)
 * • processTransportContract(transport)
 * • acceptTransportContract(transport)
 *
 * Primary routing methods used by this router:
 *
 * • submitOrder(order)
 * • processTransportContract(transport)
 *
 * The router does NOT call:
 *
 * • routeOrder()
 * • executeOrder()
 *
 * because those are not public routing methods exposed by the
 * supplied ExchangeGateway implementation.
 *
 * ============================================================
 * GOVERNANCE BOUNDARY
 * ============================================================
 *
 * Governance approval is owned by ExchangeGateway.
 *
 * ExchangeGateway.submitOrder() internally calls:
 *
 * requestExecutionApproval(order)
 *
 * Therefore this router does NOT:
 *
 * • perform governance approval
 * • duplicate governance approval
 * • override governance approval
 *
 * The router only forwards the request to the gateway.
 *
 * ============================================================
 * EVENT HUB BOUNDARY
 * ============================================================
 *
 * ExchangeGateway already publishes:
 *
 * • execution:confirmed
 * • execution:failed
 *
 * Therefore this router publishes only router lifecycle events.
 *
 * Router events:
 *
 * • order_router:ready
 * • order_router:routing
 * • order_router:routed
 * • order_router:rejected
 * • order_router:failed
 *
 * The router must not duplicate:
 *
 * • execution:confirmed
 * • execution:failed
 *
 * Those remain owned by ExchangeGateway.
 *
 * ============================================================
 */

/* ============================================================
 * SECTION 1 — CONSTANTS
 * ============================================================
 */

const ROUTER_NAME =
    "order_router";

const ROUTER_VERSION =
    "1.0.0";

const ROUTER_STATUS = Object.freeze({

    UNAVAILABLE:
        "UNAVAILABLE",

    READY:
        "READY",

    ROUTING:
        "ROUTING",

    COMPLETED:
        "COMPLETED",

    FAILED:
        "FAILED"

});

const ROUTING_DECISION = Object.freeze({

    ROUTE:
        "ROUTE",

    REJECT:
        "REJECT"

});

const ROUTING_TYPE = Object.freeze({

    ORDER:
        "ORDER",

    TRANSPORT:
        "TRANSPORT"

});

/* ============================================================
 * SECTION 2 — INTERNAL RUNTIME STATE
 * ============================================================
 */

const routerState = {

    initialized:
        false,

    status:
        ROUTER_STATUS.UNAVAILABLE,

    eventHub:
        null,

    exchangeGateway:
        null,

    totalRequests:
        0,

    successfulRoutes:
        0,

    failedRoutes:
        0,

    rejectedRequests:
        0,

    lastRoutingId:
        null,

    lastOrderId:
        null,

    lastRoute:
        null,

    lastResult:
        null,

    updatedAt:
        null

};

/* ============================================================
 * SECTION 3 — INTERNAL UTILITIES
 * ============================================================
 */

/**
 * Return the current timestamp.
 *
 * @returns {string}
 */
function now() {

    return new Date().toISOString();

}

/**
 * Validate a non-empty string.
 *
 * @param {*} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {

    return (

        typeof value ===
        "string"

        &&

        value.trim().length >
        0

    );

}

/**
 * Generate a routing identifier.
 *
 * @returns {string}
 */
function generateRoutingId() {

    return (

        "route_" +

        Date.now().toString(36) +

        "_" +

        Math.random()
            .toString(36)
            .slice(2, 10)

    );

}

/**
 * Publish a router lifecycle event.
 *
 * Event publication failure does not alter the routing result.
 *
 * @param {string} eventName
 * @param {Object} payload
 * @returns {boolean}
 */
function publishEvent(
    eventName,
    payload = {}
) {

    if (
        !routerState.eventHub
    ) {

        return false;

    }

    if (
        typeof routerState.eventHub.emit !==
        "function"
    ) {

        return false;

    }

    try {

        routerState.eventHub.emit(

            eventName,

            payload

        );

        return true;

    } catch (error) {

        /*
         * Event publication failure is recorded as diagnostic
         * information only.
         *
         * It must not convert an otherwise successful gateway
         * routing operation into a failed execution.
         */

        return false;

    }

}

/**
 * Resolve an order identifier.
 *
 * @param {Object} order
 * @returns {string|null}
 */
function resolveOrderId(order) {

    if (
        !order ||
        typeof order !== "object"
    ) {

        return null;

    }

    return (

        order.orderId ??

        order.requestId ??

        order.executionId ??

        null

    );

}

/**
 * Resolve a transport identifier.
 *
 * @param {Object} transport
 * @returns {string|null}
 */
function resolveTransportId(
    transport
) {

    if (
        !transport ||
        typeof transport !== "object"
    ) {

        return null;

    }

    return (

        transport.transportId ??

        transport.route?.routeId ??

        transport.route?.execution?.executionId ??

        null

    );

}

/* ============================================================
 * SECTION 4 — GATEWAY CONTRACT VALIDATION
 * ============================================================
 */

/**
 * Validate that the supplied object conforms to the actual
 * ExchangeGateway contract.
 *
 * Supported routing contracts:
 *
 * 1. submitOrder(order)
 * 2. processTransportContract(transport)
 *
 * @param {Object} gateway
 * @returns {Object}
 */
function validateGatewayContract(
    gateway
) {

    if (
        !gateway ||
        typeof gateway !== "object"
    ) {

        return {

            valid:
                false,

            reason:
                "EXCHANGE_GATEWAY_REQUIRED"

        };

    }

    const supportsOrderSubmission =

        typeof gateway.submitOrder ===
        "function";

    const supportsTransportContract =

        typeof gateway.processTransportContract ===
        "function";

    if (
        !supportsOrderSubmission &&
        !supportsTransportContract
    ) {

        return {

            valid:
                false,

            reason:
                "INVALID_EXCHANGE_GATEWAY_CONTRACT"

        };

    }

    return {

        valid:
            true,

        supportsOrderSubmission,

        supportsTransportContract

    };

}

/* ============================================================
 * SECTION 5 — REQUEST VALIDATION
 * ============================================================
 */

/**
 * Validate a normalized order-routing request.
 *
 * This validation checks only routing integrity.
 *
 * It does NOT replace ExchangeGateway.validateOrder().
 *
 * ExchangeGateway remains responsible for actual order
 * validation before execution.
 *
 * @param {Object} order
 * @returns {Object}
 */
function validateOrderRoute(
    order
) {

    if (
        !order ||
        typeof order !== "object"
    ) {

        return {

            valid:
                false,

            reason:
                "INVALID_ORDER_REQUEST"

        };

    }

    if (
        !isNonEmptyString(
            order.symbol
        )
    ) {

        return {

            valid:
                false,

            reason:
                "MISSING_ORDER_SYMBOL"

        };

    }

    if (
        !isNonEmptyString(
            order.side
        )
    ) {

        return {

            valid:
                false,

            reason:
                "MISSING_ORDER_SIDE"

        };

    }

    if (
        typeof order.quantity !==
        "number"
        ||
        order.quantity <=
        0
    ) {

        return {

            valid:
                false,

            reason:
                "INVALID_ORDER_QUANTITY"

        };

    }

    return {

        valid:
            true

    };

}

/**
 * Validate an ExchangeGateway transport contract.
 *
 * The gateway itself performs the definitive transport
 * contract validation through acceptTransportContract().
 *
 * This router performs only enough validation to prevent
 * obviously malformed routing requests.
 *
 * @param {Object} transport
 * @returns {Object}
 */
function validateTransportRoute(
    transport
) {

    if (
        !transport ||
        typeof transport !== "object"
    ) {

        return {

            valid:
                false,

            reason:
                "INVALID_TRANSPORT_CONTRACT"

        };

    }

    if (
        !transport.route
    ) {

        return {

            valid:
                false,

            reason:
                "MISSING_TRANSPORT_ROUTE"

        };

    }

    if (
        !transport.route.execution
    ) {

        return {

            valid:
                false,

            reason:
                "MISSING_EXECUTION_PACKAGE"

        };

    }

    return {

        valid:
            true

    };

}

/* ============================================================
 * SECTION 6 — ROUTER CONFIGURATION
 * ============================================================
 */

/**
 * Configure the Order Router.
 *
 * Expected configuration:
 *
 * {
 *     eventHub,
 *     exchangeGateway
 * }
 *
 * @param {Object} config
 * @returns {Object}
 */
function configureOrderRouter(
    config = {}
) {

    if (
        !config ||
        typeof config !== "object"
    ) {

        return {

            success:
                false,

            status:
                ROUTER_STATUS.UNAVAILABLE,

            reason:
                "INVALID_ROUTER_CONFIGURATION"

        };

    }

    if (
        config.eventHub
    ) {

        if (
            typeof config.eventHub.emit !==
            "function"
        ) {

            return {

                success:
                    false,

                status:
                    ROUTER_STATUS.UNAVAILABLE,

                reason:
                    "INVALID_EVENT_HUB"

            };

        }

        routerState.eventHub =
            config.eventHub;

    }

    if (
        config.exchangeGateway
    ) {

        const contract =
            validateGatewayContract(
                config.exchangeGateway
            );

        if (
            !contract.valid
        ) {

            return {

                success:
                    false,

                status:
                    ROUTER_STATUS.UNAVAILABLE,

                reason:
                    contract.reason

            };

        }

        routerState.exchangeGateway =
            config.exchangeGateway;

    }

    if (
        !routerState.exchangeGateway
    ) {

        routerState.initialized =
            false;

        routerState.status =
            ROUTER_STATUS.UNAVAILABLE;

        return {

            success:
                false,

            status:
                ROUTER_STATUS.UNAVAILABLE,

            reason:
                "EXCHANGE_GATEWAY_NOT_CONFIGURED"

        };

    }

    routerState.initialized =
        true;

    routerState.status =
        ROUTER_STATUS.READY;

    routerState.updatedAt =
        now();

    publishEvent(

        "order_router:ready",

        {

            router:
                ROUTER_NAME,

            version:
                ROUTER_VERSION,

            timestamp:
                routerState.updatedAt

        }

    );

    return {

        success:
            true,

        status:
            ROUTER_STATUS.READY,

        router:
            ROUTER_NAME,

        version:
            ROUTER_VERSION,

        timestamp:
            routerState.updatedAt

    };

}

/* ============================================================
 * SECTION 7 — GATEWAY ACCESS
 * ============================================================
 */

/**
 * Attach or replace the ExchangeGateway instance.
 *
 * @param {Object} exchangeGateway
 * @returns {Object}
 */
function attachExchangeGateway(
    exchangeGateway
) {

    const contract =
        validateGatewayContract(
            exchangeGateway
        );

    if (
        !contract.valid
    ) {

        return {

            success:
                false,

            attached:
                false,

            reason:
                contract.reason

        };

    }

    routerState.exchangeGateway =
        exchangeGateway;

    routerState.initialized =
        true;

    routerState.status =
        ROUTER_STATUS.READY;

    routerState.updatedAt =
        now();

    return {

        success:
            true,

        attached:
            true,

        status:
            ROUTER_STATUS.READY,

        timestamp:
            routerState.updatedAt

    };

}

/**
 * Return the currently attached ExchangeGateway.
 *
 * @returns {Object|null}
 */
function getExchangeGateway() {

    return (
        routerState.exchangeGateway ??
        null
    );

}

/* ============================================================
 * SECTION 8 — STANDARDIZED ROUTING RESULT
 * ============================================================
 */

/**
 * Build a standardized routing result.
 *
 * @param {Object} data
 * @returns {Object}
 */
function buildRoutingResult(
    data = {}
) {

    return {

        success:
            data.success ??
            false,

        decision:
            data.decision ??
            ROUTING_DECISION.REJECT,

        routed:
            data.routed ??
            false,

        status:
            data.status ??
            ROUTER_STATUS.FAILED,

        router:
            ROUTER_NAME,

        version:
            ROUTER_VERSION,

        routingType:
            data.routingType ??
            null,

        routingId:
            data.routingId ??
            null,

        orderId:
            data.orderId ??
            null,

        transportId:
            data.transportId ??
            null,

        executionId:
            data.executionId ??
            null,

        gateway:
            "ExchangeGateway",

        gatewayResult:
            data.gatewayResult ??
            null,

        reason:
            data.reason ??
            null,

        error:
            data.error ??
            null,

        timestamp:
            data.timestamp ??
            now()

    };

}

 /* ============================================================
 * SECTION 9 — ORDER ROUTING
 * ============================================================
 */

/**
 * Route a normalized order through the actual
 * ExchangeGateway.submitOrder(order) contract.
 *
 * The ExchangeGateway remains responsible for:
 *
 * • Order validation
 * • Governance approval
 * • Paper execution
 * • Live execution
 * • Exchange interaction
 * • Execution statistics
 * • Execution confirmation events
 * • Execution failure events
 *
 * @param {Object} order
 * @returns {Promise<Object>}
 */
async function routeOrder(
    order
) {

    routerState.totalRequests++;

    const routingId =
        generateRoutingId();

    const validation =
        validateOrderRoute(
            order
        );

    if (
        !validation.valid
    ) {

        routerState.rejectedRequests++;

        routerState.failedRoutes++;

        routerState.status =
            ROUTER_STATUS.FAILED;

        const result =
            buildRoutingResult({

                success:
                    false,

                decision:
                    ROUTING_DECISION.REJECT,

                routed:
                    false,

                status:
                    ROUTER_STATUS.FAILED,

                routingType:
                    ROUTING_TYPE.ORDER,

                routingId,

                orderId:
                    resolveOrderId(
                        order
                    ),

                reason:
                    validation.reason

            });

        routerState.lastResult =
            result;

        routerState.updatedAt =
            result.timestamp;

        publishEvent(

            "order_router:rejected",

            result

        );

        return result;

    }

    if (
        !routerState.exchangeGateway
    ) {

        routerState.rejectedRequests++;

        routerState.failedRoutes++;

        routerState.status =
            ROUTER_STATUS.FAILED;

        const result =
            buildRoutingResult({

                success:
                    false,

                decision:
                    ROUTING_DECISION.REJECT,

                routed:
                    false,

                status:
                    ROUTER_STATUS.FAILED,

                routingType:
                    ROUTING_TYPE.ORDER,

                routingId,

                orderId:
                    resolveOrderId(
                        order
                    ),

                reason:
                    "EXCHANGE_GATEWAY_NOT_CONFIGURED"

            });

        routerState.lastResult =
            result;

        routerState.updatedAt =
            result.timestamp;

        publishEvent(

            "order_router:rejected",

            result

        );

        return result;

    }

    if (
        typeof routerState.exchangeGateway.submitOrder !==
        "function"
    ) {

        routerState.rejectedRequests++;

        routerState.failedRoutes++;

        routerState.status =
            ROUTER_STATUS.FAILED;

        const result =
            buildRoutingResult({

                success:
                    false,

                decision:
                    ROUTING_DECISION.REJECT,

                routed:
                    false,

                status:
                    ROUTER_STATUS.FAILED,

                routingType:
                    ROUTING_TYPE.ORDER,

                routingId,

                orderId:
                    resolveOrderId(
                        order
                    ),

                reason:
                    "EXCHANGE_GATEWAY_SUBMIT_ORDER_UNAVAILABLE"

            });

        routerState.lastResult =
            result;

        routerState.updatedAt =
            result.timestamp;

        publishEvent(

            "order_router:rejected",

            result

        );

        return result;

    }

    routerState.status =
        ROUTER_STATUS.ROUTING;

    routerState.lastRoutingId =
        routingId;

    routerState.lastOrderId =
        resolveOrderId(
            order
        );

    routerState.lastRoute = {

        routingId,

        routingType:
            ROUTING_TYPE.ORDER,

        orderId:
            routerState.lastOrderId,

        startedAt:
            now()

    };

    publishEvent(

        "order_router:routing",

        {

            router:
                ROUTER_NAME,

            routingId,

            routingType:
                ROUTING_TYPE.ORDER,

            orderId:
                routerState.lastOrderId,

            timestamp:
                now()

        }

    );

    try {

        /*
         * EXACT EXCHANGE GATEWAY CONTRACT
         *
         * ExchangeGateway.submitOrder(order)
         */

        const gatewayResult =
            await routerState.exchangeGateway.submitOrder(
                order
            );

        routerState.successfulRoutes++;

        routerState.status =
            ROUTER_STATUS.COMPLETED;

        const result =
            buildRoutingResult({

                success:
                    true,

                decision:
                    ROUTING_DECISION.ROUTE,

                routed:
                    true,

                status:
                    ROUTER_STATUS.COMPLETED,

                routingType:
                    ROUTING_TYPE.ORDER,

                routingId,

                orderId:
                    resolveOrderId(
                        order
                    ),

                executionId:
                    gatewayResult?.orderId ??
                    null,

                gatewayResult

            });

        routerState.lastResult =
            result;

        routerState.updatedAt =
            result.timestamp;

        publishEvent(

            "order_router:routed",

            result

        );

        return result;

    } catch (error) {

        routerState.failedRoutes++;

        routerState.status =
            ROUTER_STATUS.FAILED;

        const result =
            buildRoutingResult({

                success:
                    false,

                decision:
                    ROUTING_DECISION.REJECT,

                routed:
                    false,

                status:
                    ROUTER_STATUS.FAILED,

                routingType:
                    ROUTING_TYPE.ORDER,

                routingId,

                orderId:
                    resolveOrderId(
                        order
                    ),

                reason:
                    "EXCHANGE_GATEWAY_SUBMISSION_FAILED",

                error:
                    error.message ??
                    String(error)

            });

        routerState.lastResult =
            result;

        routerState.updatedAt =
            result.timestamp;

        publishEvent(

            "order_router:failed",

            result

        );

        return result;

    }

     }

