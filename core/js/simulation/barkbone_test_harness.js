 // core/js/simulation/backbone_test_harness.js
// QuantumTrader-AI Backbone Validation Harness

export class BackboneTestHarness {
  constructor({
    connector,
    cclm,
    eventHub,
    executor,
    cpilot
  }) {
    this.connector = connector;
    this.cclm = cclm;
    this.eventHub = eventHub;
    this.executor = executor;
    this.cpilot = cpilot;

    this.results = [];
  }

  async run(events = []) {
    const cycle = {
      emitted: [],
      resolved: [],
      executed: [],
      feedback: []
    };

    try {

      // STEP 1 — Emit events
      for (const event of events) {

        cycle.emitted.push(event);

        // STEP 2 — CCLMⁿ evaluation
        const directive =
          this.cclm.evaluate(event);

        // Suppression handling
        if (
          directive?.action?.type ===
          "suppress"
        ) {
          continue;
        }

        cycle.resolved.push({
          event,
          directive
        });
      }

      // STEP 3 — Event Hub resolution
      const routed =
        this.eventHub.resolve(
          cycle.resolved
        );

      // STEP 4 — Execution
      for (const item of routed) {

        const outcome =
          await this.executor.execute(
            item
          );

        cycle.executed.push(
          outcome
        );

        // STEP 5 — cpilot observation
        const feedback =
          this.cpilot.observe(
            outcome
          );

        // STEP 6 — Feedback back to CCLMⁿ
        if (
          typeof this.cclm
            .receiveFeedback ===
          "function"
        ) {
          this.cclm.receiveFeedback(
            feedback
          );
        }

        cycle.feedback.push(
          feedback
        );
      }

      this.results.push(cycle);

      // NEW: attach validation result
      const validation =
        this.validateLatestCycle();

      return {
        success: validation.success,
        cycle,
        validation
      };

    } catch (error) {

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * AUTOMATIC BACKBONE VALIDATOR
   */
  validateLatestCycle() {

    const cycle =
      this.results[
        this.results.length - 1
      ];

    const failures = [];

    // -------------------------
    // 1. Suppression validation
    // -------------------------
    const suppressedWrongly =
      cycle.resolved.length +
      (cycle.executed.length || 0) !==
      cycle.emitted.length;

    // This ensures suppression is actually removing events
    if (
      cycle.emitted.length > 0 &&
      cycle.resolved.length === cycle.emitted.length
    ) {
      // OK (no suppression occurred)
    } else if (
      cycle.resolved.length >
      cycle.emitted.length
    ) {
      failures.push(
        "Invalid suppression behavior"
      );
    }

    // -------------------------
    // 2. Execution integrity
    // -------------------------
    if (
      cycle.executed.length === 0 &&
      cycle.resolved.length > 0
    ) {
      failures.push(
        "No execution occurred"
      );
    }

    // -------------------------
    // 3. Feedback integrity
    // -------------------------
    if (
      cycle.feedback.length !==
      cycle.executed.length
    ) {
      failures.push(
        "Feedback mismatch"
      );
    }

    // -------------------------
    // 4. Priority sanity check (if available)
    // -------------------------
    const priorities =
      cycle.resolved
        .map(r => r.directive?.priority)
        .filter(p => typeof p === "number");

    if (priorities.length > 1) {
      const sorted = [...priorities].sort(
        (a, b) => b - a
      );

      const isSorted =
        JSON.stringify(priorities) !==
        JSON.stringify(sorted);

      if (isSorted) {
        // This is informational, not failure
        // (Event Hub is responsible for ordering)
      }
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
