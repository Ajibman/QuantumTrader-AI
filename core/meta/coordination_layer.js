// ======================================================
// STAGE 18B — COORDINATION LAYER (SYSTEM ORCHESTRATOR)
// QuantumTrader-AI
// ======================================================

export class CoordinationLayer {

  constructor() {

    this.state = {
      coherenceScore: 0.5,
      systemAlignment: 0.5,
      decisionStability: 0.5,
      executionHarmony: 0.5
    };

    this.history = {
      coherence: [],
      alignment: [],
      stability: []
    };
  }

  // --------------------------------------------------
  // MAIN COORDINATION ENGINE
  // --------------------------------------------------

  coordinate({
    swarm,
    evolution,
    risk,
    execution,
    awareness
  }) {

    // --------------------------------------------------
    // EXTRACT SYSTEM SIGNALS
    // --------------------------------------------------

    const swarmAlign =
      swarm?.alignmentScore ?? 0.5;

    const swarmDrift =
      swarm?.driftLevel ?? 0.5;

    const riskIntensity =
      risk?.riskIntensity ?? 0.5;

    const executionQuality =
      execution?.mode ? 1 - (execution.slippageRisk ?? 0.5) : 0.5;

    const systemLoad =
      awareness?.systemLoad ?? 0.5;

    const entropy =
      awareness?.decisionEntropy ?? 0.5;

    // --------------------------------------------------
    // COHERENCE MODEL (CORE OF 18B)
    // --------------------------------------------------

    const coherence =
      (swarmAlign * 0.3) +
      ((1 - swarmDrift) * 0.2) +
      ((1 - riskIntensity) * 0.2) +
      (executionQuality * 0.2) +
      ((1 - systemLoad) * 0.1);

    // --------------------------------------------------
    // ALIGNMENT MODEL
    // --------------------------------------------------

    const alignment =
      (swarmAlign * 0.4) +
      ((1 - entropy) * 0.3) +
      (executionQuality * 0.3);

    // --------------------------------------------------
    // STABILITY MODEL
    // --------------------------------------------------

    const stability =
      (1 - riskIntensity) * 0.5 +
      (1 - swarmDrift) * 0.3 +
      (executionQuality) * 0.2;

    // --------------------------------------------------
    // UPDATE STATE
    // --------------------------------------------------

    this.state.coherenceScore =
      this._smooth(this.state.coherenceScore, coherence);

    this.state.systemAlignment =
      this._smooth(this.state.systemAlignment, alignment);

    this.state.decisionStability =
      this._smooth(this.state.decisionStability, stability);

    this.state.executionHarmony =
      this._smooth(this.state.executionHarmony, executionQuality);

    // --------------------------------------------------
    // STORE HISTORY
    // --------------------------------------------------

    this._push(this.history.coherence, this.state.coherenceScore);
    this._push(this.history.alignment, this.state.systemAlignment);
    this._push(this.history.stability, this.state.decisionStability);

    // --------------------------------------------------
    // FINAL SYSTEM STATUS
    // --------------------------------------------------

    return this.snapshot();
  }

  // --------------------------------------------------
  // SYSTEM SNAPSHOT
  // --------------------------------------------------

  snapshot() {

    return {
      coherenceScore: this.state.coherenceScore,
      systemAlignment: this.state.systemAlignment,
      decisionStability: this.state.decisionStability,
      executionHarmony: this.state.executionHarmony,

      status: this._status()
    };
  }

  // --------------------------------------------------
  // SYSTEM STATE CLASSIFICATION
  // --------------------------------------------------

  _status() {

    const c = this.state.coherenceScore;

    if (c > 0.8) return "HIGHLY_COHERENT";
    if (c > 0.6) return "COHERENT";
    if (c > 0.4) return "UNSTABLE";

    return "DECOHERENT";
  }

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  _smooth(current, target) {
    return current * 0.85 + target * 0.15;
  }

  _push(arr, value) {
    arr.push(value);
    if (arr.length > 50) arr.shift();
  }
}
