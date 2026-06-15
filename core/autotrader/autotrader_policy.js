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

    const simWin = health.sync.simulationWinRate;
    const liveWin = health.sync.liveWinRate;

    const performanceGap = Math.abs(simWin - liveWin);

    const adjustedDrift = drift + performanceGap * 0.5;

    // --------------------------
    // MODE SELECTION
    // --------------------------

    if (adjustedDrift < 0.08) {
      this._setNormalMode();
    }

    else if (adjustedDrift < 0.18) {
      this._setCautionMode();
    }

    else if (adjustedDrift < 0.30) {
      this._setRiskMode();
    }

    else {
      this._setShutdownMode();
    }

    // --------------------------
    // CONFIDENCE SUPPRESSION
    // --------------------------

    this.state.confidenceThreshold =
      0.35 + adjustedDrift * 0.5;

    return this.state;
  }

  _setNormalMode() {
    this.state.riskMultiplier = 1;
    this.state.pauseTrading = false;
  }

  _setCautionMode() {
    this.state.riskMultiplier = 0.6;
    this.state.pauseTrading = false;
  }

  _setRiskMode() {
    this.state.riskMultiplier = 0.2;
    this.state.pauseTrading = false;
  }

  _setShutdownMode() {
    this.state.riskMultiplier = 0;
    this.state.pauseTrading = true;
  }

  getState() {
    return this.state;
  }
}
