// QuantumTrader-AI — System Health Scoring Engine
// Predictive + Trend Analysis Layer (NO execution influence)

export class SystemHealthScoringEngine {

  constructor({ stateManager }) {

    this.stateManager = stateManager;

    // historical snapshots
    this.history = [];
  }

  // =====================================
  // CAPTURE HEALTH SNAPSHOT
  // =====================================

  capture() {

    const snapshot =
      this.stateManager.snapshot();

    const health = snapshot.health;

    this.history.push({
      timestamp: Date.now(),
      health,
      snapshot
    });

    return health;
  }

  // =====================================
  // CURRENT HEALTH SCORE
  // =====================================

  current() {

    const latest = this._latest();

    return latest?.health || {
      score: 0,
      status: "unknown"
    };
  }

  // =====================================
  // TREND ANALYSIS
  // =====================================

  trend(windowSize = 10) {

    const slice =
      this.history.slice(-windowSize);

    if (slice.length < 2) {
      return {
        trend: "insufficient_data"
      };
    }

    let deltas = [];

    for (let i = 1; i < slice.length; i++) {

      const prev = slice[i - 1].health.score;
      const curr = slice[i].health.score;

      deltas.push(curr - prev);
    }

    const avgChange =
      deltas.reduce((a, b) => a + b, 0) /
      deltas.length;

    return {
      trend:
        avgChange > 0.5 ? "improving"
        : avgChange < -0.5 ? "degrading"
        : "stable",

      averageDelta: avgChange,
      samples: slice.length
    };
  }

  // =====================================
  // FAILURE RISK PREDICTION
  // =====================================

  risk() {

    const latest = this._latest();

    if (!latest) {
      return { risk: "unknown" };
    }

    const score = latest.health.score;

    const trend = this.trend();

    let riskLevel = "low";

    if (score < 50) {
      riskLevel = "critical";
    } else if (score < 70) {
      riskLevel = "high";
    } else if (
      trend.trend === "degrading" &&
      score < 85
    ) {
      riskLevel = "medium";
    }

    return {
      risk: riskLevel,
      score,
      trend: trend.trend
    };
  }

  // =====================================
  // HEALTH FORECAST (SHORT HORIZON)
  // =====================================

  forecast(steps = 5) {

    const latest = this._latest();

    if (!latest) {
      return { forecast: "insufficient_data" };
    }

    const trend = this.trend();

    let projected =
      latest.health.score +
      (trend.averageDelta || 0) * steps;

    // clamp
    projected = Math.max(0, Math.min(100, projected));

    return {
      projectedScore: projected,
      horizon: steps,
      direction: trend.trend
    };
  }

  // =====================================
  // LATEST SNAPSHOT
  // =====================================

  _latest() {

    return this.history[this.history.length - 1];
  }

  // =====================================
  // RESET HISTORY
  // =====================================

  reset() {
    this.history = [];
  }
}
