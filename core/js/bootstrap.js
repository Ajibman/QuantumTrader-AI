/**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * STAGE 31 — APPLICATION BOOTSTRAP
 * Production Version 1.0
 * ============================================================
 *
 * PURPOSE
 * -------
 * Sole application bootstrap.
 *
 * Responsibilities:
 * • Instantiate ONE system orchestrator.
 * • Wire all core intelligence engines.
 * • Export singleton services.
 * • Manage application lifecycle.
 * • Broadcast startup/shutdown events.
 *
 * IMPORTANT
 * ---------
 * MetaSystemOrchestrator MUST NEVER be instantiated
 * anywhere else inside the application.
 *
 * Every controller imports this bootstrap.
 *
 * TraderLab
 * CPilot
 * Trading Floor
 *
 * all share the same orchestrator instance.
 * ============================================================
 */

import { MetaSystemOrchestrator } from "./meta_system_orchestrator.js";

import { eventHub } from "./event_hub.js";

import { metaBrain } from "./traderlab/meta_brain.js";

import { portfolioEngine } from "./portfolio/portfolio_engine.js";

import { capitalEngine } from "./capital/capital_engine.js";

import { riskGovernor } from "./risk/risk_governor.js";

import { strategyCoordinator } from "./strategy/strategy_coordinator.js";

import { logisticsEngine } from "./logistics/logistics_engine.js";

import { correlationEngine } from "./correlation/correlation_engine.js";

import { executionOptimizer } from "./execution/execution_optimizer.js";

import { marketConnectivity } from "./connectors/market_connectivity.js";

import { exchangeGateway } from "./connectors/exchange_gateway.js";

import { governanceGate } from "./governance/live_execution_governance_gate.js";

/* ============================================================
 * SINGLETON ORCHESTRATOR
 * ============================================================
 */

const orchestrator = new MetaSystemOrchestrator({

    metaBrain,

    portfolioEngine,

    capitalEngine,

    riskGovernor,

    strategyCoordinator,

    logisticsEngine,

    correlationEngine,

    executionOptimizer,

    eventHub,

    marketConnectivity,

    exchangeGateway,

    governanceGate,

    mode: "PAPER",

    debug: false

});

/* ============================================================
 * BOOTSTRAP STATE
 * ============================================================
 */

let initialized = false;

/* ============================================================
 * INITIALIZE APPLICATION
 * ============================================================
 */

export function initializeSystem() {

    if (initialized) {

        return orchestrator;

    }

    initialized = true;

    eventHub?.emit?.(

        "system:bootstrap",

        {

            timestamp: Date.now(),

            mode: orchestrator.mode,

            version: "2.0"

        }

    );

    orchestrator.log("Application bootstrap complete.");

    return orchestrator;

}

/* ============================================================
 * SHUTDOWN
 * ============================================================
 */

export function shutdownSystem() {

    eventHub?.emit?.(

        "system:shutdown",

        {

            timestamp: Date.now()

        }

    );

    orchestrator.destroy();

    initialized = false;

}

/* ============================================================
 * ACCESSORS
 * ============================================================
 */

export function getOrchestrator() {

    return orchestrator;

}

export function getSystemStatus() {

    return orchestrator.getSystemStatus();

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default orchestrator;
