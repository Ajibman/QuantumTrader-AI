 // ======================================================
// META BRAIN — SINGLE COGNITIVE KERNEL (ORCHESTRATOR)
// ======================================================

class SyncEngine {

  constructor() {
    this.state = {
      simulation: { wins: 0, losses: 0 },
      live: { wins: 0, losses: 0 },
      driftScore: 0
    };
  }

  recordSimulation(correct) {
    correct
      ? this.state.simulation.wins++
      : this.state.simulation.losses++;

    this._updateDrift();
  }

  recordLive(correct) {
    correct
      ? this.state.live.wins++
      : this.state.live.losses++;

    this._updateDrift();
  }

  _updateDrift() {
    const sim = this._rate(this.state.simulation);
    const live = this._rate(this.state.live);
    this.state.driftScore = Math.abs(sim - live);
  }

  _rate(g) {
    const total = g.wins + g.losses;
    return total ? g.wins / total : 0.5;
  }

  getReport() {
    return {
      simulationWinRate: this._rate(this.state.simulation),
      liveWinRate: this._rate(this.state.live),
      driftScore: this.state.driftScore
    };
  }
}

// ------------------------------------------------------

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
      (
        signal.riskLevel === "high"
          ? -0.4
          : signal.riskLevel === "medium"
          ? -0.2
          : 0.1
      ) + this.learning.riskBias;

    const volatility =
      (signal.volatility > 0.7 ? -0.3 : 0.2) +
      this.learning.volatilityBias;

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
// META BRAIN ORCHESTRATOR
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

    this.syncEngine = new SyncEngine();
  }

  evaluate(signal, systemContext = {}) {

    const zone = this.zoneEngine.classify(signal);
    const raw = this.decisionEngine.evaluate(signal);

    const confidence = this.calibrationEngine.calibrate(
      Math.abs(raw.score),
      signal
    );

    const drift = this.syncEngine.state.driftScore;

    const action = this._decide(raw.score, drift);

    const output = {
      action,
      confidence,
      strength: raw.score,
      reasoning: this._reason(raw.score),
      meta: {
        zone,
        trend: raw.trend,
        risk: raw.risk,
        volatility: raw.volatility,
        drift
      }
    };

    this.memoryEngine.store(signal, output);

    return output;
  }

  _decide(score, drift) {

    if (drift > 0.6) {
      if (score > 0.5) return "BUY";
      if (score < -0.5) return "SELL";
      return "HOLD";
    }

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

  recordSimulationOutcome(correct) {
    this.syncEngine.recordSimulation(correct);
  }

  recordLiveOutcome(correct) {
    this.syncEngine.recordLive(correct);
  }

  getHealthReport() {
    return {
      learning: this.learning,
      sync: this.syncEngine.getReport()
    };
  }
}

// SINGLE EXPORT
export const metaBrain = new MetaBrain();
