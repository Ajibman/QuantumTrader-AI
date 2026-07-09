 /**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 35 — CPILOT RUN CONTROLLER (HARDENED+)
 * Production Version 2.1
 * ============================================================
 */

import eventHub from "../event_hub.js";
import orchestrator, { initializeSystem } from "../bootstrap.js";

import { initializeCPilot } from "./cpilot_engine.js";
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

/**
 * ============================================================
 * START CPILOT EXECUTION
 * ============================================================
 */

export async function startCPilot(signal = {}, portfolio = {}) {

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
    eventHub?.emit?.("cpilot:stop", { timestamp: Date.now() });
}

/**
 * ============================================================
 * STATUS
 * ============================================================
 */

export function getCPilotStatus() {
    return {
        ...state,
        orchestrator: orchestrator.getSystemStatus(),
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
    startCPilot,
    pauseCPilot,
    resumeCPilot,
    stopCPilot,
    getCPilotStatus
};
