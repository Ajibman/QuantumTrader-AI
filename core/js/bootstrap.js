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

let startupTime = null;

const BOOTSTRAP_VERSION = "2.0.0";

/* ============================================================
 * DEPENDENCY VALIDATION
 * ============================================================
 */

function validateDependencies() {

    const required = {

        metaBrain,

        portfolioEngine,

        capitalEngine,

        riskGovernor,

        strategyCoordinator,

        logisticsEngine,

        correlationEngine,

        executionOptimizer,

        eventHub

    };

    const missing = [];

    Object.entries(required).forEach(([name, dependency]) => {

        if (!dependency) {

            missing.push(name);

        }

    });

    if (missing.length) {

        throw new Error(

            `Bootstrap dependency validation failed: ${missing.join(", ")}`

        );

    }

}

/* ============================================================
 * INITIALIZE APPLICATION
 * ============================================================
 */

export function initializeSystem() {

    if (initialized) {

        return orchestrator;

    }

    validateDependencies();

    initialized = true;

    startupTime = Date.now();

    eventHub?.emit?.(

        "system:bootstrap",

        {

            timestamp: startupTime,

            mode: orchestrator.mode,

            version: BOOTSTRAP_VERSION

        }

    );

    if (!orchestrator.isHealthy()) {

        throw new Error(

            "MetaSystemOrchestrator failed startup health verification."

        );

    }

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

    if (initialized) {

    orchestrator.destroy();

    }

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

    return {

        ...orchestrator.getSystemStatus(),

        bootstrap: {

            initialized,

            version: BOOTSTRAP_VERSION,

            startupTime

        }

    };

}

/* ============================================================
 * DEFAULT EXPORT
 * ============================================================
 */

export default orchestrator;
