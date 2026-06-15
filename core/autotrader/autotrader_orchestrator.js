import { AutoTraderPolicy } from "./autotrader_policy.js";
import { RecoveryController } from "./recovery_controller.js";
import { metaBrain } from "../brain/meta_brain/meta_brain.js";

export class AutoTraderOrchestrator {

  constructor() {
    this.policy = new AutoTraderPolicy();
    this.recovery = new RecoveryController();

    this.state = {
      allowTrade: true,
      mode: "NORMAL",
      riskMultiplier: 1,
      confidenceThreshold: 0.35
    };
  }

  evaluate(signal) {

    const health = metaBrain.getHealthReport();

    // --------------------------
    // 1. RECOVERY CHECK FIRST
    // --------------------------
    const recoveryState = this.recovery.evaluateRecovery();

    // If system is locked, override everything
    if (recoveryState === "LOCKED") {
      this.state.allowTrade = false;
      this.state.mode = "RECOVERY_LOCK";
      return this.state;
    }

    // --------------------------
    // 2. POLICY EVALUATION
    // --------------------------
    const policyState = this.policy.evaluate();

    // --------------------------
    // 3. MODE RESOLUTION
    // --------------------------

    if (recoveryState === "STABILIZING") {
      this.state.mode = "RECOVERY_STABILIZING";
      this.state.riskMultiplier = policyState.riskMultiplier * 0.5;
      this.state.confidenceThreshold = policyState.confidenceThreshold + 0.15;
    }

    else if (policyState.pauseTrading) {
      this.state.mode = "POLICY_PAUSE";
      this.state.allowTrade = false;
    }

    else {
      this.state.mode = "ACTIVE";
      this.state.allowTrade = true;
      this.state.riskMultiplier = policyState.riskMultiplier;
      this.state.confidenceThreshold = policyState.confidenceThreshold;
    }

    // --------------------------
    // 4. HEALTH INJECTION (META LAYER AWARENESS)
    // --------------------------

    const drift = health.sync.driftScore;

    if (drift > 0.3) {
      this.state.mode = "HIGH_DANGER";
      this.state.riskMultiplier *= 0.3;
      this.state.confidenceThreshold += 0.2;
    }

    return this.state;
  }

  getState() {
    return this.state;
  }
}
