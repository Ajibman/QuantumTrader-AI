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

    // 🧠 LEARNING LAYER (from simulation_feed integration)
    this.learning = {
      trendBias: 0,
      riskBias: 0,
      volatilityBias: 0,
      confidenceCalibrator: 1,
      history: {
        wins: 0,
        losses: 0,
        total: 0
      }
    };
  }

  /**
   * MAIN ENTRY POINT
   */
  evaluate(signal, systemContext = {}) {

    this._updateContext(systemContext);

    const trend = this._analyzeTrend(signal);
    const risk = this._analyzeRisk(signal);
    const volatility = this._analyzeVolatility(signal);

    // 🧠 NORMALIZED SCORE (prevents runaway values)
    const score = this._normalize(trend + risk + volatility);

    const decision = this._decide(score);

    const output = {
      action: decision.action,
      confidence: this._calibrateConfidence(decision.confidence),
      strength: score,
      reasoning: this._reason(score),
      meta: {
        trend,
        risk,
        volatility,
        rawScore: trend + risk + volatility
      }
    };

    this._storeMemory(signal, output);

    return output;
  }

  // --------------------------
  // CORE INTELLIGENCE LAYERS
  // --------------------------

  _analyzeTrend(signal) {
    const base = signal.trendStrength ?? 0;
    return base + this.learning.trendBias;
  }

  _analyzeRisk(signal) {
    const base =
      signal.riskLevel === "high" ? -0.4 :
      signal.riskLevel === "medium" ? -0.2 : 0.1;

    return base + this.learning.riskBias;
  }

  _analyzeVolatility(signal) {
    const base = (signal.volatility > 0.7 ? -0.3 : 0.2);
    return base + this.learning.volatilityBias;
  }

  // --------------------------
  // DECISION ENGINE (STABLE)
  // --------------------------

  _decide(score) {
    if (score > 0.35) {
      return {
        action: "BUY",
        confidence: Math.min(Math.abs(score), 1)
      };
    }

    if (score < -0.35) {
      return {
        action: "SELL",
        confidence: Math.min(Math.abs(score), 1)
      };
    }

    return {
      action: "HOLD",
      confidence: 0.5
    };
  }

  _reason(score) {
    if (score > 0.35) return "Bullish alignment across trend, risk, volatility";
    if (score < -0.35) return "Bearish pressure dominates signal structure";
    return "Neutral market equilibrium";
  }

  // --------------------------
  // SYSTEM CONTEXT
  // --------------------------

  _updateContext(systemContext) {
    this.context.market = systemContext.market ?? this.context.market;
    this.context.risk = systemContext.risk ?? this.context.risk;
  }

  // --------------------------
  // MEMORY SYSTEM (CONTROLLED)
  // --------------------------

  _storeMemory(signal, output) {
    this.context.memory.lastSignals.push(signal);
    this.context.memory.lastDecisions.push(output);

    // prevent memory explosion
    if (this.context.memory.lastSignals.length > 50) {
      this.context.memory.lastSignals.shift();
      this.context.memory.lastDecisions.shift();
    }
  }

  // --------------------------
  // STABILITY + NORMALIZATION
  // --------------------------

  _normalize(value) {
    // clamps extreme drift (key flicker fix)
    return Math.max(-1, Math.min(1, value));
  }

  _calibrateConfidence(confidence) {
    // prevents inflated confidence from bias/learning drift
    return Math.max(0, Math.min(1, confidence * this.learning.confidenceCalibrator));
  }

  // --------------------------
  // LEARNING ENTRY POINT (from simulation_feed.js)
  // --------------------------

  learnFromSimulation(results = []) {
    if (!Array.isArray(results)) return;

    for (const r of results) {
      this._applyLearning(r);
    }
  }

  _applyLearning(record) {
    const { decision, evaluation } = record;
    if (!evaluation || !decision) return;

    const correct = evaluation.actionCorrect;

    this.learning.history.total++;

    if (correct) this.learning.history.wins++;
    else this.learning.history.losses++;

    const delta = correct ? 0.005 : -0.005; // VERY SMALL = stability-first

    this.learning.trendBias += delta * (decision.meta?.trend || 1);
    this.learning.riskBias += delta * (decision.meta?.risk || 1);
    this.learning.volatilityBias += delta * (decision.meta?.volatility || 1);

    // confidence calibration (prevents overconfidence drift)
    this.learning.confidenceCalibrator += correct ? 0.001 : -0.001;

    // clamp all learning signals
    this.learning.trendBias = this._clamp(this.learning.trendBias, -0.5, 0.5);
    this.learning.riskBias = this._clamp(this.learning.riskBias, -0.5, 0.5);
    this.learning.volatilityBias = this._clamp(this.learning.volatilityBias, -0.5, 0.5);
    this.learning.confidenceCalibrator = this._clamp(this.learning.confidenceCalibrator, 0.5, 1.5);
  }

  _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
}

// SINGLE EXPORT
export const metaBrain = new MetaBrain();
