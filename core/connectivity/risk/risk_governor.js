// ============================================================
// QuantumTrader-AI™ (Qonexai™)
// SERIAL 1.9 — RISK GOVERNOR
// Stage 2 — Production Implementation
// Version 1.0
// ============================================================
//
// PURPOSE
// -------
// Final Technical Safety Authority.
//
// Determines whether an execution request may proceed
// beyond the Market Connectivity Layer.
//
// This module NEVER:
//
// • executes trades
// • selects strategies
// • connects to exchanges
// • overrides Business Authorization
// • overrides Governance policies
//
// ============================================================

import eventHub from "../brain/meta_brain/engines/event_hub.js";

/* ============================================================
 * GOVERNOR STATE
 * ============================================================
 */

const governorState = {

    initialized: true,

    enabled: true,

    version: "1.0.0",

    totalAssessments: 0,

    approvedAssessments: 0,

    deniedAssessments: 0,

    lastAssessment: null

};

/* ============================================================
 * GOVERNOR POLICY
 * ============================================================
 */

const governorPolicy = {

    minimumConfidence: 0.70,

    maximumVolatility: 0.85,

    minimumCapital: 100,

    allowSimulation: true

};

/* ============================================================
 * CALCULATE RISK SCORE
 * ============================================================
 */

function calculateRiskScore({

    confidence = 0,

    volatility = 1,

    capital = 0

}) {

    let score = 0;

    score += (1 - confidence) * 0.40;

    score += volatility * 0.40;

    if (capital < governorPolicy.minimumCapital) {
        score += 0.20;
    }

    return Math.min(1, Number(score.toFixed(2)));

}

/* ============================================================
 * RISK ASSESSMENT
 * ============================================================
 */

export function assessRisk({

    confidence = 0,

    volatility = 1,

    capital = 0,

    mode = "simulation",

    authorization = true,

    connectivity = true

} = {}) {

    const reasons = [];

    if (!authorization) {

        reasons.push({

            code: "BUSINESS_AUTHORIZATION_FAILED",

            message:
                "Business authorization failed."

        });

    }

    if (confidence < governorPolicy.minimumConfidence) {

        reasons.push({

            code: "LOW_AI_CONFIDENCE",

            message:
                "AI confidence below minimum threshold."

        });

    }

    if (volatility > governorPolicy.maximumVolatility) {

        reasons.push({

            code: "HIGH_MARKET_VOLATILITY",

            message:
                "Market volatility exceeds permitted threshold."

        });

    }

    if (capital < governorPolicy.minimumCapital) {

        reasons.push({

            code: "INSUFFICIENT_CAPITAL",

            message:
                "Available capital below minimum requirement."

        });

    }

    if (!connectivity) {

        reasons.push({

            code: "CONNECTIVITY_UNAVAILABLE",

            message:
                "Market connectivity unavailable."

        });

    }

    if (
        mode === "simulation" &&
        !governorPolicy.allowSimulation
    ) {

        reasons.push({

            code: "SIMULATION_DISABLED",

            message:
                "Simulation mode disabled."

        });

    }

    const riskScore =
        calculateRiskScore({
            confidence,
            volatility,
            capital
        });

    const approved =
        reasons.length === 0;

    const assessment = {

        approved,

        decision:
            approved ? "ALLOW" : "DENY",

        riskScore,

        reasons,

        timestamp: Date.now()

    };

    governorState.totalAssessments++;

    governorState.lastAssessment =
        assessment;

    if (approved) {

        governorState.approvedAssessments++;

        eventHub.emit(
            "risk:approved",
            assessment
        );

    } else {

        governorState.deniedAssessments++;

        eventHub.emit(
            "risk:denied",
            assessment
        );

    }

    return assessment;

}

/* ============================================================
 * POLICY
 * ============================================================
 */

export function getGovernorPolicy() {

    return {

        ...governorPolicy

    };

}

export function updateGovernorPolicy(
    updates = {}
) {

    Object.assign(
        governorPolicy,
        updates
    );

    eventHub.emit(
        "risk:policy_updated",
        governorPolicy
    );

    return getGovernorPolicy();

}

/* ============================================================
 * STATUS
 * ============================================================
 */

export function getGovernorStatus() {

    return {

        ...governorState,

        policy:
            getGovernorPolicy()

    };

}

/* ============================================================
 * RESET
 * ============================================================
 */

export function resetGovernor() {

    governorState.totalAssessments = 0;

    governorState.approvedAssessments = 0;

    governorState.deniedAssessments = 0;

    governorState.lastAssessment = null;

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {

    assessRisk,

    getGovernorPolicy,

    updateGovernorPolicy,

    getGovernorStatus,

    resetGovernor

};
