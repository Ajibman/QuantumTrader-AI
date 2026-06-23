// QuantumTrader-AI
// mobile/boot/system_runtime_entry.js
// Production Runtime Entry Point (App Launch Anchor)

import { AppRouter } from "../router/app_router.js";
import { AppStateManager } from "../state/app_state_manager.js";
import { BootManager } from "./boot_manager.js";
import { AppInitializer } from "./app_initializer.js";
import { RuntimeVerification } from "./runtime_verification.js";

// NEW: Runtime Wiring Layer
import { SystemRuntimeWiring } from "../../core/runtime/system_runtime_wiring.js";

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
  // STEP 2 — SYSTEM ENGINE INSTANCES
  // =====================================

  const eventBus = bootManager?.eventBus || null;
  const healthEngine = bootManager?.healthEngine || null;
  const auditEngine = bootManager?.auditEngine || null;

  // =====================================
  // STEP 3 — RUNTIME WIRING (NEW)
  // =====================================

  const runtimeWiring = new SystemRuntimeWiring({
    eventBus,
    healthEngine,
    auditEngine
  });

  const wiringResult = runtimeWiring.initialize();

  if (!wiringResult?.success) {

    console.error(
      "QuantumTrader-AI wiring failed",
      wiringResult
    );

    return {
      success: false,
      stage: "runtime_wiring",
      wiringResult
    };
  }

  // =====================================
  // STEP 4 — APP INITIALIZER
  // =====================================

  const appInitializer = new AppInitializer({
    router,
    appState,
    bootManager,
    apiLayer,
    sessionManager
  });

  // =====================================
  // STEP 5 — GLOBAL STATE RESTORE
  // =====================================

  appState.restore();

  // =====================================
  // STEP 6 — RUNTIME VERIFICATION GATE
  // =====================================

  const verifier = new RuntimeVerification({
    router,
    appState,
    sessionManager,
    eventBus,
    healthEngine,
    auditEngine
  });

  const verification = verifier.verify();

  if (!verification.success) {

    console.error(
      "QuantumTrader-AI runtime verification failed",
      verification
    );

    if (typeof router?.navigate === "function") {

      router.navigate("startup_error", {
        reason: "runtime_verification_failed",
        report: verification
      });
    }

    return {
      success: false,
      stage: "runtime_verification",
      verification
    };
  }

  // =====================================
  // STEP 7 — START APPLICATION
  // =====================================

  const result = await appInitializer.start();

  // =====================================
  // STEP 8 — GLOBAL SAFETY LOG
  // =====================================

  if (!result?.success) {

    console.error(
      "QuantumTrader-AI failed to initialize",
      result
    );
  }

  return result;
}
