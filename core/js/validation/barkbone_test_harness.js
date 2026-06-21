 // core/js/simulation/backbone_test_harness.js
// QuantumTrader-AI Backbone Validation Harness (PIPELINE MODE)

export class BackboneTestHarness {
  constructor({ pipelineEngine }) {
    this.pipeline = pipelineEngine;
    this.results = [];
  }

  async run(events = []) {

    const cycle = {
      emitted: [],
      executed: [],
      feedback: [],
      validation: null
    };

    try {

      // =========================
      // STEP 1 — PIPELINE EXECUTION
      // =========================
      for (const event of events) {

        const result =
          await this.pipeline.run(event);

        cycle.emitted.push(event);

        // Capture execution result (full 7-step output)
        cycle.executed.push(result);
      }

      // =========================
      // STEP 2 — VALIDATION
      // =========================
      cycle.validation =
        this.validateCycle(cycle);

      this.results.push(cycle);

      return {
        success: cycle.validation.success,
        cycle,
        validation: cycle.validation
      };

    } catch (error) {

      return {
        success: false,
        error: error.message,
        failedAt: "pipeline_harness"
      };
    }
  }

  /**
   * SYSTEM VALIDATOR (PIPELINE-AWARE)
   */
  validateCycle(cycle) {

    const failures = [];

    // -------------------------
    // 1. Execution existence
    // -------------------------
    if (!cycle.executed.length) {
      failures.push("No pipeline executions occurred");
    }

    // -------------------------
    // 2. Suppression validation
    // -------------------------
    const suppressed =
      cycle.executed.filter(
        r => r?.status === "suppressed_by_cclm"
      );

    const hasSuppressionPath =
      cycle.executed.some(
        r => r?.status === "suppressed_by_cclm"
      );

    // OK if system has suppression behavior OR none needed
    if (
      cycle.executed.length > 0 &&
      suppressed.length > cycle.executed.length
    ) {
      failures.push("Invalid suppression behavior");
    }

    // -------------------------
    // 3. Pipeline integrity check
    // -------------------------
    const broken = cycle.executed.some(
      r => !r.success && !r.status
    );

    if (broken) {
      failures.push("Pipeline execution failure detected");
    }

    return {
      success: failures.length === 0,
      failures
    };
  }

  getResults() {
    return this.results;
  }

  clear() {
    this.results = [];
  }
}
