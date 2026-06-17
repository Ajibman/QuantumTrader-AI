export class EvolutionLayer {

  constructor(config = {}) {

    this.learningRate = config.learningRate ?? 0.01;

    this.driftThreshold = config.driftThreshold ?? 0.35;

    this.history = [];

    this.adaptationState = {
      trendDrift: 0,
      riskDrift: 0,
      volatilityDrift: 0,
      stabilityIndex: 1
    };
  }

  // =====================================================
  // CORE EVOLUTION EVALUATION
  // =====================================================

  evaluate({ signal, decision, learning, swarm }) {

    const drift = this._computeDrift(signal, learning);

    const swarmPressure =
      swarm?.swarmScore ?? 0;

    const stability =
      swarm?.stability ?? 1;

    const adaptationSignal =
      this._computeAdaptation(drift, swarmPressure, stability);

    this._applyLearningShift(adaptationSignal);

    const output = {
      drift,
      swarmPressure,
      stability,
      adaptationSignal,
      learningRate: this.learningRate,
      state: this.adaptationState
    };

    this.history.push(output);

    if (this.history.length > 100) {
      this.history.shift();
    }

    return output;
  }

  // =====================================================
  // DRIFT ANALYSIS
  // =====================================================

  _computeDrift(signal, learning) {

    const trendDrift =
      Math.abs(signal.trendStrength ?? 0) - (learning.trendBias ?? 0);

    const riskDrift =
      (signal.riskLevel === "high" ? 1 : 0.3) - (learning.riskBias ?? 0);

    const volatilityDrift =
      (signal.volatility ?? 0) - (learning.volatilityBias ?? 0);

    return {
      trendDrift,
      riskDrift,
      volatilityDrift,

      total:
        (trendDrift + riskDrift + volatilityDrift) / 3
    };
  }

  // =====================================================
  // ADAPTATION ENGINE
  // =====================================================

  _computeAdaptation(drift, swarmPressure, stability) {

    const pressureFactor =
      1 + swarmPressure;

    const stabilityFactor =
      1 - stability;

    const adaptationScore =
      drift.total * pressureFactor * (1 + stabilityFactor);

    return adaptationScore;
  }

  // =====================================================
  // LEARNING UPDATE
  // =====================================================

  _applyLearningShift(adaptationSignal) {

    const shift =
      adaptationSignal * this.learningRate;

    this.adaptationState.trendDrift += shift;
    this.adaptationState.riskDrift += shift;
    this.adaptationState.volatilityDrift += shift;

    this.adaptationState.stabilityIndex =
      Math.max(
        0,
        Math.min(
          1,
          1 - Math.abs(shift)
        )
      );
  }

  // =====================================================
  // SYSTEM HEALTH
  // =====================================================

  getState() {
    return this.adaptationState;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    if (!this.history.length) {
      return {
        avgDrift: 0,
        avgAdaptation: 0
      };
    }

    return {

      avgDrift:
        this.history.reduce((s, h) => s + h.drift.total, 0) /
        this.history.length,

      avgAdaptation:
        this.history.reduce((s, h) => s + h.adaptationSignal, 0) /
        this.history.length
    };
  }

  // =====================================================
  // RESET
  // =====================================================

  reset() {
    this.history = [];

    this.adaptationState = {
      trendDrift: 0,
      riskDrift: 0,
      volatilityDrift: 0,
      stabilityIndex: 1
    };
  }
}
