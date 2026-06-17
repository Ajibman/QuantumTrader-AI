export class CoordinationLayer {

  constructor(config = {}) {

    this.history = [];

    this.state = {
      coherence: 1,
      conflictLevel: 0,
      unifiedDirection: 0
    };
  }

  // =====================================================
  // MAIN COORDINATION ENGINE
  // =====================================================

  coordinate({
    swarm,
    evolution,
    risk,
    execution,
    awareness
  }) {

    const swarmScore =
      swarm?.swarmScore ?? 0;

    const riskIntensity =
      risk?.riskIntensity ?? 0.5;

    const evolutionDrift =
      Math.abs(evolution?.adaptationSignal ?? 0);

    const awarenessAlignment =
      awareness?.alignment ?? awareness?.alignmentScore ?? 0.5;

    const coherence =
      this._computeCoherence({
        swarmScore,
        riskIntensity,
        evolutionDrift,
        awarenessAlignment
      });

    const conflict =
      this._computeConflict({
        swarmScore,
        riskIntensity,
        awarenessAlignment
      });

    const unifiedDirection =
      this._computeUnifiedDirection({
        swarmScore,
        riskIntensity,
        awarenessAlignment
      });

    const output = {
      coherence,
      conflictLevel: conflict,
      unifiedDirection,
      swarmScore,
      riskIntensity,
      evolutionDrift,
      awarenessAlignment
    };

    this._updateState(output);

    this.history.push(output);

    if (this.history.length > 100) {
      this.history.shift();
    }

    return output;
  }

  // =====================================================
  // COHERENCE ENGINE
  // =====================================================

  _computeCoherence({
    swarmScore,
    riskIntensity,
    evolutionDrift,
    awarenessAlignment
  }) {

    const alignmentFactor =
      (swarmScore + awarenessAlignment) / 2;

    const stabilityFactor =
      1 - evolutionDrift;

    const riskPenalty =
      riskIntensity * 0.3;

    const coherence =
      (alignmentFactor * 0.6) +
      (stabilityFactor * 0.4) -
      riskPenalty;

    return Math.max(0, Math.min(1, coherence));
  }

  // =====================================================
  // CONFLICT ENGINE
  // =====================================================

  _computeConflict({
    swarmScore,
    riskIntensity,
    awarenessAlignment
  }) {

    const divergence =
      Math.abs(swarmScore - awarenessAlignment);

    const riskPressure =
      riskIntensity;

    const conflict =
      (divergence * 0.6) + (riskPressure * 0.4);

    return Math.max(0, Math.min(1, conflict));
  }

  // =====================================================
  // UNIFIED DIRECTION ENGINE
  // =====================================================

  _computeUnifiedDirection({
    swarmScore,
    riskIntensity,
    awarenessAlignment
  }) {

    const direction =
      (swarmScore * 0.5) +
      (awarenessAlignment * 0.3) -
      (riskIntensity * 0.2);

    return Math.max(-1, Math.min(1, direction));
  }

  // =====================================================
  // STATE UPDATE
  // =====================================================

  _updateState(output) {

    this.state.coherence = output.coherence;
    this.state.conflictLevel = output.conflictLevel;
    this.state.unifiedDirection = output.unifiedDirection;
  }

  // =====================================================
  // SYSTEM INSIGHTS
  // =====================================================

  isCoherent() {
    return this.state.coherence > 0.7;
  }

  isConflicted() {
    return this.state.conflictLevel > 0.6;
  }

  getDirection() {
    return this.state.unifiedDirection;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    if (!this.history.length) {
      return {
        avgCoherence: 0,
        avgConflict: 0
      };
    }

    return {
      avgCoherence:
        this.history.reduce((s, h) => s + h.coherence, 0) /
        this.history.length,

      avgConflict:
        this.history.reduce((s, h) => s + h.conflictLevel, 0) /
        this.history.length
    };
  }

  // =====================================================
  // RESET
  // =====================================================

  reset() {
    this.history = [];

    this.state = {
      coherence: 1,
      conflictLevel: 0,
      unifiedDirection: 0
    };
  }
}
