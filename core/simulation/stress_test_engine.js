import { metaBrain } from "../brain/meta_brain/meta_brain.js";
import { AutoTraderOrchestrator } from "../autotrader/autotrader_orchestrator.js";

export class StressTestEngine {

  constructor() {
    this.orchestrator = new AutoTraderOrchestrator();

    this.results = {
      totalSignals: 0,
      blockedTrades: 0,
      executedTrades: 0,
      shutdownEvents: 0,
      averageDrift: 0
    };

    this.driftHistory = [];
  }

  run(testSignals = [], testTrades = []) {

    for (let i = 0; i < testSignals.length; i++) {

      const signal = testSignals[i];
      const trade = testTrades[i] || {};

      const control = this.orchestrator.evaluate(signal);

      const health = metaBrain.getHealthReport();
      const drift = health.sync.driftScore;

      this.driftHistory.push(drift);

      this.results.totalSignals++;

      if (control.mode === "RECOVERY_LOCK" || control.allowTrade === false) {
        this.results.blockedTrades++;
      } else {
        this.results.executedTrades++;
      }

      if (control.mode === "RECOVERY_LOCK" || control.mode === "HIGH_DANGER") {
        this.results.shutdownEvents++;
      }
    }

    this.results.averageDrift =
      this.driftHistory.reduce((a, b) => a + b, 0) /
      (this.driftHistory.length || 1);

    return this.results;
  }

  reset() {
    this.results = {
      totalSignals: 0,
      blockedTrades: 0,
      executedTrades: 0,
      shutdownEvents: 0,
      averageDrift: 0
    };

    this.driftHistory = [];
  }
}
