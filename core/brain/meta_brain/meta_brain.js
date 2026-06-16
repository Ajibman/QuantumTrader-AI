 // ------------------------------------------------------
// POLICY SELF-OPTIMIZATION ENGINE (PRODUCTION SAFE)
// ------------------------------------------------------

class PolicyOptimizer {
  constructor() {
    this.state = {
      TRENDING: this._init(),
      VOLATILE: this._init(),
      RANGING: this._init(),
      RECOVERY: this._init(),
      BREAKDOWN: this._init()
    };
  }

  _init() {
    return {
      buy: 0.35,
      sell: -0.35,
      confidence: 1.0,

      // stability memory (prevents overreaction)
      scoreEMA: 0,
      updateCount: 0
    };
  }

  // -----------------------------
  // PUBLIC UPDATE ENTRY
  // -----------------------------
  update(context, score, wasCorrect) {
    const p = this.state[context];
    if (!p) return;

    // ignore noise early
    if (p.updateCount < 10) {
      p.updateCount++;
      return;
    }

    const reward = wasCorrect ? 1 : -1;

    // EMA smoothing (slow perception of system quality)
    const alpha = 0.05;
    p.scoreEMA = (alpha * score) + ((1 - alpha) * p.scoreEMA);

    // only adjust if signal is consistent over time
    if (Math.abs(p.scoreEMA) < 0.15) {
      return; // neutral zone → no policy movement
    }

    // tiny step size (critical for stability)
    const step = 0.0025;

    // -----------------------------
    // BUY THRESHOLD ADJUSTMENT
    // -----------------------------
    if (p.scoreEMA > 0.2 && reward > 0) {
      p.buy = this._clamp(p.buy + step, 0.25, 0.60);
    }

    if (p.scoreEMA < -0.2 && reward < 0) {
      p.buy = this._clamp(p.buy - step, 0.25, 0.60);
    }

    // -----------------------------
    // SELL THRESHOLD ADJUSTMENT
    // -----------------------------
    if (p.scoreEMA < -0.2 && reward > 0) {
      p.sell = this._clamp(p.sell - step, -0.60, -0.25);
    }

    if (p.scoreEMA > 0.2 && reward < 0) {
      p.sell = this._clamp(p.sell + step, -0.60, -0.25);
    }

    // -----------------------------
    // CONFIDENCE ADJUSTMENT
    // -----------------------------
    if (reward > 0) {
      p.confidence = this._clamp(p.confidence + 0.001, 0.8, 1.2);
    } else {
      p.confidence = this._clamp(p.confidence - 0.001, 0.8, 1.2);
    }

    p.updateCount++;
  }

  // -----------------------------
  // GET CURRENT POLICY
  // -----------------------------
  get(context) {
    const p = this.state[context] || this.state.RANGING;

    return {
      buyThreshold: p.buy,
      sellThreshold: p.sell,
      confidenceMultiplier: p.confidence
    };
  }

  // -----------------------------
  // SAFETY GUARD
  // -----------------------------
  _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
}
