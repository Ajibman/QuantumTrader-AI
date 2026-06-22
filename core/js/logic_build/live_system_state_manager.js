// QuantumTrader-AI — Live System State Manager
// Global Runtime Brain Snapshot (READ-ONLY INTELLIGENCE LAYER)

export class LiveSystemStateManager {

  constructor({
    runtime,
    engine,
    metrics,
    integrityAuditor,
    healingAuditor,
    registry,
    switcher,
    eventBus
  }) {

    this.runtime = runtime;
    this.engine = engine;
    this.metrics = metrics;
    this.integrityAuditor = integrityAuditor;
    this.healingAuditor = healingAuditor;
    this.registry = registry;
    this.switcher = switcher;
    this.eventBus = eventBus;
  }

  // =====================================
  // FULL SYSTEM SNAPSHOT
  // =====================================

  snapshot() {

    return {
      timestamp: Date.now(),

      // ---------------------------------
      // EXECUTION LAYER STATE
      // ---------------------------------
      runtime: this._safe(() =>
        this.runtime?.getMetrics?.() || null
      ),

      engine: this._safe(() =>
        this.engine ? "active" : "missing"
      ),

      // ---------------------------------
      // OBSERVABILITY STATE
      // ---------------------------------
      metrics: this._safe(() =>
        this.metrics?.report?.() || null
      ),

      // ---------------------------------
      // ARCHITECTURE STATE
      // ---------------------------------
      integrity: this._safe(() =>
        this.integrityAuditor?.runAudit?.() || null
      ),

      healing: this._safe(() =>
        this.healingAuditor?.diagnose?.() || null
      ),

      // ---------------------------------
      // CONNECTOR LAYER STATE
      // ---------------------------------
      registry: this._safe(() =>
        this.registry?.snapshot?.() || null
      ),

      environment: this._safe(() =>
        this.switcher?.snapshot?.() || null
      ),

      // ---------------------------------
      // EVENT SYSTEM STATE
      // ---------------------------------
      eventBus: this._safe(() =>
        this.eventBus?.snapshot?.() || null
      ),

      // ---------------------------------
      // HEALTH SUMMARY
      // ---------------------------------
      health: this._computeHealth()
    };
  }

  // =====================================
  // HEALTH COMPUTATION (NON-ACTUATING)
  // =====================================

  _computeHealth() {

    const audit = this.integrityAuditor?.runAudit?.();

    const metrics = this.metrics?.report?.();

    let score = 100;

    if (audit && !audit.valid) score -= 30;

    if (metrics && metrics.failureRate > 0.2) score -= 20;

    if (metrics && metrics.successRate < 0.7) score -= 20;

    return {
      score,
      status:
        score > 80 ? "healthy"
        : score > 50 ? "degraded"
        : "critical"
    };
  }

  // =====================================
  // SAFE EXECUTION WRAPPER
  // =====================================

  _safe(fn) {

    try {
      return fn();
    } catch (err) {
      return {
        error: err.message
      };
    }
  }

  // =====================================
  // LIVE MONITOR STREAM (OPTIONAL)
  // =====================================

  stream(interval = 1000, callback) {

    const id = setInterval(() => {
      callback(this.snapshot());
    }, interval);

    return () => clearInterval(id);
  }
}
