// QuantumTrader-AI
// core/health/system_health_scoring_engine.js
// Production System Health Scoring Engine (Predictive + Trend Analysis)

export class SystemHealthScoringEngine {

  constructor({
    eventBus = null
  } = {}) {

    this.eventBus = eventBus;

    this.metrics = {

      bootSuccess: 1,

      apiSuccessRate: 1,

      errorRate: 0,

      sessionStability: 1,

      eventBusStability: 1
    };

    this.history = [];

    this.maxHistory = 50;
  }

  // =====================================
  // UPDATE METRICS
  // =====================================

  updateMetric(key, value) {

    if (
      this.metrics[key] === undefined
    ) return;

    this.metrics[key] = this._clamp(
      value
    );

    this._recordSnapshot();

    this._emitUpdate();
  }

  // =====================================
  // COMPUTE HEALTH SCORE
  // =====================================

  computeScore() {

    const m = this.metrics;

    // Weighted deterministic scoring model
    const score =

      (m.bootSuccess * 0.25) +
      (m.apiSuccessRate * 0.25) +
      ((1 - m.errorRate) * 0.2) +
      (m.sessionStability * 0.15) +
      (m.eventBusStability * 0.15);

    return this._normalize(score);
  }

  // =====================================
  // GET SYSTEM STATUS
  // =====================================

  getStatus() {

    const score = this.computeScore();

    if (score >= 0.85) return "HEALTHY";

    if (score >= 0.6) return "DEGRADED";

    return "CRITICAL";
  }

  // =====================================
  // TREND ANALYSIS
  // =====================================

  getTrend() {

    if (this.history.length < 5) {

      return "INSUFFICIENT_DATA";
    }

    const recent =
      this.history.slice(-5);

    const first =
      recent[0].score;

    const last =
      recent[recent.length - 1].score;

    if (last > first) return "IMPROVING";

    if (last < first) return "DECLINING";

    return "STABLE";
  }

  // =====================================
  // SNAPSHOT HISTORY
  // =====================================

  _recordSnapshot() {

    const snapshot = {

      score:
        this.computeScore(),

      timestamp:
        Date.now(),

      metrics: { ...this.metrics }
    };

    this.history.push(snapshot);

    if (this.history.length > this.maxHistory) {

      this.history.shift();
    }
  }

  // =====================================
  // EVENT EMISSION
  // =====================================

  _emitUpdate() {

    if (!this.eventBus) return;

    this.eventBus.emit(
      "system:health:update",
      {
        score:
          this.computeScore(),

        status:
          this.getStatus(),

        trend:
          this.getTrend()
      }
    );
  }

  // =====================================
  // UTILITIES
  // =====================================

  _clamp(value) {

    if (value < 0) return 0;

    if (value > 1) return 1;

    return value;
  }

  _normalize(score) {

    if (score < 0) return 0;

    if (score > 1) return 1;

    return Number(
      score.toFixed(4)
    );
  }
        }
