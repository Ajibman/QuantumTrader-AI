 /**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 34 — CPILOT RUN CONTROLLER
 * Production Version 2.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * Controls CPilot execution.
 *
 * Responsibilities:
 * • Start autonomous simulation
 * • Submit signals to MetaSystemOrchestrator
 * • Publish runtime events
 * • Maintain CPilot runtime state
 *
 * NOTE
 * ----
 * CPilot never initializes the runtime.
 * It uses the singleton Bootstrap instance.
 * ============================================================
 */

import eventHub from "../event_hub.js";

import orchestrator, {
    initializeSystem
} from "../bootstrap.js";

const state = {

    running: false,

    paused: false,

    startedAt: null,

    completedRuns: 0,

    lastResult: null

};

export async function startCPilot(signal = {}, portfolio = {}) {

    if (state.running) {

        return {

            success: false,

            message: "CPilot is already running."

        };

    }

    initializeSystem();

    state.running = true;

    state.paused = false;

    state.startedAt = Date.now();

    eventHub?.emit?.(

        "cpilot:start",

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

            "cpilot:complete",

            {

                approved: result.approved,

                cycle: result.cycle

            }

        );

        return result;

    }

    catch (error) {

        eventHub?.emit?.(

            "cpilot:error",

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

export function pauseCPilot() {

    state.paused = true;

    eventHub?.emit?.(

        "cpilot:pause",

        {}

    );

}

export function resumeCPilot() {

    state.paused = false;

    eventHub?.emit?.(

        "cpilot:resume",

        {}

    );

}

export function stopCPilot() {

    state.running = false;

    state.paused = false;

    eventHub?.emit?.(

        "cpilot:stop",

        {}

    );

}

export function getCPilotStatus() {

    return {

        ...state,

        orchestrator:

            orchestrator.getSystemStatus()

    };

}

export default {

    startCPilot,

    pauseCPilot,

    resumeCPilot,

    stopCPilot,

    getCPilotStatus

};
