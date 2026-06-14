 // core/brain/meta_brain/meta_brain.js

// ======================================================
// META BRAIN — SINGLE COGNITIVE KERNEL (ORCHESTRATOR)
// ======================================================

class ZoneEngine {
  constructor() {
    this.zones = {
      profit: { strong: 0, weak: 0 },
      danger: { strong: 0, weak: 0 },
      neutral: { strong: 0, weak: 0 }
    };
  }

  classify(signal) {
    const trend = signal.trendStrength ?? 0;
    const vol = signal.volatility ?? 0;
    const risk = signal.riskLevel;

    if (trend > 0.6 && vol < 0.5 && risk !== "high") return "profit";
    if (vol > 0.8 || risk === "high") return "danger";
    return "neutral";
  }

  getZoneBias(signal) {
    const zone = this.classify(signal);

    if (zone === "profit") return 0.1;
    if (zone === "danger") return -0.1;
    return 0;
  }

  record(zone, correct) {
    if (!this.zones[zone]) return;

    correct
      ? this.zones[zone].strong++
      : this.zones[zone].weak++;
  }

  reliability(zone) {
    const z = this.zones[zone];
    const total = z.strong + z.weak;

    if (total < 5) return 0.5;
    return z.strong / total;
  }
}

// ------------------------------------------------------

class DecisionEngine {
  constructor(learning, zoneEngine) {
    this.learning = learning;
    this.zoneEngine = zoneEngine;
  }

  evaluate(signal) {
    const trend = (signal.trendStrength ?? 0) + this.learning.trendBias;

    const risk =
      signal.riskLevel === "high"
        ? -0.4
        : signal.riskLevel === "medium"
        ? -0.2
        : 0.1;

    const volatility =
      (signal.volatility > 0.7 ? -0.3 : 0.2) + this.learning.volatilityBias;

    const zoneBias = this.zoneEngine.getZoneBias(signal);

    const rawScore = trend + risk + volatility + zoneBias;

    return {
      score: this._clamp(rawScore, -1, 1),
      trend,
      risk,
      volatility
    };
  }

  _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
}

// ------------------------------------------------------

class MemoryEngine {
  constructor() {
    this.lastSignals = [];
    this.lastDecisions = [];
  }

  store(signal, decision) {
    this.lastSignals.push(signal);
    this.lastDecisions.push(decision);

    if (this.lastSignals.length > 50) {
      this.lastSignals.shift();
      this.lastDecisions.shift();
    }
  }
}

// ------------------------------------------------------

class CalibrationEngine {
  constructor(learning, zoneEngine) {
    this.learning = learning;
    this.zoneEngine = zoneEngine;
  }

  calibrate(confidence, signal) {
    const zone = this.zoneEngine.classify(signal);
    const reliability = this.zoneEngine.reliability(zone);

    let adjusted = confidence * this.learning.confidenceCalibrator;
    adjusted *= 0.3 + reliability;

    return this._clamp(adjusted, 0, 1);
  }

  _clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
}

// ------------------------------------------------------

class LearningEngine {
  constructor(learning, zoneEngine) {
    this.learning = learning;
    this.zoneEngine = zoneEngine;
  }

  apply(results = []) {
    for (const r of results) {
      const correct = r.evaluation?.actionCorrect;
      const zone = r.decision?.meta?.zone;

      if (!zone) continue;

      this.zoneEngine.record(zone, correct);

      const delta = correct ? 0.005 : -0.005;

      this.learning.trendBias += delta;
      this.learning.riskBias += delta;
      this.learning.volatilityBias += delta;

      this.learning.confidenceCalibrator += correct ? 0.001 : -0.001;
    }

    this._clamp();
  }

  _clamp() {
    this.learning.trendBias = this._limit(this.learning.trendBias);
    this.learning.riskBias = this._limit(this.learning.riskBias);
    this.learning.volatilityBias = this._limit(this.learning.volatilityBias);
    this.learning.confidenceCalibrator = Math.max(
      0.5,
      Math.min(1.5, this.learning.confidenceCalibrator)
    );
  }

  _limit(v) {
    return Math.max(-0.5, Math.min(0.5, v));
  }
}

// ======================================================
// META BRAIN ORCHESTRATOR (SINGLE EXPORT)
// ======================================================

class MetaBrain {
  constructor() {
    this.learning = {
      trendBias: 0,
      riskBias: 0,
      volatilityBias: 0,
      confidenceCalibrator: 1
    };

    this.zoneEngine = new ZoneEngine();
    this.memoryEngine = new MemoryEngine();
    this.decisionEngine = new DecisionEngine(this.learning, this.zoneEngine);
    this.calibrationEngine = new CalibrationEngine(this.learning, this.zoneEngine);
    this.learningEngine = new LearningEngine(this.learning, this.zoneEngine);
  }

  evaluate(signal, systemContext = {}) {
    const zone = this.zoneEngine.classify(signal);

    const raw = this.decisionEngine.evaluate(signal);

    const confidence = this.calibrationEngine.calibrate(
      Math.abs(raw.score),
      signal
    );

    const action = this._decide(raw.score);

    const output = {
      action,
      confidence,
      strength: raw.score,
      reasoning: this._reason(raw.score),
      meta: {
        zone,
        trend: raw.trend,
        risk: raw.risk,
        volatility: raw.volatility
      }
    };

    this.memoryEngine.store(signal, output);

    return output;
  }

  _decide(score) {
    if (score > 0.35) return "BUY";
    if (score < -0.35) return "SELL";
    return "HOLD";
  }

  _reason(score) {
    if (score > 0.35) return "Bullish alignment across system layers";
    if (score < -0.35) return "Bearish pressure dominates structure";
    return "Neutral equilibrium state";
  }

  learnFromSimulation(results) {
    this.learningEngine.apply(results);
  }
}

// SINGLE EXPORT
export const metaBrain = new MetaBrain();
