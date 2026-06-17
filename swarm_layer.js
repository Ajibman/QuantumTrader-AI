export class SwarmLayer {

  constructor(config = {}) {

    this.agents = config.agents ?? [
      "momentum_agent",
      "risk_agent",
      "sentiment_agent",
      "volatility_agent"
    ];

    this.history = [];
  }

  // =====================================================
  // CORE SWARM EVALUATION
  // =====================================================

  evaluate(signal, decision) {

    const votes = this._collectVotes(signal, decision);

    const consensus = this._computeConsensus(votes);

    const stability = this._computeStability(votes);

    const conflict = this._detectConflict(votes);

    const swarmScore =
      (consensus * 0.5) +
      (stability * 0.3) -
      (conflict * 0.2);

    const output = {
      swarmScore,
      consensus,
      stability,
      conflict,
      votes
    };

    this.history.push(output);

    if (this.history.length > 50) {
      this.history.shift();
    }

    return output;
  }

  // =====================================================
  // AGENT SIMULATION
  // =====================================================

  _collectVotes(signal, decision) {

    return this.agents.map(agent => {

      switch (agent) {

        case "momentum_agent":
          return signal.trendStrength ?? 0;

        case "risk_agent":
          return signal.riskLevel === "high"
            ? -0.8
            : 0.2;

        case "sentiment_agent":
          return (signal.sentiment ?? 0);

        case "volatility_agent":
          return -(signal.volatility ?? 0);

        default:
          return 0;
      }
    });
  }

  // =====================================================
  // CONSENSUS LOGIC
  // =====================================================

  _computeConsensus(votes) {

    const avg =
      votes.reduce((a, b) => a + b, 0) / votes.length;

    return Math.max(0, Math.min(1, (avg + 1) / 2));
  }

  // =====================================================
  // STABILITY LOGIC
  // =====================================================

  _computeStability(votes) {

    const mean =
      votes.reduce((a, b) => a + b, 0) / votes.length;

    const variance =
      votes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / votes.length;

    const stability =
      1 - Math.min(1, variance);

    return stability;
  }

  // =====================================================
  // CONFLICT DETECTION
  // =====================================================

  _detectConflict(votes) {

    const positives = votes.filter(v => v > 0).length;
    const negatives = votes.filter(v => v < 0).length;

    return Math.abs(positives - negatives) / votes.length;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {

    if (!this.history.length) {
      return {
        avgSwarmScore: 0,
        avgStability: 0
      };
    }

    return {
      avgSwarmScore:
        this.history.reduce((s, h) => s + h.swarmScore, 0) /
        this.history.length,

      avgStability:
        this.history.reduce((s, h) => s + h.stability, 0) /
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
