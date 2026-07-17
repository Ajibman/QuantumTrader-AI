// ============================================================
// QuantumTrader-AI™ (Qonexai™)
// Business Authorization Manager
// Serial 1.7 — Production Version 1.0
// ============================================================
//
// PURPOSE
// -------
// Controls business authorization for QuantumTrader-AI.
//
// Responsibilities:
//
// • Validate user authorization
// • Validate subscription status
// • Validate feature entitlement
// • Validate account state
// • Return authorization decision
//
// NEVER:
//
// • Execute trades
// • Evaluate trading strategies
// • Calculate trading risk
// • Manage market connectivity
//
// ============================================================

import eventHub from "../brain/meta_brain/engines/event_hub.js";

/* ============================================================
 * AUTHORIZATION STATE
 * ============================================================
 */

const authorizationState = {

    authenticated: false,

    authorized: false,

    subscription: null,

    accountStatus: "inactive",

    expiresAt: null,

    permissions: {},

    lastDecision: null

};

/* ============================================================
 * FEATURE MATRIX
 * ============================================================
 */

const SUBSCRIPTION_MATRIX = {

    trial: {

        simulation: true,
        traderLab: true,
        tradingFloor: false,
        liveTrading: false

    },

    monthly: {

        simulation: true,
        traderLab: true,
        tradingFloor: true,
        liveTrading: false

    },

    sixMonth: {

        simulation: true,
        traderLab: true,
        tradingFloor: true,
        liveTrading: false

    },

    annual: {

        simulation: true,
        traderLab: true,
        tradingFloor: true,
        liveTrading: false

    },

    ownerTest: {

        simulation: true,
        traderLab: true,
        tradingFloor: true,
        liveTrading: false

    }

};

/* ============================================================
 * AUTHORIZE USER
 * ============================================================
 */

export function authorizeUser({

    authenticated = false,

    subscription = null,

    accountStatus = "inactive",

    expiresAt = null

} = {}) {

    if (!authenticated) {

        return deny(
            "USER_NOT_AUTHENTICATED"
        );

    }

    if (accountStatus !== "active") {

        return deny(
            "ACCOUNT_INACTIVE"
        );

    }

    if (!SUBSCRIPTION_MATRIX[subscription]) {

        return deny(
            "INVALID_SUBSCRIPTION"
        );

    }

    authorizationState.authenticated = true;
    authorizationState.authorized = true;
    authorizationState.subscription = subscription;
    authorizationState.accountStatus = accountStatus;
    authorizationState.expiresAt = expiresAt;
    authorizationState.permissions =
        SUBSCRIPTION_MATRIX[subscription];

    const result = {

        authorized: true,

        subscription,

        permissions:
            authorizationState.permissions,

        expiresAt,

        reason: null

    };

    authorizationState.lastDecision = result;

    eventHub.emit(
        "authorization:approved",
        result
    );

    return result;

}

/* ============================================================
 * DENY
 * ============================================================
 */

function deny(reason) {

    authorizationState.authorized = false;

    const result = {

        authorized: false,

        reason

    };

    authorizationState.lastDecision = result;

    eventHub.emit(
        "authorization:denied",
        result
    );

    return result;

}

/* ============================================================
 * FEATURE CHECK
 * ============================================================
 */

export function hasPermission(feature) {

    return !!authorizationState.permissions[feature];

}

/* ============================================================
 * STATUS
 * ============================================================
 */

export function getAuthorizationStatus() {

    return {

        ...authorizationState

    };

}

/* ============================================================
 * RESET
 * ============================================================
 */

export function resetAuthorization() {

    authorizationState.authenticated = false;
    authorizationState.authorized = false;
    authorizationState.subscription = null;
    authorizationState.accountStatus = "inactive";
    authorizationState.expiresAt = null;
    authorizationState.permissions = {};
    authorizationState.lastDecision = null;

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {

    authorizeUser,

    hasPermission,

    getAuthorizationStatus,

    resetAuthorization

};
