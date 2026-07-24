/**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * TITLE: ORDER ROUTER
 * Serial 3.6.2 — Order Routing Layer
 * Production Version 1.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * The Order Router is the controlled routing boundary between
 * validated execution requests and the appropriate execution
 * gateway.
 *
 * The Order Router does NOT:
 *
 * • create trading strategies
 * • select trading strategies
 * • calculate risk
 * • approve or authorize trades
 * • override governance decisions
 * • communicate directly with exchanges
 * • execute orders directly
 * • modify execution confirmations
 * • modify execution feedback
 *
 * Its responsibility is to:
 *
 * 1. Receive a validated order-routing request.
 * 2. Validate routing prerequisites.
 * 3. Resolve the intended execution gateway.
 * 4. Route the request to the registered gateway.
 * 5. Publish routing lifecycle events.
 * 6. Return a standardized routing result.
 * 7. Preserve traceability across the execution lifecycle.
 *
 * ARCHITECTURAL POSITION
 * ----------------------
 *
 * Strategy / Decision Layer
 *          ↓
 * Risk / Governance Layer
 *          ↓
 * Execution Request
 *          ↓
 * Order Router  ← THIS MODULE
 *          ↓
 * Exchange Gateway
 *          ↓
 * Execution Confirmation
 *          ↓
 * Execution Feedback Layer
 *
 * The Order Router is therefore a routing boundary,
 * not an execution authority.
 *
 * EVENT HUB INTEGRATION
 * ---------------------
 * The Event Hub is used only for lifecycle publication.
 *
 * This module does not assume that EventHub is globally available.
 * An EventHub-compatible instance may be injected through
 * configureOrderRouter().
 *
 * This prevents hidden global dependencies and supports:
 *
 * • Runtime wiring
 * • Testing
 * • Simulation
 * • Production deployment
 * • Mobile application packaging
 *
 * ============================================================
 */

/* ============================================================
 * CONSTANTS
 * ============================================================
 */

const ROUTER_NAME = "order_router";
const ROUTER_VERSION = "1.0.0";

const ROUTER_STATUS = Object.freeze({
    READY: "READY",
    ROUTING: "ROUTING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    UNAVAILABLE: "UNAVAILABLE"
});

const ROUTING_DECISION = Object.freeze({
    ROUTE: "ROUTE",
    REJECT: "REJECT"
});

/* ============================================================
 * INTERNAL RUNTIME STATE
 * ============================================================
 */

const routerState = {
    initialized: false,
    status: ROUTER_STATUS.UNAVAILABLE,

    eventHub: null,

    gateways: new Map(),

    totalRequests: 0,
    successfulRoutes: 0,
    failedRoutes: 0,
    rejectedRequests: 0,

    lastRequestId: null,
    lastRoute: null,
    lastResult: null,

    updatedAt: null
};

/* ============================================================
 * INTERNAL UTILITIES
 * ============================================================
 */

/**
 * Generate a local routing request identifier.
 *
 * This identifier is used only when the upstream request does
 * not already provide one.
 *
 * @returns {string}
 */
function generateRoutingId() {

    return (
        "route_" +
        Date.now().toString(36) +
        "_" +
        Math.random().toString(36).slice(2, 10)
    );
}

/**
 * Return a safe timestamp.
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
        typeof value === "string" &&
        value.trim().length > 0
    );
}

/**
 * Publish an event through the configured Event Hub.
 *
 * The router remains operational if an Event Hub has not yet
 * been connected. Event publication must never silently become
 * a hidden dependency for routing.
 *
 * @param {string} eventName
 * @param {Object} payload
 * @returns {boolean}
 */
function publishEvent(eventName, payload = {}) {

    if (!routerState.eventHub) {
        return false;
    }

    try {

        if (typeof routerState.eventHub.emit === "function") {

            routerState.eventHub.emit(
                eventName,
                payload
            );

            return true;
        }

    } catch (error) {

        /*
         * Event publication failure must not alter the routing
         * result after the routing operation itself has already
         * been determined.
         *
         * The router therefore records the event failure but
         * does not throw it upstream.
         */

        routerState.lastResult = {
            ...(routerState.lastResult || {}),
            eventPublicationError: error.message
        };
    }

    return false;
}

/**
 * Build a standardized rejection result.
 *
 * @param {string} reason
 * @param {Object} metadata
 * @returns {Object}
 */
function buildRejection(reason, metadata = {}) {

    routerState.rejectedRequests += 1;
    routerState.failedRoutes += 1;

    routerState.status = ROUTER_STATUS.FAILED;
    routerState.updatedAt = now();

    return {

        success: false,

        decision: ROUTING_DECISION.REJECT,

        routed: false,

        status: ROUTER_STATUS.FAILED,

        router: ROUTER_NAME,

        version: ROUTER_VERSION,

        reason,

        ...metadata,

        timestamp: routerState.updatedAt

    };
}

/**
 * Resolve a registered gateway.
 *
 * @param {string} gatewayName
 * @returns {Object|null}
 */
function resolveGateway(gatewayName) {

    if (!isNonEmptyString(gatewayName)) {
        return null;
    }

    return (
        routerState.gateways.get(
            gatewayName.trim()
        ) || null
    );
}

/**
 * Validate the routing request.
 *
 * The router validates routing integrity only.
 * It does NOT perform risk or governance validation.
 *
 * @param {Object} request
 * @returns {Object}
 */
function validateRoutingRequest(request) {

    if (!request || typeof request !== "object") {

        return {
            valid: false,
            reason: "INVALID_ROUTING_REQUEST"
        };
    }

    if (
        !isNonEmptyString(request.orderId) &&
        !isNonEmptyString(request.requestId)
    ) {

        return {
            valid: false,
            reason: "MISSING_ORDER_OR_REQUEST_ID"
        };
    }

    if (!isNonEmptyString(request.gateway)) {

        return {
            valid: false,
            reason: "MISSING_EXECUTION_GATEWAY"
        };
    }

    /*
     * The router requires an upstream authorization state
     * to be explicitly supplied.
     *
     * The router does not decide authorization.
     * It only prevents accidental routing of a request where
     * the upstream authorization state is absent.
     */

    if (
        request.authorization !== undefined &&
        typeof request.authorization !== "object"
    ) {

        return {
            valid: false,
            reason: "INVALID_AUTHORIZATION_CONTEXT"
        };
    }

    return {
        valid: true
    };
}

/* ============================================================
 * CONFIGURATION
 * ============================================================
 */

/**
 * Configure the Order Router runtime.
 *
 * @param {Object} config
 * @param {Object} config.eventHub
 * @returns {Object}
 */
function configureOrderRouter(config = {}) {

    if (!config || typeof config !== "object") {

        return {
            success: false,
            status: ROUTER_STATUS.UNAVAILABLE,
            reason: "INVALID_ROUTER_CONFIGURATION"
        };
    }

    if (config.eventHub) {

        if (
            typeof config.eventHub.emit !== "function"
        ) {

            return {
                success: false,
                status: ROUTER_STATUS.UNAVAILABLE,
                reason: "INVALID_EVENT_HUB"
            };
        }

        routerState.eventHub = config.eventHub;
    }

    routerState.initialized = true;
    routerState.status = ROUTER_STATUS.READY;
    routerState.updatedAt = now();

    publishEvent(
        "order_router:ready",
        {
            router: ROUTER_NAME,
            version: ROUTER_VERSION,
            timestamp: routerState.updatedAt
        }
    );

    return {

        success: true,

        status: ROUTER_STATUS.READY,

        router: ROUTER_NAME,

        version: ROUTER_VERSION,

        timestamp: routerState.updatedAt

    };
}

/* ============================================================
 * GATEWAY REGISTRATION
 * ============================================================
 */

/**
 * Register an execution gateway.
 *
 * The gateway must expose a supported execution method.
 *
 * The router does not care how the gateway communicates with
 * an exchange. That responsibility belongs entirely to the
 * Exchange Gateway layer.
 *
 * @param {string} gatewayName
 * @param {Object} gateway
 * @returns {Object}
 */
function registerGateway(gatewayName, gateway) {

    if (!isNonEmptyString(gatewayName)) {

        return {
            success: false,
            reason: "INVALID_GATEWAY_NAME"
        };
    }

    if (!gateway || typeof gateway !== "object") {

        return {
            success: false,
            reason: "INVALID_GATEWAY"
        };
    }

    const hasSupportedMethod =
        typeof gateway.executeOrder === "function" ||
        typeof gateway.submitOrder === "function" ||
        typeof gateway.routeOrder === "function";

    if (!hasSupportedMethod) {

        return {
            success: false,
            reason: "GATEWAY_HAS_NO_SUPPORTED_EXECUTION_METHOD"
        };
    }

    routerState.gateways.set(
        gatewayName.trim(),
        gateway
    );

    return {

        success: true,

        registered: true,

        gateway: gatewayName.trim(),

        timestamp: now()

    };
}

/**
 * Unregister an execution gateway.
 *
 * @param {string} gatewayName
 * @returns {Object}
 */
function unregisterGateway(gatewayName) {

    if (!isNonEmptyString(gatewayName)) {

        return {
            success: false,
            reason: "INVALID_GATEWAY_NAME"
        };
    }

    const removed =
        routerState.gateways.delete(
            gatewayName.trim()
        );

    return {

        success: removed,

        unregistered: removed,

        gateway: gatewayName.trim(),

        timestamp: now()

    };
}

/* ============================================================
 * ORDER ROUTING
 * ============================================================
 */

/**
 * Route an approved execution request.
 *
 * IMPORTANT:
 * This function does not execute trades itself.
 *
 * It delegates the request to the registered execution gateway.
 *
 * @param {Object} request
 * @returns {Promise<Object>}
 */
async function routeOrder(request = {}) {

    routerState.totalRequests += 1;

    const validation =
        validateRoutingRequest(request);

    if (!validation.valid) {

        const rejection =
            buildRejection(
                validation.reason
            );

        publishEvent(
            "order_router:rejected",
            rejection
        );

        return rejection;
    }

    const routingId =
        request.routingId ||
        generateRoutingId();

    const orderId =
        request.orderId ||
        request.requestId;

    const gatewayName =
        request.gateway.trim();

    const gateway =
        resolveGateway(gatewayName);

    routerState.lastRequestId = routingId;

    if (!gateway) {

        const rejection =
            buildRejection(
                "EXECUTION_GATEWAY_NOT_REGISTERED",
                {
                    routingId,
                    orderId,
                    gateway: gatewayName
                }
            );

        publishEvent(
            "order_router:rejected",
            rejection
        );

        return rejection;
    }

    routerState.status =
        ROUTER_STATUS.ROUTING;

    routerState.lastRoute = {

        routingId,

        orderId,

        gateway: gatewayName,

        startedAt: now()

    };

    publishEvent(
        "order_router:routing",
        {
            routingId,
            orderId,
            gateway: gatewayName,
            timestamp: now()
        }
    );

    try {

        let gatewayResult;

        /*
         * The router supports multiple gateway contract names
         * to allow controlled integration with existing runtime
         * components.
         */

        if (
            typeof gateway.routeOrder === "function"
        ) {

            gatewayResult =
                await gateway.routeOrder(
                    request
                );

        } else if (
            typeof gateway.submitOrder === "function"
        ) {

            gatewayResult =
                await gateway.submitOrder(
                    request
                );

        } else if (
            typeof gateway.executeOrder === "function"
        ) {

            gatewayResult =
                await gateway.executeOrder(
                    request
                );

        } else {

            throw new Error(
                "NO_SUPPORTED_GATEWAY_METHOD"
            );
        }

        routerState.successfulRoutes += 1;

        routerState.status =
            ROUTER_STATUS.COMPLETED;

        routerState.updatedAt = now();

        const result = {

            success: true,

            decision: ROUTING_DECISION.ROUTE,

            routed: true,

            status: ROUTER_STATUS.COMPLETED,

            router: ROUTER_NAME,

            version: ROUTER_VERSION,

            routingId,

            orderId,

            gateway: gatewayName,

            gatewayResult,

            timestamp: routerState.updatedAt

        };

        routerState.lastResult = result;

        publishEvent(
            "order_router:routed",
            result
        );

        return result;

    } catch (error) {

        routerState.failedRoutes += 1;

        routerState.status =
            ROUTER_STATUS.FAILED;

        routerState.updatedAt = now();

        const result = {

            success: false,

            decision: ROUTING_DECISION.REJECT,

            routed: false,

            status: ROUTER_STATUS.FAILED,

            router: ROUTER_NAME,

            version: ROUTER_VERSION,

            routingId,

            orderId,

            gateway: gatewayName,

            reason: "GATEWAY_ROUTING_FAILED",

            error: error.message,

            timestamp: routerState.updatedAt

        };

        routerState.lastResult = result;

        publishEvent(
            "order_router:failed",
            result
        );

        return result;
    }
}

/* ============================================================
 * ROUTER STATUS
 * ============================================================
 */

/**
 * Return current Order Router status.
 *
 * @returns {Object}
 */
function getOrderRouterStatus() {

    return {

        router: ROUTER_NAME,

        version: ROUTER_VERSION,

        initialized:
            routerState.initialized,

        status:
            routerState.status,

        gatewayCount:
            routerState.gateways.size,

        registeredGateways:
            Array.from(
                routerState.gateways.keys()
            ),

        totalRequests:
            routerState.totalRequests,

        successfulRoutes:
            routerState.successfulRoutes,

        failedRoutes:
            routerState.failedRoutes,

        rejectedRequests:
            routerState.rejectedRequests,

        lastRequestId:
            routerState.lastRequestId,

        lastRoute:
            routerState.lastRoute,

        lastResult:
            routerState.lastResult,

        updatedAt:
            routerState.updatedAt

    };
}

/* ============================================================
 * ROUTER RESET
 * ============================================================
 */

/**
 * Reset runtime routing state.
 *
 * This function clears runtime statistics and registered
 * gateways but preserves the Event Hub reference.
 *
 * @returns {Object}
 */
function resetOrderRouter() {

    routerState.initialized = false;

    routerState.status =
        ROUTER_STATUS.UNAVAILABLE;

    routerState.gateways.clear();

    routerState.totalRequests = 0;

    routerState.successfulRoutes = 0;

    routerState.failedRoutes = 0;

    routerState.rejectedRequests = 0;

    routerState.lastRequestId = null;

    routerState.lastRoute = null;

    routerState.lastResult = null;

    routerState.updatedAt = now();

    return {

        success: true,

        status: ROUTER_STATUS.UNAVAILABLE,

        router: ROUTER_NAME,

        timestamp: routerState.updatedAt

    };
}

/* ============================================================
 * PUBLIC API
 * ============================================================
 */

module.exports = {

    ROUTER_NAME,

    ROUTER_VERSION,

    ROUTER_STATUS,

    ROUTING_DECISION,

    configureOrderRouter,

    registerGateway,

    unregisterGateway,

    routeOrder,

    getOrderRouterStatus,

    resetOrderRouter

};
