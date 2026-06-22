// QuantumTrader-AI — Architecture Integrity Auditor
// Structural validation layer (NO execution, NO side effects)

export class ArchitectureIntegrityAuditor {

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

  // =====================================
  // RUN FULL ARCHITECTURE AUDIT
  // =====================================

  runAudit() {

    const report = {
      valid: true,
      issues: [],
      components: {}
    };

    // -------------------------------------
    // 1. Runtime Layer Check
    // -------------------------------------

    report.components.runtime =
      this._checkExists(this.runtime, "PipelineRuntime", report);

    // -------------------------------------
    // 2. Engine Check
    // -------------------------------------

    report.components.engine =
      this._checkExists(this.engine, "PipelineEngine", report);

    // -------------------------------------
    // 3. CCLMⁿ Check
    // -------------------------------------

    report.components.cclm =
      this._checkFunction(this.cclm, "evaluate", report);

    this._checkFunction(this.cclm, "receiveFeedback", report, true);

    // -------------------------------------
    // 4. EventHub Check
    // -------------------------------------

    report.components.eventHub =
      this._checkFunction(this.eventHub, "resolve", report);

    // -------------------------------------
    // 5. Executor Check
    // -------------------------------------

    report.components.executor =
      this._checkFunction(this.executor, "execute", report);

    // -------------------------------------
    // 6. cpilot Check
    // -------------------------------------

    report.components.cpilot =
      this._checkFunction(this.cpilot, "observe", report);

    // -------------------------------------
    // FINAL RESULT
    // -------------------------------------

    return report;
  }

  // =====================================
  // EXISTENCE CHECK
  // =====================================

  _checkExists(component, name, report) {

    if (!component) {
      report.valid = false;
      report.issues.push(`${name} is missing`);
      return false;
    }

    return true;
  }

  // =====================================
  // FUNCTION CHECK
  // =====================================

  _checkFunction(component, fnName, report, optional = false) {

    if (!component) {
      if (!optional) {
        report.valid = false;
        report.issues.push(`Component missing for ${fnName}`);
      }
      return false;
    }

    if (typeof component[fnName] !== "function") {
      if (!optional) {
        report.valid = false;
        report.issues.push(`Missing function: ${fnName}`);
      }
      return false;
    }

    return true;
  }
}
