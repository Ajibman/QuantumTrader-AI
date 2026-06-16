 // ======================================================
// META BRAIN — SINGLE COGNITIVE ORCHESTRATION KERNEL
// STAGE 9 — MULTI-BRAIN COMPETITION INTEGRATED
// ======================================================

import { SyncEngine } from "./engines/sync_engine.js";
import { HealthEngine } from "./engines/health_engine.js";


// ------------------------------------------------------
// ZONE ENGINE
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

    correct ? this.zones[zone].strong++ : this.zones[zone].weak++;
  }

  reliability(zone) {
    const z = this.zones[zone];
    const total = z.strong + z.weak;
    if (total < 5) return 0.5;
    return z.strong / total;
  }
}


// ------------------------------------------------------
// MEMORY ENGINE
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

  getRecentSignals(count = 10) {
    return this.lastSignals.slice(-count);
  }
}


// ------------------------------------------------------
// CONTEXT ENGINE
// ------------------------------------------------------

class ContextEngine {
  constructor(memoryEngine) {
    this.memoryEngine = memoryEngine;
  }

  classify(signal) {
    const history = this.memoryEngine.getRecentSignals(10);

    const trend = signal.trendStrength ?? 0;
    const volatility = signal.volatility ?? 0;

    if (history.length < 3) return "RANGING";

    const avgTrend =
      history.reduce((s, x) => s + (x.trendStrength ?? 0), 0) / history.length;

    const avgVol =
      history.reduce((s, x) => s + (x.volatility ?? 0), 0) / history.length;

    if (avgTrend > 0.7 && avgVol < 0.5) return "TRENDING";
    if (avgVol > 0.75) return "VOLATILE";
    if (avgTrend < 0.35) return "RANGING";

    if (trend > avgTrend && volatility < avgVol) return "RECOVERY";
    if (trend < avgTrend && volatility > avgVol) return "BREAKDOWN";

    return "RANGING";
  }
}


// ------------------------------------------------------
// REACTION ENGINE (STAGE 9 CONTROL LAYER)
// ------------------------------------------------------

class ReactionEngine {
  getProfile(context) {
    switch (context) {

      case "TRENDING":
        return { mode: "AGGRESSIVE", buy: 0.25, sell: -0.25, multiplier: 1.15 };

      case "RECOVERY":
        return { mode: "OPTIMISTIC", buy: 0.30, sell: -0.30, multiplier: 1.05 };

      case "VOLATILE":
        return { mode: "DEFENSIVE", buy: 0.60, sell: -0.60, multiplier: 0.85 };

      case "BREAKDOWN":
        return { mode: "SURVIVAL", buy: 0.75, sell: -0.25, multiplier: 0.75 };

      default:
        return { mode: "BALANCED", buy: 0.35, sell: -0.35, multiplier: 1.0 };
    }
  }
}


// ------------------------------------------------------
// DECISION ENGINE
// ------------------------------------------------------

class DecisionEngine {
  constructor(learning, zoneEngine) {
    this.learning = learning;
    this.zoneEngine = zoneEngine;
  }

  evaluate(signal) {
    const trend = (signal.trendStrength ?? 0) + this.learning.trendBias;

    const risk =
      (signal.riskLevel === "high" ? -0.4 :
       signal.riskLevel === "medium" ? -0.2 : 0.1)
      + this.learning.riskBias;

    const vol =
      (signal.volatility > 0.7 ? -0.3 : 0.2)
      + this.learning.volatilityBias;

    const zoneBias = this.zoneEngine.getZoneBias(signal);

    const raw = trend + risk + vol + zoneBias;

    return {
      score: Math.max(-1, Math.min(1, raw)),
      trend,
      risk,
      volatility: vol
    };
  }
}


// ------------------------------------------------------
// CALIBRATION ENGINE
// ------------------------------------------------------

class CalibrationEngine {
  constructor(learning, zoneEngine) {
    this.learning = learning;
    this.zoneEngine = zoneEngine;
  }

  calibrate(confidence, signal, reaction) {
    const zone = this.zoneEngine.classify(signal);
    const reliability = this.zoneEngine.reliability(zone);

    let adjusted =
      confidence *
      this.learning.confidenceCalibrator *
      (0.3 + reliability);

    adjusted *= reaction.multiplier;

    return Math.max(0, Math.min(1, adjusted));
  }
}


// ------------------------------------------------------
// LEARNING ENGINE
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

    this.learning.trendBias = Math.max(-0.5, Math.min(0.5, this.learning.trendBias));
    this.learning.riskBias = Math.max(-0.5, Math.min(0.5, this.learning.riskBias));
    this.learning.volatilityBias = Math.max(-0.5, Math.min(0.5, this.learning.volatilityBias));
    this.learning.confidenceCalibrator = Math.max(0.5, Math.min(1.5, this.learning.confidenceCalibrator));
  }
}


// ------------------------------------------------------
// STAGE 9 — BRAIN INSTANCE
// ------------------------------------------------------

class BrainNode {
  constructor(id, factory) {
    this.id = id;
    this.brain = factory();

    this.win = 0;
    this.loss = 0;
    this.weight = 1;
  }

  evaluate(signal) {
    const out = this.brain.evaluate(signal);

    out.meta = { ...out.meta, brainId: this.id };
    return out;
  }

  update(correct) {
    if (correct) this.win++; else this.loss++;

    const total = this.win + this.loss;
    if (total < 5) return;

    this.weight = Math.max(0.4, Math.min(1.4, this.win / total + 0.2));
  }
}


// ------------------------------------------------------
// STAGE 9 — COMPETITION ENGINE
// ------------------------------------------------------

class CompetitionEngine {
  constructor(factory) {
    this.brains = [
      new BrainNode("CONSERVATIVE", factory),
      new BrainNode("BALANCED", factory),
      new BrainNode("AGGRESSIVE", factory),
      new BrainNode("RECOVERY", factory)
    ];
  }

  evaluate(signal) {
    const results = this.brains.map(b => ({
      id: b.id,
      output: b.evaluate(signal),
      weight: b.weight
    }));

    let best = results[0];

    for (const r of results) {
      const scoreA = r.output.strength * r.weight;
      const scoreB = best.output.strength * best.weight;
      if (scoreA > scoreB) best = r;
    }

    return best.output;
  }

  learn(results = []) {
    const map = new Map();

    for (const r of results) {
      const id = r.decision?.meta?.brainId;
      const correct = r.evaluation?.actionCorrect;
      if (id) map.set(id, correct);
    }

    for (const b of this.brains) {
      if (map.has(b.id)) b.update(map.get(b.id));
    }
  }
}


// ------------------------------------------------------
// META BRAIN ORCHESTRATOR
// ------------------------------------------------------

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
    this.contextEngine = new ContextEngine(this.memoryEngine);
    this.reactionEngine = new ReactionEngine();

    this.decisionEngine = new DecisionEngine(this.learning, this.zoneEngine);
    this.calibrationEngine = new CalibrationEngine(this.learning, this.zoneEngine);
    this.learningEngine = new LearningEngine(this.learning, this.zoneEngine);

    this.competition = new CompetitionEngine(() => new MetaBrain());

    this.syncEngine = new SyncEngine();
    this.healthEngine = new HealthEngine();
  }

  evaluate(signal) {
    const context = this.contextEngine.classify(signal);
    const reaction = this.reactionEngine.getProfile(context);
    const sync = this.syncEngine.getReport();

    const raw = this.decisionEngine.evaluate(signal);

    let confidence = this.calibrationEngine.calibrate(
      Math.abs(raw.score),
      signal,
      reaction
    );

    const score = raw.score;

    const action =
      score > reaction.buy ? "BUY" :
      score < reaction.sell ? "SELL" :
      "HOLD";

    const output = {
      action,
      confidence,
      strength: score,
      meta: {
        context,
        zone: this.zoneEngine.classify(signal),
        reaction: reaction.mode,
        brainId: "MASTER",
        drift: sync.driftScore
      }
    };

    this.memoryEngine.store(signal, output);

    return output;
  }

  learn(results = []) {
    this.learningEngine.apply(results);
    this.competition.learn(results);
  }

  recordSimulationOutcome(c) { this.syncEngine.recordSimulation(c); }
  recordLiveOutcome(c) { this.syncEngine.recordLive(c); }

  getSystemHealth() {
    const sync = this.syncEngine.getReport();

    return this.healthEngine.calculate({
      driftScore: sync.driftScore,
      simulationWinRate: sync.simulationWinRate,
      liveWinRate: sync.liveWinRate,
      confidenceCalibrator: this.learning.confidenceCalibrator
    });
  }
}


// ------------------------------------------------------
// EXPORT
// ------------------------------------------------------

export const metaBrain = new MetaBrain();
