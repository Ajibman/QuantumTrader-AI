export class AwarenessLayer {

  constructor(config = {}) {

    this.history = [];

    this.state = {
      confidenceDrift: 0,
      decisionStability: 1,
      alignmentScore: 1,
      noiseIndex: 0
    };
  }

  // =====================================================
  // CORE SELF-AWARENESS EVALUATION
  // =====================================================

  observe({ signal, decision, swarm, risk, execution }) {

    const confidence =
      decision?.confidence ?? 0;

    const swarmScore =
      swarm?.swarmScore ?? 0;

    const riskLevel =
      risk?.riskIntensity ?? 0.5;

    const executionStrength =
      execution?.size ?? 0;

    const stability =
      this._computeStability(confidence);

    const alignment =
      this._computeAlignment({
        decision,
        swarmScore,
        riskLevel
      });

    const noise =
      this._computeNoise(signal);

    const output = {
      confidence,
      swarmScore,
      riskLevel,
      executionStrength,
      stability,
      alignment,
      noise
    };

    this._updateState(output);

    this.history.push(output);

    if (this.history.length > 100) {
      this.history.shift();
    }

    return output;
  }

  // =====================================================
  // STABILITY OF DECISIONS
  // =====================================================

  _computeStability(confidence) {

    const prev =
      this.history.at(-1)?.confidence ?? confidence;

    const drift =
      Math.abs(confidence - prev);

    return Math.max(0, 1 - drift);
  }

  // =====================================================
  // ALIGNMENT ACROSS SYSTEMS
  // =====================================================

  _computeAlignment({ decision, swarmScore, riskLevel }) {

    const direction =
      decision?.action === "BUY"
        ? 1
        : decision?.action === "SELL"
        ? -1
        : 0;

    const swarmDirection =
      swarmScore > 0.2
        ? 1
        : swarmScore < -0.2
        ? -1
        : 0;

    const riskPenalty =
      riskLevel > 0.7 ? 0.3 : 0;

    const alignment =
      1 - Math.abs(direction - swarmDirection) * 0.5 - riskPenalty;

    return Math.max(0, Math.min(1, alignment));
  }

  // =====================================================
  // NOISE DETECTION
  // =====================================================

  _computeNoise(signal) {

    const volatility =
      signal.volatility ?? 0;

    const trend =
      signal.trendStrength ?? 0;

    return Math.max(0, volatility - trend);
  }

  // =====================================================
  // STATE UPDATE
  // =====================================================

  _updateState(output) {

    this.state.confidenceDrift =
      Math.abs(output.confidence - (this.history.at(-1)?.confidence ?? output.confidence));

    this.state.decisionStability =
      output.stability;

    this.state.alignmentScore =
      output.alignment;

    this.state.noiseIndex =
      output.noise;
  }

  // =====================================================
  // INSIGHT HELPERS
  // =====================================================

  isStable() {
    return this.state.decisionStability > 0.7;
  }

  isAligned() {
    return this.state.alignmentScore > 0.6;
  }

  isNoisy() {
    return this.state.noiseIndex > 0.5;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    if (!this.history.length) {
      return {
        avgStability: 0,
        avgAlignment: 0
      };
    }

    return {
      avgStability:
        this.history.reduce((s, h) => s + h.stability, 0) /
        this.history.length,

      avgAlignment:
        this.history.reduce((s, h) => s + h.alignment, 0) /
        this.history.length
    };
  }

  // =====================================================
  // RESET
  // =====================================================

  reset() {
    this.history = [];

    this.state = {
      confidenceDrift: 0,
      decisionStability: 1,
      alignmentScore: 1,
      noiseIndex: 0
    };
  }
}
