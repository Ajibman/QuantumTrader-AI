export class RiskGovernor {

  constructor(config = {}) {

    this.baseRiskTolerance =
      config.baseRiskTolerance ?? 0.5;

    this.aggressionFactor =
      config.aggressionFactor ?? 1;

    this.defenseBias =
      config.defenseBias ?? 1;

    this.history = [];

    this.state = {
      riskIntensity: 0.5,
      mode: "NORMAL" // NORMAL | CAUTIOUS | AGGRESSIVE | DEFENSIVE
    };
  }

  // =====================================================
  // CORE RISK EVALUATION
  // =====================================================

  evaluate({ signal, decision, swarm, evolution }) {

    const volatility =
      signal.volatility ?? 0;

    const trend =
      signal.trendStrength ?? 0;

    const swarmRisk =
      1 - (swarm?.stability ?? 0.5);

    const evolutionDrift =
      Math.abs(evolution?.adaptationSignal ?? 0);

    const compositeRisk =
      this._computeRisk({
        volatility,
        trend,
        swarmRisk,
        evolutionDrift,
        decision
      });

    const mode =
      this._determineMode(compositeRisk);

    this._updateState(compositeRisk, mode);

    const output = {
      riskIntensity: compositeRisk,
      mode,
      allowed: compositeRisk < 0.85,
      breakdown: {
        volatility,
        swarmRisk,
        evolutionDrift,
        trend
      }
    };

    this.history.push(output);

    if (this.history.length > 100) {
      this.history.shift();
    }

    return output;
  }

  // =====================================================
  // RISK ENGINE
  // =====================================================

  _computeRisk({
    volatility,
    trend,
    swarmRisk,
    evolutionDrift,
    decision
  }) {

    const directionPenalty =
      decision?.action === "HOLD"
        ? 0.1
        : 0;

    const riskScore =
      (volatility * 0.35) +
      (swarmRisk * 0.25) +
      (evolutionDrift * 0.2) +
      ((1 - trend) * 0.15) +
      directionPenalty;

    return Math.max(0, Math.min(1, riskScore));
  }

  // =====================================================
  // MODE SELECTION
  // =====================================================

  _determineMode(risk) {

    if (risk > 0.8) return "DEFENSIVE";
    if (risk > 0.6) return "CAUTIOUS";
    if (risk < 0.3) return "AGGRESSIVE";
    return "NORMAL";
  }

  // =====================================================
  // STATE UPDATE
  // =====================================================

  _updateState(risk, mode) {

    this.state.riskIntensity = risk;
    this.state.mode = mode;
  }

  // =====================================================
  // STRATEGY HELPERS
  // =====================================================

  isAggressiveAllowed() {
    return this.state.mode === "AGGRESSIVE";
  }

  isDefensive() {
    return this.state.mode === "DEFENSIVE";
  }

  isNormal() {
    return this.state.mode === "NORMAL";
  }

  isCautious() {
    return this.state.mode === "CAUTIOUS";
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    if (!this.history.length) {
      return {
        avgRisk: 0,
        modeDistribution: {}
      };
    }

    const modes =
      this.history.reduce((acc, h) => {
        acc[h.mode] = (acc[h.mode] || 0) + 1;
        return acc;
      }, {});

    return {
      avgRisk:
        this.history.reduce((s, h) => s + h.riskIntensity, 0) /
        this.history.length,

      modeDistribution: modes
    };
  }

  // =====================================================
  // RESET
  // =====================================================

  reset() {
    this.history = [];

    this.state = {
      riskIntensity: 0.5,
      mode: "NORMAL"
    };
  }
}
