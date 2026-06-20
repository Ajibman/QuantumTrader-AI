// mobile/ui/app_shell.js

import { initializeCPilot } from "../../core/js/cpilot/cpilot_engine.js";
import { emit } from "./event_system.js";

/**
 * QuantumTrader-AI
 * Application Shell
 *
 * Responsibilities:
 * - Bootstrap application services
 * - Initialize AI systems
 * - Manage startup lifecycle
 * - Broadcast application state
 */

let appReady = false;

export async function initializeApplication() {
  try {

    emit("APP_STARTING");

    console.log("[AppShell] Starting QuantumTrader-AI...");

    await initializeCPilot();

    appReady = true;

    emit("APP_READY");

    console.log("[AppShell] Application Ready");

    return {
      success: true
    };

  } catch (error) {

    console.error("[AppShell] Startup Failed", error);

    emit("APP_ERROR", {
      source: "app_shell",
      error: error.message
    });

    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Returns application readiness state
 */
export function isApplicationReady() {
  return appReady;
}

/**
 * Graceful shutdown support
 */
export function shutdownApplication() {

  emit("APP_SHUTDOWN");

  appReady = false;

  console.log("[AppShell] Shutdown Complete");
}
