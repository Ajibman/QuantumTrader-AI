// ======================================================
// STAGE 22 — SYSTEM ORCHESTRATION LAYER (PINNED)
// META BRAIN ROUTING + STRATEGY CONTROL ONLY
// ======================================================

export class SystemOrchestrator {
  constructor({
    metaBrain,
    capitalControl,
    institutionalExecution,
    executionInfra
  }) {
    this.metaBrain = metaBrain;
    this.capitalControl = capitalControl;
    this.institutionalExecution = institutionalExecution;
    this.executionInfra = executionInfra;

    this.strategies = new Map();
    this.mode = "AUTONOMOUS";
  }

  registerStrategy(name, handler) {
    this.strategies.set(name, handler);
  }

  async evaluate(signal) {
    // 1. PURE INTELLIGENCE (NO MODIFICATION)
    const decision = this.metaBrain.evaluate(signal);

    // 2. RISK GATE (PROTECTION ONLY)
    const risk = this.capitalControl.evaluateRisk(signal, decision);

    // 3. EXECUTION PLAN (SIZING ONLY)
    const executionPlan = this.capitalControl.computeExecution(
      signal,
      decision,
      risk
    );

    // 4. STRATEGY SELECTION (ROUTING ONLY)
    const strategy = this._selectStrategy(signal, decision, risk);

    const strategyCheck = await this._runStrategy(
      strategy,
      signal,
      decision,
      executionPlan
    );

    if (!strategyCheck.allowed) {
      return this._halt(signal, decision, risk);
    }

    // 5. EXECUTION PIPELINE (NO INTELLIGENCE)
    const execution = this.institutionalExecution.process(
      signal,
      decision,
      executionPlan
    );

    const queued = this.executionInfra.submit(
      signal,
      decision,
      executionPlan
    );

    return {
      action: decision.action,
      confidence: decision.confidence,
      strategy,
      risk: risk.riskLevel,
      execution,
      queue: queued,
      mode: this.mode
    };
  }

  _selectStrategy(signal, decision, risk) {
    if (risk.riskLevel === "CRITICAL") return "DEFENSIVE";
    if ((signal.volatility ?? 0) > 0.85) return "VOLATILITY_SCALP";
    if (decision.confidence > 0.8) return "AGGRESSIVE_TREND";
    if (decision.confidence < 0.3) return "OBSERVE_ONLY";
    return "BALANCED";
  }

  async _runStrategy(name, signal, decision, executionPlan) {
    const handler = this.strategies.get(name);
    if (!handler) return { allowed: true, fallback: true };

    return await handler({ signal, decision, executionPlan });
  }

  _halt(signal, decision, risk) {
    return {
      action: "HOLD",
      confidence: 0,
      reason: "ORCHESTRATOR_BLOCK",
      risk,
      meta: { signal, decision }
    };
  }

  setMode(mode) {
    this.mode = mode;
  }

  getMode() {
    return this.mode;
  }
}
