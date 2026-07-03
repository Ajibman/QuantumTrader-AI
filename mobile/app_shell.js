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
=====
REBUILD MOBILE/UI/APP_SHELL.JS
FROMM HERE

/**
 * ============================================================
 * QuantumTrader-AI
 * STAGE 38 — APPLICATION SHELL
 * Version: 2.0 Production
 * ============================================================
 *
 * PURPOSE
 * --------
 * Central runtime bootstrap for QuantumTrader-AI.
 *
 * Responsible for:
 *
 * • Bootstrapping all core engines
 * • Wiring runtime infrastructure
 * • Initializing mobile UI
 * • Starting orchestration
 * • Managing lifecycle
 *
 * ============================================================
 */

// ============================================================
// CORE INTELLIGENCE
// ============================================================

import { MetaBrain } from "../../core/js/meta_brain.js";

import { MetaSystemOrchestrator } from "../../core/js/meta_system_orchestrator.js";

// ============================================================
// CONNECTORS
// ============================================================

import { MarketConnectivityLayer }
from "../../core/js/connectors/market_connectivity_layer.js";

import { ExchangeGateway }
from "../../core/js/connectors/exchange_gateway.js";

import { MetaApiBridge }
from "../../core/js/connectors/meta_api_bridge.js";

// ============================================================
// GOVERNANCE
// ============================================================

import { LiveExecutionGovernanceGate }
from "../../core/js/live_execution_governance_gate.js";

// ============================================================
// MOBILE SERVICES
// ============================================================

import { EventHub }
from "../event_hub.js";

// ============================================================
// CPILOT
// ============================================================

import { initializeCPilot }
from "../../core/js/cpilot/cpilot_engine.js";

// ============================================================
// SECTION 2 — APPLICATION RUNTIME STATE
// ============================================================

let appReady = false;

let startupTime = null;

let shutdownTime = null;

// Core Runtime

let eventHub = null;

let marketConnectivity = null;

let exchangeGateway = null;

let metaApiBridge = null;

let governanceGate = null;

let metaBrain = null;

let orchestrator = null;

// Runtime Status

const runtimeState = {

    mode: "PAPER",

    initialized: false,

    running: false,

    startupComplete: false,

    lastError: null

};

// Runtime Metrics

const runtimeMetrics = {

    startups: 0,

    shutdowns: 0,

    runtimeCycles: 0

};

// ============================================================
// SECTION 3 — APPLICATION BOOTSTRAP
// ============================================================

function bootstrapApplication(config = {}) {

    runtimeState.mode =

        config.mode ?? "PAPER";

    // ------------------------------------------------
    // EVENT HUB
    // ------------------------------------------------

    eventHub = new EventHub({

        debug: config.debug ?? false

    });

    // ------------------------------------------------
    // MARKET CONNECTIVITY
    // ------------------------------------------------

    marketConnectivity =
        new MarketConnectivityLayer(config);

    // ------------------------------------------------
    // EXCHANGE GATEWAY
    // ------------------------------------------------

    exchangeGateway =
        new ExchangeGateway(config);

    // ------------------------------------------------
    // META API BRIDGE
    // ------------------------------------------------

    metaApiBridge =
        new MetaApiBridge({

            debug: config.debug ?? false

        });

    metaApiBridge.attachEventHub(eventHub);

    metaApiBridge.attachMarketLayer(

        marketConnectivity

    );

    metaApiBridge.attachExchangeGateway(

        exchangeGateway

    );

    // ------------------------------------------------
    // GOVERNANCE
    // ------------------------------------------------

    governanceGate =
        new LiveExecutionGovernanceGate(config);

    // ------------------------------------------------
    // META BRAIN
    // ------------------------------------------------

    metaBrain =
        new MetaBrain(config);

    // ------------------------------------------------
    // META SYSTEM ORCHESTRATOR
    // ------------------------------------------------

    orchestrator =
        new MetaSystemOrchestrator({

            metaBrain,

            eventHub,

            marketConnectivity,

            exchangeGateway,

            governanceGate,

            mode: runtimeState.mode,

            debug: config.debug ?? false

        });

    runtimeState.initialized = true;

    startupTime = Date.now();

    return {

        eventHub,

        marketConnectivity,

        exchangeGateway,

        metaApiBridge,

        governanceGate,

        metaBrain,

        orchestrator

    };

}

