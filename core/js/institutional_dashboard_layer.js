// ======================================================
// STAGE 29 — INSTITUTIONAL DASHBOARD LAYER
// CONTROL CENTER + SYSTEM OBSERVABILITY + GOVERNANCE VIEW
// ======================================================

export class InstitutionalDashboardLayer {
  constructor({
    metaBrain,
    capitalControl,
    complianceLayer,
    optimizationEngine,
    failoverLayer,
    executionCluster
  }) {
    this.metaBrain = metaBrain;
    this.capitalControl = capitalControl;
    this.compliance = complianceLayer;
    this.optimizer = optimizationEngine;
    this.failover = failoverLayer;
    this.cluster = executionCluster;

    // -----------------------------
    // SYSTEM STATE (CONTROL PLANE)
    // -----------------------------
    this.state = {
      systemMode: "LIVE", // LIVE | PAUSED | SAFE | THROTTLED
      throttleFactor: 1.0
    };
  }

  // =====================================================
  // MASTER SYSTEM SNAPSHOT
  // =====================================================

  getSystemOverview() {
    return {
      mode: this.state.systemMode,

      brain: {
        learning: this.metaBrain?.learning,
        health: this.metaBrain?.getSystemHealth?.() ?? null
      },

      execution: this.cluster?.getMetrics?.() ?? null,

      capital: this.capitalControl?.state ?? null,

      compliance: this.compliance?.generateReport?.() ?? null,

      optimization: {
        lastRun: this.optimizer?.state?.lastRun ?? null,
        historySize: this.optimizer?.state?.adjustmentHistory?.length ?? 0
      },

      regions: this.failover?.getStatus?.() ?? null
    };
  }

  // =====================================================
  // REAL-TIME SYSTEM HEALTH SCORE
  // =====================================================

  getHealthScore() {
    const exec = this.cluster?.getMetrics?.() ?? {};
    const comp = this.compliance?.generateReport?.() ?? {};

    const executionHealth =
      1 - Math.min(1, (exec.failed || 0) / Math.max(1, exec.processed || 1));

    const confidenceHealth =
      comp.averageConfidence ?? 0.5;

    const regionHealth =
      this.failover?.getStatus?.().regions?.filter(r => r.active)?.length ?? 1;

    const score =
      (executionHealth * 0.4) +
      (confidenceHealth * 0.4) +
      (Math.min(regionHealth, 3) / 3 * 0.2);

    return {
      score: Math.max(0, Math.min(1, score)),
      executionHealth,
      confidenceHealth,
      regionHealth
    };
  }

  // =====================================================
  // CONTROL OPERATIONS
  // =====================================================

  setMode(mode) {
    const allowed = ["LIVE", "PAUSED", "SAFE", "THROTTLED"];

    if (!allowed.includes(mode)) {
      throw new Error("INVALID_SYSTEM_MODE");
    }

    this.state.systemMode = mode;

    return { mode };
  }

  setThrottle(factor) {
    this.state.systemMode = "THROTTLED";
    this.state.throttleFactor = Math.max(0, Math.min(1, factor));

    return {
      mode: this.state.systemMode,
      throttleFactor: this.state.throttleFactor
    };
  }

  // =====================================================
  // EXECUTION GATE CONTROL
  // =====================================================

  canExecute(decision) {
    if (this.state.systemMode === "PAUSED") return false;
    if (this.state.systemMode === "SAFE") return false;

    if (this.state.systemMode === "THROTTLED") {
      return decision.confidence > 0.5 && Math.random() < this.state.throttleFactor;
    }

    return true;
  }

  // =====================================================
  // LIVE DASHBOARD STREAM DATA
  // =====================================================

  getLiveFeed() {
    const overview = this.getSystemOverview();
    const health = this.getHealthScore();

    return {
      timestamp: Date.now(),

      mode: this.state.systemMode,

      healthScore: health.score,

      signals: {
        avgConfidence: overview.compliance?.averageConfidence ?? 0,
        trades: overview.compliance?.totalDecisions ?? 0
      },

      execution: overview.execution,

      regions: overview.regions?.regions ?? [],

      optimization:
        overview.optimization
    };
  }

  // =====================================================
  // EMERGENCY OVERRIDE
  // =====================================================

  emergencyStop(reason = "MANUAL_OVERRIDE") {
    this.state.systemMode = "PAUSED";

    return {
      status: "EMERGENCY_STOP_TRIGGERED",
      reason,
      timestamp: Date.now()
    };
  }

  // =====================================================
  // SYSTEM SUMMARY FOR UI
  // =====================================================

  getSummary() {
    const health = this.getHealthScore();

    return {
      status:
        health.score > 0.8 ? "HEALTHY" :
        health.score > 0.5 ? "STABLE" :
        "DEGRADED",

      mode: this.state.systemMode,

      healthScore: health.score,

      recommendation:
        health.score < 0.5
          ? "Reduce exposure or switch SAFE mode"
          : "System operating within acceptable bounds"
    };
  }
}
