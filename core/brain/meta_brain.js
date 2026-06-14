// core/brain/meta_brain.js

class MetaBrain {

  constructor() {
    this.context = {
      market: {},
      risk: {},
      memory: {
        lastSignals: [],
        lastDecisions: []
      }
    };
  }

  /**
   * MAIN ENTRY POINT (ONLY ONE USED ACROSS SYSTEM)
   */
  evaluate(signal, systemContext = {}) {

    this._updateContext(signal, systemContext);

    const trend = this._analyzeTrend(signal);
    const risk = this._analyzeRisk(signal);
    const volatility = this._analyzeVolatility(signal);

    const score = trend + risk + volatility;

    const decision = this._decide(score);

    const output = {
      action: decision.action,
      confidence: decision.confidence,
      strength: score,
      reasoning: this._reason(score),
      meta: {
        trend,
        risk,
        volatility
      }
    };

    this._storeMemory(signal, output);

    return output;
  }

  // --------------------------
  // CORE INTELLIGENCE LAYERS
  // --------------------------

  _analyzeTrend(signal) {
    return signal.trendStrength || 0;
  }

  _analyzeRisk(signal) {
    if (signal.riskLevel === "high") return -0.4;
    if (signal.riskLevel === "medium") return -0.2;
    return 0.1;
  }

  _analyzeVolatility(signal) {
    return signal.volatility > 0.7 ? -0.3 : 0.2;
  }

  _decide(score) {
    if (score > 0.3) return { action: "BUY", confidence: Math.min(score, 1) };
    if (score < -0.3) return { action: "SELL", confidence: Math.min(Math.abs(score), 1) };
    return { action: "HOLD", confidence: 0.5 };
  }

  _reason(score) {
    if (score > 0.3) return "Positive alignment across trend and risk layers";
    if (score < -0.3) return "Risk or volatility dominance detected";
    return "Neutral market structure";
  }

  _updateContext(signal, systemContext) {
    this.context.market = systemContext.market || this.context.market;
    this.context.risk = systemContext.risk || this.context.risk;
  }

  _storeMemory(signal, output) {
    this.context.memory.lastSignals.push(signal);
    this.context.memory.lastDecisions.push(output);

    if (this.context.memory.lastSignals.length > 50) {
      this.context.memory.lastSignals.shift();
      this.context.memory.lastDecisions.shift();
    }
  }
}

// SINGLE EXPORT
export const metaBrain = new MetaBrain();
