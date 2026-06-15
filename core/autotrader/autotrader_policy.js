import { metaBrain } from "../brain/meta_brain/meta_brain.js";

export class AutoTraderPolicy {

  constructor() {
    this.state = {
      riskMultiplier: 1,
      pauseTrading: false,
      confidenceThreshold: 0.35
    };
  }

  evaluate() {
    const health = metaBrain.getHealthReport();

    const drift = health.sync.driftScore;

    // --------------------------
    // DRIFT RESPONSE LOGIC
    // --------------------------

    if (drift < 0.10) {
      this._setNormalMode();
    }

    if (drift >= 0.10 && drift < 0.25) {
      this._setCautionMode();
    }

    if (drift >= 0.25) {
      this._setRiskMode();
    }

    return this.state;
  }

const policy = new AutoTraderPolicy();

const state = policy.evaluate();

if (state.pauseTrading) {
  return; // stop trading completely
}

if (signal.confidence < state.confidenceThreshold) {
  return; // ignore weak signals
}

executeTrade(signal, state.riskMultiplier);
  
  // --------------------------
  // MODES
  // --------------------------

  _setNormalMode() {
    this.state.riskMultiplier = 1;
    this.state.pauseTrading = false;
    this.state.confidenceThreshold = 0.35;
  }

  _setCautionMode() {
    this.state.riskMultiplier = 0.6;
    this.state.pauseTrading = false;
    this.state.confidenceThreshold = 0.5;
  }

  _setRiskMode() {
    this.state.riskMultiplier = 0.2;
    this.state.pauseTrading = true;
    this.state.confidenceThreshold = 0.7;
  }

  // --------------------------
  // ACCESSORS
  // --------------------------

  getState() {
    return this.state;
  }
}
