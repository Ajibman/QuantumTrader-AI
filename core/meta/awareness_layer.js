// ======================================================
// STAGE 18A — AWARENESS LAYER (SELF-MONITORING CORE)
// QuantumTrader-AI
// ======================================================

export class AwarenessLayer {

  constructor() {

    this.state = {
      systemLoad: 0,
      decisionEntropy: 0,
      riskPressure: 0,
      executionQuality: 1,
      swarmCoherence: 0.5
    };

    this.history = {
      entropy: [],
      risk: [],
      coherence: []
    };
  }

  // --------------------------------------------------
  // MAIN SYSTEM OBSERVATION LOOP
  // --------------------------------------------------

  observe({ decision, risk, execution, swarm }) {

    const entropy = this._computeEntropy(decision);

    const riskPressure =
      risk?.riskIntensity ??
      risk?.riskPressure ??
      0.5;

    const executionQuality =
      this._executionScore(execution);

    const swarmCoherence =
      swarm?.alignmentScore ?? 0.5;

    // --------------------------------------------------
    // UPDATE INTERNAL STATE
    // --------------------------------------------------

    this.state.decisionEntropy = entropy;
    this.state.riskPressure = riskPressure;
    this.state.executionQuality = executionQuality;
    this.state.swarmCoherence = swarmCoherence;

    // system load is derived meta-pressure
    this.state.systemLoad =
      (entropy + riskPressure + (1 - executionQuality)) / 3;

    // --------------------------------------------------
    // STORE HISTORY (bounded)
    // --------------------------------------------------

    this._push(this.history.entropy, entropy);
    this._push(this.history.risk, riskPressure);
    this._push(this.history.coherence, swarmCoherence);

    return this.snapshot();
  }

  // --------------------------------------------------
  // ENTROPY (DECISION INSTABILITY MEASURE)
  // --------------------------------------------------

  _computeEntropy(decision) {

    if (!decision) return 0.5;

    const confidence = decision.confidence ?? 0.5;

    const strength = Math.abs(decision.strength ?? 0);

    // higher confidence + strong direction = low entropy
    const entropy =
      1 - (confidence * strength);

    return this._clamp(entropy, 0, 1);
  }

  // --------------------------------------------------
  // EXECUTION QUALITY SCORE
  // --------------------------------------------------

  _executionScore(execution) {

    if (!execution) return 0.5;

    const slippage = execution.slippage ?? 0;
    const latency = execution.latency ?? 100;

    let score =
      1 - (slippage * 5) - (latency / 1000);

    return this._clamp(score, 0, 1);
  }

  // --------------------------------------------------
  // SYSTEM SNAPSHOT
  // --------------------------------------------------

  snapshot() {

    return {
      systemLoad: this.state.systemLoad,
      decisionEntropy: this.state.decisionEntropy,
      riskPressure: this.state.riskPressure,
      executionQuality: this.state.executionQuality,
      swarmCoherence: this.state.swarmCoherence,

      status: this._status()
    };
  }

  // --------------------------------------------------
  // SYSTEM STATUS CLASSIFICATION
  // --------------------------------------------------

  _status() {

    const load = this.state.systemLoad;

    if (load > 0.75) return "STRESSED";
    if (load > 0.5) return "ACTIVE";
    if (load > 0.3) return "STABLE";

    return "OPTIMAL";
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  _push(arr, value) {
    arr.push(value);
    if (arr.length > 50) arr.shift();
  }

  _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
}
