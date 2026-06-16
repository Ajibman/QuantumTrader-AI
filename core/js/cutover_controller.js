// ======================================================
// STAGE 23A — CONTROLLED ORCHESTRATOR CUTOVER
// ZERO BREAKING CHANGE MIGRATION LAYER
// ======================================================

export class CutoverController {
  constructor({
    legacyBrain,        // MetaBrainDeploymentLayer
    orchestrator        // Stage 22 SystemOrchestrator
  }) {
    this.legacy = legacyBrain;
    this.orchestrator = orchestrator;

    // ---------------------------------
    // CUTOVER CONFIG
    // ---------------------------------
    this.config = {
      orchestratorRatio: 0.0, // start at 0% traffic
      fallbackEnabled: true
    };

    this.metrics = {
      legacyCount: 0,
      orchestratorCount: 0,
      fallbackCount: 0
    };
  }

  // =====================================================
  // MAIN ENTRY POINT (SMART ROUTER)
  // =====================================================

  async evaluate(signal) {
    const useOrchestrator =
      Math.random() < this.config.orchestratorRatio;

    // ---------------------------------
    // ORCHESTRATOR PATH
    // ---------------------------------
    if (useOrchestrator) {
      try {
        const result = await this.orchestrator.evaluate(signal);

        this.metrics.orchestratorCount++;

        return {
          ...result,
          path: "ORCHESTRATOR"
        };

      } catch (err) {
        // fallback to legacy if enabled
        if (this.config.fallbackEnabled) {
          this.metrics.fallbackCount++;

          const legacy = this.legacy.evaluate(signal);

          return {
            ...legacy,
            path: "LEGACY_FALLBACK",
            error: err.message
          };
        }

        throw err;
      }
    }

    // ---------------------------------
    // LEGACY PATH (DEFAULT SAFE MODE)
    // ---------------------------------
    const legacyResult = this.legacy.evaluate(signal);

    this.metrics.legacyCount++;

    return {
      ...legacyResult,
      path: "LEGACY"
    };
  }

  // =====================================================
  // CONTROL FUNCTIONS
  // =====================================================

  setOrchestratorRatio(value) {
    this.config.orchestratorRatio = Math.max(0, Math.min(1, value));
  }

  enableFallback(state) {
    this.config.fallbackEnabled = state;
  }

  // =====================================================
  // SYSTEM VISIBILITY
  // =====================================================

  getMetrics() {
    const total =
      this.metrics.legacyCount +
      this.metrics.orchestratorCount +
      this.metrics.fallbackCount;

    return {
      ...this.metrics,
      orchestratorRatio: this.config.orchestratorRatio,
      distribution: {
        legacy: this.metrics.legacyCount / (total || 1),
        orchestrator: this.metrics.orchestratorCount / (total || 1),
        fallback: this.metrics.fallbackCount / (total || 1)
      }
    };
  }
}
