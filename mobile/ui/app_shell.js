 // ============================================================
// QuantumTrader-AI™ (Qonexai™)
// STAGE 32 — MOBILE APPLICATION SHELL
// Production Version 2.0
// ============================================================
//
// PURPOSE
// -------
// Runtime lifecycle manager.
//
// Responsibilities:
// • Initialize application runtime
// • Coordinate bootstrap lifecycle
// • Register App Shell with Event Hub
// • Verify runtime health
// • Publish runtime events
// • Expose application status
//
// NOTE
// ----
// This file DOES NOT:
//
// • create trading engines
// • execute trading logic
// • instantiate MetaSystemOrchestrator
//
// Those responsibilities belong exclusively to:
//
// core/js/bootstrap.js
//
// ============================================================

import eventHub from "../../core/brain/meta_brain/engines/event_hub.js";

import orchestrator, {
    initializeSystem,
    shutdownSystem,
    getSystemStatus
} from "../../core/js/bootstrap.js";

/* ============================================================
 * APPLICATION CONSTANTS
 * ============================================================
 */

const APP_NAME = "QuantumTrader-AI";

const APP_VERSION = "2.0.0";

/* ============================================================
 * APPLICATION STATE
 * ============================================================
 */

const appState = {

    initialized: false,

    starting: false,

    shuttingDown: false,

    startedAt: null,

    version: APP_VERSION,

    runtime: "BOOTING"

};

/* ============================================================
 * INITIALIZE APPLICATION
 * ============================================================
 */

export async function initializeApplication() {

    if (appState.initialized) {

        return {

            success: true,

            state: getApplicationState()

        };

    }

    if (appState.starting) {

        return {

            success: false,

            message: "Application is already starting."

        };

    }

    appState.starting = true;

    try {

        // ----------------------------------------------------
        // Register App Shell
        // ----------------------------------------------------

        eventHub?.registerModule?.(

            "app_shell",

            {

                role: "application_shell",

                version: APP_VERSION,

                runtime: "production"

            }

        );

        // ----------------------------------------------------
        // Initialize Runtime
        // ----------------------------------------------------

        initializeSystem();

        // ----------------------------------------------------
        // Verify Runtime
        // ----------------------------------------------------

        if (!orchestrator.isHealthy()) {

            throw new Error(

                "Runtime health verification failed."

            );

        }

        appState.initialized = true;

        appState.startedAt = Date.now();

        appState.runtime = "READY";

        // ----------------------------------------------------
        // Notify Runtime
        // ----------------------------------------------------

        eventHub?.emit?.(

            "app:ready",

            {

                app: APP_NAME,

                version: APP_VERSION,

                startedAt: appState.startedAt

            }

        );

        return {

            success: true,

            state: getApplicationState()

        };

    }

    catch (error) {

        appState.runtime = "ERROR";

        eventHub?.emit?.(

            "app:error",

            {

                app: APP_NAME,

                message: error.message

            }

        );

        throw error;

    }

    finally {

        appState.starting = false;

    }

}

/* ============================================================
 * STATUS
 * ============================================================
 */

export function isApplicationReady() {

    return (

        appState.initialized &&

        orchestrator.isHealthy()

    );

}

export function getApplicationState() {

    return {

        ...appState,

        system: getSystemStatus()

    };

}

/* ============================================================
 * SHUTDOWN
 * ============================================================
 */

export function shutdownApplication() {

    if (

        appState.shuttingDown ||

        !appState.initialized

    ) {

        return;

    }

    appState.shuttingDown = true;

    eventHub?.emit?.(

        "app:shutdown",

        {

            app: APP_NAME,

            shutdownAt: Date.now()

        }

    );

    shutdownSystem();

    appState.initialized = false;

    appState.runtime = "STOPPED";

    appState.shuttingDown = false;

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default {

    initializeApplication,

    shutdownApplication,

    isApplicationReady,

    getApplicationState

};
