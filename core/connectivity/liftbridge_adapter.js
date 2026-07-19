/**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * LIFTBRIDGE ADAPTER
 * Serial 3.3 — Provider Translation Layer
 * Production Version 1.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * Translates internal execution routes into
 * standardized provider requests.
 *
 * RESPONSIBILITIES
 * ----------------
 * • Initialize adapter
 * • Validate routed executions
 * • Build provider requests
 * • Publish adapter events
 * • Return provider contracts
 *
 * THIS ADAPTER NEVER:
 *
 * • executes trades
 * • calculates risk
 * • selects strategies
 * • authorizes businesses
 * • communicates with exchanges
 *
 * ============================================================
 */

import eventHub from "../event_hub.js";

/* ============================================================
 * ADAPTER STATE
 * ============================================================
 */

const adapterState = {

    initialized: false,

    ready: false,

    provider: "Liftbridge",

    version: "1.0.0",

    totalRequests: 0,

    rejectedRequests: 0,

    lastRequest: null

};

/* ============================================================
 * INITIALIZE ADAPTER
 * ============================================================
 */

export function initializeAdapter() {

    adapterState.initialized = true;

    adapterState.ready = true;

    eventHub.emit(
        "liftbridge:initialized",
        {
            provider: adapterState.provider,
            version: adapterState.version,
            timestamp: Date.now()
        }
    );

    return getAdapterStatus();

}

/* ============================================================
 * VALIDATE ROUTE
 * ============================================================
 */

export function validateProviderRequest(
    route = {}
) {

    if (!adapterState.ready) {

        return {

            success: false,

            message:
                "Liftbridge Adapter is not initialized."

        };

    }

    if (
        !route ||
        typeof route !== "object"
    ) {

        adapterState.rejectedRequests++;

        return {

            success: false,

            message:
                "Invalid routing object."

        };

    }

    if (!route.routeId) {

        adapterState.rejectedRequests++;

        return {

            success: false,

            message:
                "Route ID missing."

        };

    }

    return {

        success: true

    };

}

/* ============================================================
 * BUILD PROVIDER REQUEST
 * ============================================================
 */

export function buildProviderRequest(
    route
) {

    const validation =
        validateProviderRequest(
            route
        );

    if (!validation.success) {

        return validation;

    }

    const execution =
        route.execution || {};

    const providerRequest = {

        requestId:
            `REQ-${Date.now()}`,

        provider:
            adapterState.provider,

        executionId:
            execution.executionId,

        routeId:
            route.routeId,

        environment:
            execution.metadata?.environment ||
            "simulation",

        source:
            execution.source,

        stage:
            "provider_request",

        payload:
            execution,

        metadata: {

            translatedBy:
                "LiftbridgeAdapter",

            translatedAt:
                Date.now(),

            version:
                adapterState.version

        }

    };

    adapterState.totalRequests++;

    adapterState.lastRequest =
        providerRequest;

    eventHub.emit(
        "liftbridge:request_created",
        providerRequest
    );

    return {

        success: true,

        providerRequest

    };

}

/* ============================================================
 * STATUS
 * ============================================================
 */

export function getAdapterStatus() {

    return {

        ...adapterState

    };

}

/* ============================================================
 * RESET
 * ============================================================
 */

export function resetAdapter() {

    adapterState.initialized = false;

    adapterState.ready = false;

    adapterState.totalRequests = 0;

    adapterState.rejectedRequests = 0;

    adapterState.lastRequest = null;

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {

    initializeAdapter,

    validateProviderRequest,

    buildProviderRequest,

    getAdapterStatus,

    resetAdapter

};
