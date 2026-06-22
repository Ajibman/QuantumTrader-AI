// core/js/logic_build/pipeline_engine.js
// QuantumTrader-AI — Pipeline Engine (Contract Hardened)

import { PipelineContracts }
  from "./pipeline_contracts.js";

export class PipelineEngine {

  constructor({
    cclm,
    eventHub,
    executor,
    cpilot
  }) {

    this.cclm = cclm;
    this.eventHub = eventHub;
    this.executor = executor;
    this.cpilot = cpilot;
  }

  async run(event) {

    const steps = {};

    try {

      // =====================================
      // STEP 1 — EVENT
      // =====================================

      if (
        !PipelineContracts.validateEvent(
          event
        )
      ) {
        throw new Error(
          "Invalid event contract"
        );
      }

      steps.event = event;

      // =====================================
      // STEP 2 — CCLMⁿ
      // =====================================

      const directive =
        this.cclm.evaluate(event);

      steps.directive = directive;

      // =====================================
      // STEP 3 — INFLUENCE
      // =====================================

      const enriched = {
        event,
        directive
      };

      steps.enriched = enriched;

      // =====================================
      // STEP 4 — DIRECTIVE VALIDATION
      // =====================================

      if (
        !PipelineContracts.validateDirective(
          directive
        )
      ) {
        throw new Error(
          "Invalid directive contract"
        );
      }

      // Suppression Path

      if (
        directive?.action?.type ===
        "suppress"
      ) {

        return {
          success: true,
          status:
            "suppressed_by_cclm",
          steps
        };
      }

      // =====================================
      // STEP 5 — EVENT HUB
      // =====================================

      const routed =
        this.eventHub.resolve([
          enriched
        ]);

      steps.routed = routed;

      // =====================================
      // STEP 6 — EXECUTOR
      // =====================================

      const outcome =
        await this.executor.execute(
          routed[0]
        );

      steps.outcome = outcome;

      // =====================================
      // STEP 7 — OUTCOME VALIDATION
      // =====================================

      if (
        !PipelineContracts.validateOutcome(
          outcome
        )
      ) {
        throw new Error(
          "Invalid outcome contract"
        );
      }

      // =====================================
      // STEP 8 — CPILOT
      // =====================================

      const feedback =
        this.cpilot.observe(
          outcome
        );

      steps.feedback = feedback;

      // =====================================
      // STEP 9 — FEEDBACK VALIDATION
      // =====================================

      if (
        !PipelineContracts.validateFeedback(
          feedback
        )
      ) {
        throw new Error(
          "Invalid feedback contract"
        );
      }

      // =====================================
      // STEP 10 — FEEDBACK LOOP
      // =====================================

      if (
        typeof this.cclm
          .receiveFeedback ===
        "function"
      ) {

        this.cclm.receiveFeedback(
          feedback
        );
      }

      steps.ack = true;

      return {
        success: true,
        status: "completed",
        steps
      };

    } catch (error) {

      return {
        success: false,
        status: "pipeline_error",
        error: error.message,
        steps
      };
    }
  }
        }
