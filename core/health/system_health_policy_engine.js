// QuantumTrader-AI
// core/health/system_health_policy_engine.js
// System Health Policy Engine
// Determines operational state from health metrics.

export class SystemHealthPolicyEngine {

  constructor({

    healthyThreshold = 85,
    degradedThreshold = 60,
    criticalThreshold = 40

  } = {}) {

    this.thresholds = {

      healthy: healthyThreshold,
      degraded: degradedThreshold,
      critical: criticalThreshold
    };
  }

  // =====================================
  // CLASSIFY HEALTH SCORE
  // =====================================

  classify(score = 0) {

    const normalized =
      this._normalize(score);

    if (
      normalized >=
      this.thresholds.healthy
    ) {

      return {
        state: "HEALTHY",
        score: normalized,
        action: "CONTINUE"
      };
    }

    if (
      normalized >=
      this.thresholds.degraded
    ) {

      return {
        state: "DEGRADED",
        score: normalized,
        action: "MONITOR"
      };
    }

    if (
      normalized >=
      this.thresholds.critical
    ) {

      return {
        state: "CRITICAL",
        score: normalized,
        action: "REVIEW"
      };
    }

    return {
      state: "EMERGENCY",
      score: normalized,
      action: "INTERVENE"
    };
  }

  // =====================================
  // EVALUATE HEALTH REPORT
  // =====================================

  evaluate(report = {}) {

    const score =
      Number(
        report.score ?? 0
      );

    const classification =
      this.classify(score);

    return {

      timestamp:
        Date.now(),

      score,

      state:
        classification.state,

      action:
        classification.action,

      report
    };
  }

  // =====================================
  // POLICY DECISION
  // =====================================

  shouldAllowStartup(score) {

    const result =
      this.classify(score);

    return (
      result.state !==
      "EMERGENCY"
    );
  }

  // =====================================
  // POLICY DECISION
  // RELEASE READINESS
  // =====================================

  shouldAllowRelease(score) {

    const result =
      this.classify(score);

    return (
      result.state ===
      "HEALTHY"
    );
  }

  // =====================================
  // NORMALIZATION
  // =====================================

  _normalize(score) {

    if (
      Number.isNaN(score)
    ) {

      return 0;
    }

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(score)
      )
    );
  }
}
