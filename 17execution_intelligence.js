export class ExecutionIntelligence {

  constructor(config = {}) {

    this.baseSizeFactor =
      config.baseSizeFactor ?? 1;

    this.aggressionMap = {
      AGGRESSIVE: 1.3,
      NORMAL: 1,
      CAUTIOUS: 0.7,
      DEFENSIVE: 0.4
    };

    this.history = [];
  }

  // =====================================================
  // MAIN STRATEGY BUILDER
  // =====================================================

  build({ signal, decision, risk, swarm }) {

    const riskMode =
      risk?.mode ?? "NORMAL";

    const swarmScore =
      swarm?.swarmScore ?? 0;

    const liquidityPressure =
      this._computeLiquidityPressure(signal);

    const size =
      this._computePositionSize({
        decision,
        riskMode,
        swarmScore
      });

    const urgency =
      this._computeUrgency({
        decision,
        riskMode,
        liquidityPressure
      });

    const routing =
      this._selectRouting({
        liquidityPressure,
        riskMode
      });

    const output = {
      mode: riskMode,
      size,
      urgency,
      routing,
      liquidityPressure,
      swarmScore
    };

    this.history.push(output);

    if (this.history.length > 100) {
      this.history.shift();
    }

    return output;
  }

  // =====================================================
  // POSITION SIZING ENGINE
  // =====================================================

  _computePositionSize({ decision, riskMode, swarmScore }) {

    const base =
      Math.abs(decision?.strength ?? 0) *
      this.baseSizeFactor;

    const aggression =
      this.aggressionMap[riskMode] ?? 1;

    const swarmModifier =
      0.5 + swarmScore;

    const size =
      base * aggression * swarmModifier;

    return Math.max(0, Math.min(1, size));
  }

  // =====================================================
  // URGENCY ENGINE
  // =====================================================

  _computeUrgency({ decision, riskMode, liquidityPressure }) {

    const base =
      decision?.confidence ?? 0.5;

    const riskPenalty =
      riskMode === "DEFENSIVE"
        ? -0.3
        : riskMode === "AGGRESSIVE"
        ? 0.2
        : 0;

    const liquidityPenalty =
      liquidityPressure * 0.5;

    const urgency =
      base + riskPenalty - liquidityPenalty;

    return Math.max(0, Math.min(1, urgency));
  }

  // =====================================================
  // ROUTING ENGINE
  // =====================================================

  _selectRouting({ liquidityPressure, riskMode }) {

    if (liquidityPressure > 0.7) {
      return "SMART_SPLIT";
    }

    if (riskMode === "AGGRESSIVE") {
      return "FAST_MARKET";
    }

    if (riskMode === "DEFENSIVE") {
      return "PASSIVE_LIMIT";
    }

    return "STANDARD";
  }

  // =====================================================
  // LIQUIDITY MODEL
  // =====================================================

  _computeLiquidityPressure(signal) {

    const spread =
      signal.spread ?? 0.01;

    const volatility =
      signal.volatility ?? 0;

    return Math.min(1, (spread * 2) + volatility);
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    if (!this.history.length) {
      return {
        avgSize: 0,
        avgUrgency: 0
      };
    }

    return {
      avgSize:
        this.history.reduce((s, h) => s + h.size, 0) /
        this.history.length,

      avgUrgency:
        this.history.reduce((s, h) => s + h.urgency, 0) /
        this.history.length
    };
  }

  // =====================================================
  // RESET
  // =====================================================

  reset() {
    this.history = [];
  }
}
