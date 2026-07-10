 /**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 35 — CPILOT RUN CONTROLLER (HARDENED+)
 * Production Version 2.1
 * ============================================================
 */

import eventHub from "../event_hub.js";
import orchestrator, { initializeSystem } from "../bootstrap.js";

import { initializeCPilot } from "../connectors/cpilot_engine.js";
import { getMetaBrainStatus } from "../meta_brain.js";

/**
 * ============================================================
 * INTERNAL STATE
 * ============================================================
 */

const state = {
    running: false,
    paused: false,
    startedAt: null,
    completedRuns: 0,
    failedRuns: 0,
    lastResult: null,
    lastError: null
};

let armedSignal = null;

/**
 * ============================================================
 * VALIDATION HELPERS
 * ============================================================
 */

function validateSignal(signal) {
    if (!signal || typeof signal !== "object") {
        return { ok: false, message: "Invalid signal object" };
    }
    return { ok: true };
}

function validatePortfolio(portfolio) {
    if (!portfolio || typeof portfolio !== "object") {
        return { ok: false, message: "Invalid portfolio object" };
    }
    return { ok: true };
}

export function armCPilot(signal) {

    const check = validateSignal(signal);

    if (!check.ok) {
        throw new Error(check.message);
    }

    armedSignal = signal;

    eventHub?.emit?.("cpilot:armed", {
        timestamp: Date.now()
    });

    return true;
}

/**
 * ============================================================
 * START CPILOT EXECUTION
 * ============================================================
 */

export async function startCPilot(signal = null, portfolio = {}) {

    signal = signal || armedSignal;

    if (!signal) {
        return {
            success: false,
            error: "CPilot has not been armed."
        };
    }

    // Prevent double execution
    if (state.running) {
        return {
            success: false,
            message: "CPilot is already running."
        };
    }

    const signalCheck = validateSignal(signal);
    const portfolioCheck = validatePortfolio(portfolio);

    if (!signalCheck.ok || !portfolioCheck.ok) {
        return {
            success: false,
            error: signalCheck.message || portfolioCheck.message
        };
    }

    try {
        initializeSystem();
     
     await initializeCPilot();

const metaBrain = getMetaBrainStatus();

eventHub?.emit?.("cpilot:meta_brain_ready", {
    timestamp: Date.now(),
    metaBrain
});
     
        state.running = true;
        state.paused = false;
        state.startedAt = Date.now();

        eventHub?.emit?.("cpilot:start", {
            timestamp: state.startedAt
        });

        const result = await orchestrator.run(signal, portfolio);

        const safeResult = result ?? {
            approved: false,
            cycle: null
        };

        state.completedRuns++;
        state.lastResult = safeResult;

        eventHub?.emit?.("cpilot:complete", {
            approved: !!safeResult.approved,
            cycle: safeResult.cycle,
            timestamp: Date.now()
        });

        return safeResult;

    } catch (e) {

        state.failedRuns++;
        state.lastError = e.message;

        eventHub?.emit?.("cpilot:error", {
            message: e.message,
            timestamp: Date.now()
        });

        return {
            success: false,
            error: e.message
        };

    } finally {

    state.running = false;
    armedSignal = null;
}

}

/**
 * ============================================================
 * CONTROL FUNCTIONS
 * ============================================================
 */

export function pauseCPilot() {
    state.paused = true;
    eventHub?.emit?.("cpilot:pause", { timestamp: Date.now() });
}

export function resumeCPilot() {
    state.paused = false;
    eventHub?.emit?.("cpilot:resume", { timestamp: Date.now() });
}

export function stopCPilot() {

    state.running = false;
    state.paused = false;

    armedSignal = null;

    eventHub?.emit?.("cpilot:stop", {
        timestamp: Date.now()
    });
}

/**
 * ============================================================
 * STATUS
 * ============================================================
 */

export function getCPilotStatus() {
    return {
        ...state,
        orchestrator: orchestrator.getSystemStatus?.(),
        metaBrain: getMetaBrainStatus(),
     health: {
            running: state.running,
            hasError: !!state.lastError,
            lastError: state.lastError
        }
    };
}

/**
 * ============================================================
 * EXPORT
 * ============================================================
 */
    export default {
    armCPilot,
    startCPilot,
    pauseCPilot,
    resumeCPilot,
    stopCPilot,
    getCPilotStatus
};

         
