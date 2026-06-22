// QuantumTrader-AI — Pipeline Runtime Orchestrator
// Connects Engine + Metrics (NO architecture changes)

import { PipelineEngine }
  from "./pipeline_engine.js";

import { PipelineMetrics }
  from "./pipeline_metrics.js";

export class PipelineRuntime {

  constructor(deps) {

    this.engine = new PipelineEngine(deps);
    this.metrics = new PipelineMetrics();
  }

  // =====================================
  // SINGLE EXECUTION RUN
  // =====================================

  async run(event) {

    // STEP A — start observation (metrics only)
    this.metrics.startRun();

    try {

      // STEP B — execute pipeline (UNCHANGED ENGINE)
      const result =
        await this.engine.run(event);

      // STEP C — record result (OBSERVATION ONLY)
      this.metrics.record(result);

      return result;

    } catch (error) {

      // STEP D — capture failed run safely
      this.metrics.record({
        success: false,
        status: "runtime_error",
        error: error.message,
        steps: {}
      });

      return {
        success: false,
        status: "runtime_error",
        error: error.message
      };
    }
  }

  // =====================================
  // METRICS ACCESS
  // =====================================

  getMetricsReport() {
    return this.metrics.report();
  }

  resetMetrics() {
    this.metrics.reset();
  }
}
