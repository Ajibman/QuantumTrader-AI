/**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 33 — TRADERLAB RUN CONTROLLER
 * Production Version 2.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * TraderLab execution controller.
 *
 * Responsibilities:
 * • Launch TraderLab runtime
 * • Acquire simulation signals
 * • Route execution through the MetaSystemOrchestrator
 * • Publish lifecycle events
 * • Return execution results
 *
 * IMPORTANT
 * ---------
 * This controller NEVER:
 *
 * • creates engines
 * • allocates capital
 * • evaluates risk
 * • selects strategies
 * • executes trades
 *
 * Those responsibilities belong exclusively to
 * MetaSystemOrchestrator.
 * ============================================================
 */

import eventHub from "../event_hub.js";

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

    lastResult: null

};

/* ============================================================
 * START TRADERLAB
 * ============================================================
 */

export async function startTraderLab(signal = {}, portfolio = {}) {

    if (state.running) {

        return {

            success: false,

            message: "TraderLab is already running."

        };

    }

    initializeSystem();

    state.running = true;

    state.startedAt = Date.now();

    eventHub?.emit?.(

        "traderlab:start",

        {

            timestamp: state.startedAt

        }

    );

    try {

        const result = await orchestrator.run(

            signal,

            portfolio

        );

        state.completedRuns++;

        state.lastResult = result;

        eventHub?.emit?.(

            "traderlab:complete",

            {

                approved: result.approved,

                cycle: result.cycle

            }

        );

        return result;

    }

    catch (error) {

        eventHub?.emit?.(

            "traderlab:error",

            {

                message: error.message

            }

        );

        throw error;

    }

    finally {

        state.running = false;

    }

}

/* ============================================================
 * STATUS
 * ============================================================
 */

export function getTraderLabStatus() {

    return {

        ...state,

        orchestrator:

            orchestrator.getSystemStatus()

    };

}

export function isTraderLabRunning() {

    return state.running;

}

/* ============================================================
 * RESET
 * ============================================================
 */

export function resetTraderLab() {

    state.running = false;

    state.startedAt = null;

    state.lastResult = null;

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {

    startTraderLab,

    getTraderLabStatus,

    isTraderLabRunning,

    resetTraderLab

};
