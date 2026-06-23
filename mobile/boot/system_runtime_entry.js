// QuantumTrader-AI
// mobile/boot/system_runtime_entry.js
// Production Runtime Entry Point (App Launch Anchor)

import { AppRouter } from "../router/app_router.js";
import { AppStateManager } from "../state/app_state_manager.js";
import { BootManager } from "./boot_manager.js";
import { AppInitializer } from "./app_initializer.js";

// Assume these exist in your system layer
import { apiLayer } from "../../core/api/system_api_contract_layer.js";
import { sessionManager } from "../../core/session/session_manager.js";

export async function initializeQuantumTraderApp() {

  // =====================================
  // STEP 1 — CORE INSTANCES
  // =====================================

  const appState = new AppStateManager();

  const router = new AppRouter("app");

  const bootManager = new BootManager({
    apiLayer,
    sessionManager,
    router,
    healthProvider: null,
    errorPolicy: null
  });

  // =====================================
  // STEP 2 — APP INITIALIZER
  // =====================================

  const appInitializer = new AppInitializer({
    router,
    appState,
    bootManager,
    apiLayer,
    sessionManager
  });

  // =====================================
  // STEP 3 — GLOBAL STATE RESTORE
  // =====================================

  appState.restore();

  // =====================================
  // STEP 4 — START APPLICATION
  // =====================================

  const result = await appInitializer.start();

  // =====================================
  // STEP 5 — GLOBAL SAFETY LOG
  // =====================================

  if (!result?.success) {

    console.error(
      "QuantumTrader-AI failed to initialize",
      result
    );
  }

  return result;
}
