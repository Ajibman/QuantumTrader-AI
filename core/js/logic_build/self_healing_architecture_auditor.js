// core/js/logic_build/self_healing_architecture_auditor.js
// QuantumTrader-AI — Self-Healing Architecture Auditor

export class SelfHealingArchitectureAuditor {

  constructor({
    runtime,
    engine,
    cclm,
    eventHub,
    executor,
    cpilot
  }) {

    this.runtime = runtime;
    this.engine = engine;
    this.cclm = cclm;
    this.eventHub = eventHub;
    this.executor = executor;
    this.cpilot = cpilot;
  }

  diagnose() {

    const report = {
      healthy: true,
      issues: [],
      recommendations: [],
      fallbackPlan: {}
    };

    this._check("runtime", this.runtime, report);
    this._check("engine", this.engine, report);

    this._checkFn("cclm", this.cclm, "evaluate", report);
    this._checkFn("cclm", this.cclm, "receiveFeedback", report, true);

    this._checkFn("eventHub", this.eventHub, "resolve", report);
    this._checkFn("executor", this.executor, "execute", report);
    this._checkFn("cpilot", this.cpilot, "observe", report);

    this._buildFallbacks(report);

    return report;
  }

  _check(name, component, report) {

    if (!component) {
      report.healthy = false;
      report.issues.push(`${name} missing`);

      report.recommendations.push(
        `Provide mock ${name} implementation`
      );
    }
  }

  _checkFn(name, component, fn, report, optional = false) {

    if (!component) {
      if (!optional) {
        report.healthy = false;
        report.issues.push(`${name} missing`);
      }
      return;
    }

    if (typeof component[fn] !== "function") {

      if (!optional) {
        report.healthy = false;
        report.issues.push(`${name}.${fn} missing`);
      }

      report.recommendations.push(
        `Implement ${name}.${fn}() or attach mock`
      );
    }
  }

  _buildFallbacks(report) {

    report.fallbackPlan = {
      cclm: !this.cclm
        ? "MockCCLM required"
        : null,

      eventHub: !this.eventHub
        ? "MockEventHub required"
        : null,

      executor: !this.executor
        ? "MockExecutor required"
        : null,

      cpilot: !this.cpilot
        ? "MockCPilot required"
        : null,

      runtime: !this.runtime
        ? "PipelineRuntime required"
        : null,

      engine: !this.engine
        ? "PipelineEngine required"
        : null
    };
  }
}
