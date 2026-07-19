 /**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 36 — TRADING FLOOR RUN CONTROLLER
 * Production Version 1.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * Trading Floor execution controller.
 *
 * Responsibilities:
 * • Validate Trading Floor entry
 * • Initialize Trading Floor runtime
 * • Coordinate execution lifecycle
 * • Publish lifecycle events
 * • Return execution results
 *
 * IMPORTANT
 * ---------
 * This controller NEVER:
 *
 * • creates trading engines
 * • evaluates strategies
 * • calculates risk
 * • executes trades directly
 *
 * Those responsibilities belong to the
 * Trading Floor engine and orchestrator.
 * ============================================================
 */

import eventHub from "../event_hub.js";

import {
    assessRisk
} from "../../risk/risk_governor.js";

import {
    initializeExecution,
    prepareExecution
} from "./tradingfloor_engine.js";

import orchestrator, {
    initializeSystem
} from "../bootstrap.js";

/* ============================================================
 * CONTROLLER STATE
 * ============================================================
 */

const state = {

    running: false,

    startedAt: null,

    completedRuns: 0,

    failedRuns: 0,

    lastRunAt: null,

    lastResult: null,

    lastError: null

};

/* ============================================================
 * VALIDATION HELPERS
 * ============================================================
 */

function validateSignal(signal) {

    if (!signal || typeof signal !== "object") {

        return {
            ok: false,
            message: "Invalid signal object."
        };

    }

    return { ok: true };

}

function validatePortfolio(portfolio) {

    if (!portfolio || typeof portfolio !== "object") {

        return {
            ok: false,
            message: "Invalid portfolio object."
        };

    }

    return { ok: true };

}

/* ============================================================
 * START TRADING FLOOR
 * ============================================================
 */

export async function startTradingFloor(
    signal = {},
    portfolio = {}
) {

    if (state.running) {

        return {

            success: false,

            message:
                "Trading Floor is already running."

        };

    }

    const signalCheck =
        validateSignal(signal);

    const portfolioCheck =
        validatePortfolio(portfolio);

    if (!signalCheck.ok || !portfolioCheck.ok) {

        return {

            success: false,

            error:
                signalCheck.message ||
                portfolioCheck.message

        };

    }

    try {

                 initializeSystem();

        // ====================================================
        // SERIAL 1.9.1 — RISK GOVERNOR ENFORCEMENT GATE
        // ====================================================

        const riskAssessment =
            assessRisk({

                confidence:
                    signal?.confidence ?? 0,

                volatility:
                    signal?.volatility ?? 1,

                capital:
                    portfolio?.capital ?? 0,

                mode:
                    signal?.mode ||
                    portfolio?.mode ||
                    "simulation",

                authorization:
                    signal?.authorization ??
                    portfolio?.authorization ??
                    false,

                connectivity:
                    signal?.connectivity ??
                    portfolio?.connectivity ??
                    false

            });

        // ====================================================
        // ABSOLUTE SAFETY STOP
        // ====================================================

        if (
            riskAssessment.decision === "DENY"
        ) {

            eventHub?.emit?.(
                "tradingfloor:risk_denied",
                riskAssessment
            );

            state.lastResult =
                riskAssessment;

            state.lastRunAt =
                Date.now();

            return {

                success: false,

                approved: false,

                stage:
                    "risk_governor",

                riskAssessment

            };

        }

        // ====================================================
        // RISK APPROVED — CONTINUE
        // ====================================================

        state.running = true;

        state.startedAt = Date.now();

        eventHub?.emit?.(
            "tradingfloor:start",
            {
                timestamp:
                    state.startedAt
            }
        );
                const result =
                    await orchestrator.run(
                        signal,
                portfolio
                    );

        const safeResult =
            result ?? {

                approved: false,

                cycle: null

            };

        state.completedRuns++;

        state.lastRunAt = Date.now();

        state.lastResult = safeResult;

        eventHub?.emit?.(
            "tradingfloor:complete",
            {

                approved:
                    !!safeResult.approved,

                cycle:
                    safeResult.cycle,

                timestamp:
                    Date.now()

            }
        );

        return safeResult;

    } catch (error) {

        state.failedRuns++;

        state.lastError =
            error.message;

        eventHub?.emit?.(
            "tradingfloor:error",
            {

                message:
                    error.message,

                timestamp:
                    Date.now()

            }
        );

        return {

            success: false,

            error:
                error.message

        };

    } finally {

        state.running = false;

    }

}
        
/* ============================================================
 * STATUS
 * ============================================================
 */

export function getTradingFloorStatus() {

    return {

        ...state,

        orchestrator:
            orchestrator.getSystemStatus()

    };

}

export function isTradingFloorRunning() {

    return state.running;

}

/* ============================================================
 * RESET
 * ============================================================
 */

export function resetTradingFloor() {

    state.running = false;

    state.startedAt = null;

    state.completedRuns = 0;

    state.failedRuns = 0;

    state.lastRunAt = null;

    state.lastResult = null;

    state.lastError = null;

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {

    startTradingFloor,

    getTradingFloorStatus,

    isTradingFloorRunning,

    resetTradingFloor

};


                    
