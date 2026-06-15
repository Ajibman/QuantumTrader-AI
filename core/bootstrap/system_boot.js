import { metaBrain } from "../brain/meta_brain/meta_brain.js";

import { AutoTraderOrchestrator } from "../autotrader/autotrader_orchestrator.js";
import { GlobalRiskGovernor } from "../autotrader/global_risk_governor.js";

import { executeLiveTrade } from "../execution/executionSim.js";

import { StressTestEngine } from "../simulation/stress_test_engine.js";

// ------------------------------------------------------
// SINGLE SYSTEM STATE
// ------------------------------------------------------

export class SystemBoot {

  constructor() {
    this.state = {
      initialized: false,
      mode: "IDLE",
      healthCheckPassed: false
    };

    this.orchestrator = null;
    this.governor = null;
    this.stressTest = null;
  }

  // --------------------------------------------------
  // STEP 1: INITIALIZE CORE SYSTEMS
  // --------------------------------------------------

  init() {

    console.log("[BOOT] Initializing MetaTrader System...");

    this.orchestrator = new AutoTraderOrchestrator();
    this.governor = new GlobalRiskGovernor();
    this.stressTest = new StressTestEngine();

    this.state.initialized = true;

    console.log("[BOOT] Core modules loaded");

    return this.state;
  }

  // --------------------------------------------------
  // STEP 2: HEALTH VALIDATION
  // --------------------------------------------------

  healthCheck(testSignals = []) {

    console.log("[BOOT] Running health validation...");

    const report = this.stressTest.run(testSignals, []);

    if (report.shutdownEvents > 0 || report.averageDrift > 0.3) {
      this.state.healthCheckPassed = false;
      this.state.mode = "FAIL_SAFE";

      console.log("[BOOT] Health check FAILED");
      return this.state;
    }

    this.state.healthCheckPassed = true;
    this.state.mode = "ACTIVE";

    console.log("[BOOT] Health check PASSED");

    return this.state;
  }

  // --------------------------------------------------
  // STEP 3: START LIVE SYSTEM
  // --------------------------------------------------

  start() {

    if (!this.state.initialized) {
      throw new Error("System not initialized");
    }

    if (!this.state.healthCheckPassed) {
      throw new Error("Health check failed - cannot start live trading");
    }

    console.log("[BOOT] Starting live trading system...");

    this.state.mode = "RUNNING";

    return this.state;
  }

  // --------------------------------------------------
  // STEP 4: SAFE EXECUTION WRAPPER
  // --------------------------------------------------

  execute(trade, signal) {

    if (this.state.mode !== "RUNNING") {
      return {
        status: "BLOCKED",
        reason: "SYSTEM_NOT_RUNNING"
      };
    }

    const control = this.orchestrator.evaluate(signal);

    const riskCheck = this.governor.evaluate(trade);

    if (riskCheck.emergencyStop) {
      return {
        status: "BLOCKED",
        reason: "GLOBAL_RISK_STOP"
      };
    }

    return executeLiveTrade(trade, signal);
  }

  // --------------------------------------------------
  // STEP 5: SYSTEM STATUS
  // --------------------------------------------------

  getStatus() {
    return {
      ...this.state,
      risk: this.governor?.state || null
    };
  }
}
