// core/js/simulation/backbone_test_harness.js
// QuantumTrader-AI — Simulation Backbone Test Harness (MOCK MODE)

import { MockConnector } from "./mock_connector.js";
import { MockCCLM } from "./mock_cclm.js";
import { MockEventHub } from "./mock_eventhub.js";
import { MockExecutor } from "./mock_executor.js";
import { MockCPilot } from "./mock_cpilot.js";

export class BackboneTestHarness {
  constructor() {
    this.connector = new MockConnector();
    this.cclm = new MockCCLM();
    this.eventHub = new MockEventHub();
    this.executor = new MockExecutor();
    this.cpilot = new MockCPilot();

    this.results = [];
  }

  async run(events = []) {

    const cycle = {
      emitted: [],
      resolved: [],
      routed: [],
      executed: [],
      feedback: [],
      validation: null
    };

    try {

      // =========================
      // STEP 1 — CONNECTOR EMIT
      // =========================
      for (const event of events) {

        const emitted =
          this.connector.emit(
            this.connector.createEvent(event)
          );

        cycle.emitted.push(emitted);

        // =========================
        // STEP 2 — CCLMⁿ EVALUATION
        // =========================
        const directive =
          this.cclm.evaluate(emitted);

        if (directive?.action?.type === "suppress") {
          continue;
        }

        cycle.resolved.push({
          event: emitted,
          directive
        });
      }

      // =========================
      // STEP 3 — EVENT HUB
      // =========================
      const routed =
        this.eventHub.resolve(
          cycle.resolved
        );

      cycle.routed = routed;

      // =========================
      // STEP 4 — EXECUTOR
      // =========================
      for (const item of routed) {

        const outcome =
          await this.executor.execute(item);

        cycle.executed.push(outcome);

        // =========================
        // STEP 5 — CPILOT
        // =========================
        const feedback =
          this.cpilot.observe(outcome);

        cycle.feedback.push(feedback);
      }

      // =========================
      // STEP 6 — VALIDATION
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
        failedAt: "simulation_backbone_harness"
      };
    }
  }

  validateCycle(cycle) {

    const failures = [];

    // 1. Must execute something if not fully suppressed
    if (
      cycle.resolved.length > 0 &&
      cycle.executed.length === 0
    ) {
      failures.push("No execution occurred in simulation flow");
    }

    // 2. Feedback integrity
    if (
      cycle.executed.length !==
      cycle.feedback.length
    ) {
      failures.push("Feedback mismatch in simulation flow");
    }

    // 3. Routing integrity
    if (!Array.isArray(cycle.routed)) {
      failures.push("EventHub did not return valid route array");
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
