// QuantumTrader-AI — Unified System Control Layer
// Single entry point for execution, stress, metrics, audit, healing

import { PipelineRuntime }
  from "./pipeline_runtime.js";

import { PipelineStressRunner }
  from "./pipeline_stress_runner.js";

import { PipelineMetrics }
  from "./pipeline_metrics.js";

import { ArchitectureIntegrityAuditor }
  from "./architecture_integrity_auditor.js";

import { SelfHealingArchitectureAuditor }
  from "./self_healing_architecture_auditor.js";

export class SystemControlLayer {

  constructor(deps) {

    // Core runtime (execution)
    this.runtime = new PipelineRuntime(deps);

    // Stress testing wrapper
    this.stressRunner =
      new PipelineStressRunner({
        runtime: this.runtime
      });

    // Shared observability (optional external access)
    this.metrics = new PipelineMetrics();

    // Structural auditor
    this.integrityAuditor =
      new ArchitectureIntegrityAuditor(deps);

    // Self-healing analyzer
    this.healingAuditor =
      new SelfHealingArchitectureAuditor(deps);
  }

  // =====================================
  // SINGLE EVENT EXECUTION
  // =====================================

  async run(event) {

    const result =
      await this.runtime.run(event);

    this.metrics.record(result);

    return result;
  }

  // =====================================
  // STRESS TEST ENTRY
  // =====================================

  async stress(config) {

    return await this.stressRunner.run(config);
  }

  // =====================================
  // METRICS ACCESS
  // =====================================

  getMetrics() {

    return this.metrics.report();
  }

  resetMetrics() {

    this.metrics.reset();
  }

  // =====================================
  // ARCHITECTURE AUDIT
  // =====================================

  audit() {

    return this.integrityAuditor.runAudit();
  }

  // =====================================
  // SELF-HEALING DIAGNOSTIC
  // =====================================

  heal() {

    return this.healingAuditor.diagnose();
  }

  // =====================================
  // FULL SYSTEM SNAPSHOT
  // =====================================

  snapshot() {

    return {

      metrics: this.metrics.report(),
      audit: this.integrityAuditor.runAudit(),
      healing: this.healingAuditor.diagnose()
    };
  }
}
