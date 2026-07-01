// ======================================================
// QuantumTrader-AI
// Mobile Application Shell
// Section 1 — Imports & Application State
// ======================================================

import eventHub from "../../core/brain/meta_brain/engines/event_hub.js";
import { initializeCPilot } from "../../core/js/cpilot/cpilot_engine.js";
import { buildSessionConfig } from "../../core/js/meta_brain.js";

/**
 * ======================================================
 * APPLICATION STATE
 * ======================================================
 */

const appState = {

  initialized: false,

  starting: false,

  shuttingDown: false,

  startedAt: null,

  version: "1.0.0"

};

// ======================================================
// APPLICATION BOOTSTRAP
// ======================================================

export async function initializeApplication() {

  if (appState.initialized || appState.starting) {

    return {
      success: true,
      state: appState
    };

  }

  appState.starting = true;

  try {

    // ---------------------------------------------
    // Register App Shell with Runtime
    // ---------------------------------------------

    eventHub.registerModule(
      "app_shell",
      {
        role: "application_shell",
        runtime: "production"
      }
    );

    // ---------------------------------------------
    // Initialize Meta-Brain Session
    // ---------------------------------------------

    buildSessionConfig();

    // ---------------------------------------------
    // Start CPilot Runtime
    // ---------------------------------------------

    await initializeCPilot();

    // ---------------------------------------------
    // Runtime Ready
    // ---------------------------------------------

    appState.initialized = true;
    appState.startedAt = Date.now();

    eventHub.emit({

      type: "app:ready",

      source: "app_shell",

      target: "runtime",

      priority: "high",

      payload: {
        startedAt: appState.startedAt
      }

    });

    return {
      success: true,
      state: appState
    };

  } catch (error) {

    eventHub.emit({

      type: "app:error",

      source: "app_shell",

      priority: "high",

      payload: {
        message: error.message
      }

    });

    throw error;

  } finally {

    appState.starting = false;

  }

}

// ======================================================
// APPLICATION STATUS
// ======================================================

export function isApplicationReady() {

  return appState.initialized;

}

export function getApplicationState() {

  return {

    ...appState,

    runtime: eventHub.getHealth()

  };

}

// ======================================================
// APPLICATION SHUTDOWN
// ======================================================

export function shutdownApplication() {

  if (appState.shuttingDown) {
    return;
  }

  appState.shuttingDown = true;

  eventHub.emit({

    type: "app:shutdown",

    source: "app_shell",

    target: "runtime",

    priority: "high",

    payload: {
      startedAt: appState.startedAt,
      shutdownAt: Date.now()
    }

  });

  appState.initialized = false;
  appState.starting = false;
  appState.shuttingDown = false;
}

export default {

  initializeApplication,

  shutdownApplication,

  isApplicationReady,

  getApplicationState

};
