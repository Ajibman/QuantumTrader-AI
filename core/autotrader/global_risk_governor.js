import { metaBrain } from "../brain/meta_brain/meta_brain.js";

export class GlobalRiskGovernor {

  constructor() {
    this.state = {
      maxDailyLoss: 0.05,        // 5%
      maxDriftThreshold: 0.35,
      maxConsecutiveLosses: 5,
      emergencyStop: false,

      consecutiveLosses: 0,
      dailyLoss: 0
    };
  }

  evaluate(latestTrade = {}) {

    const health = metaBrain.getHealthReport();
    const drift = health.sync.driftScore;

    // --------------------------
    // LOSS TRACKING
    // --------------------------

    if (latestTrade.success === false) {
      this.state.consecutiveLosses++;
      this.state.dailyLoss += Math.abs(latestTrade.pnl || 0);
    } else {
      this.state.consecutiveLosses = 0;
    }

    // --------------------------
    // EMERGENCY CONDITIONS
    // --------------------------

    if (
      drift > this.state.maxDriftThreshold ||
      this.state.consecutiveLosses >= this.state.maxConsecutiveLosses ||
      this.state.dailyLoss >= this.state.maxDailyLoss
    ) {
      this.state.emergencyStop = true;
    }

    return this.state;
  }

  resetDaily() {
    this.state.dailyLoss = 0;
    this.state.consecutiveLosses = 0;
    this.state.emergencyStop = false;
  }
}
