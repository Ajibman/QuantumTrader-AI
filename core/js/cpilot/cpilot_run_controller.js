 /**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 35 — CPILOT RUN CONTROLLER (HARDENED)
 * Production Version 2.0
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

/**
 * START CPILOT EXECUTION
 */
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

    let result;

    try {

        result = await orchestrator.run(signal, portfolio);

    } catch (e) {

        state.running = false;

        eventHub?.emit?.(

            "cpilot:error",

            {

                message: e.message

            }

        );

        return {

            success: false,

            error: e.message

        };

    }

    const safeResult = result || {

        approved: false,

        cycle: null

    };

    state.completedRuns++;

    state.lastResult = safeResult;

    eventHub?.emit?.(

        "cpilot:complete",

        {

            approved: !!safeResult.approved,

            cycle: safeResult.cycle

        }

    );

    state.running = false;

    return safeResult;

}

/**
 * PAUSE CPILOT
 */
export function pauseCPilot() {

    state.paused = true;

    eventHub?.emit?.("cpilot:pause", {});

}

/**
 * RESUME CPILOT
 */
export function resumeCPilot() {

    state.paused = false;

    eventHub?.emit?.("cpilot:resume", {});

}

/**
 * STOP CPILOT
 */
export function stopCPilot() {

    state.running = false;

    state.paused = false;

    eventHub?.emit?.("cpilot:stop", {});

}

/**
 * STATUS
 */
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
