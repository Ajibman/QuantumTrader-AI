 // ======================================================
// META BRAIN — SINGLE COGNITIVE ORCHESTRATION KERNEL
// STAGE 3 (OPPORTUNITY ENGINE INTEGRATED)
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

    if (history.length < 3) return this._basic(trend, volatility);

    const avgTrend =
      history.reduce((s, x) => s + (x.trendStrength ?? 0), 0) /
      history.length;

    const avgVol =
      history.reduce((s, x) => s + (x.volatility ?? 0), 0) /
      history.length;

    if (avgTrend > 0.7 && avgVol < 0.5) return "TRENDING";
    if (avgVol > 0.75) return "VOLATILE";
    if (avgTrend < 0.35) return "RANGING";

    if (trend > avgTrend && volatility < avgVol) return "RECOVERY";
    if (trend < avgTrend && volatility > avgVol) return "BREAKDOWN";

    if (avgTrend >= 0.35 && avgTrend <= 0.55 && avgVol < 0.4)
      return "ACCUMULATION";

    if (avgTrend >= 0.35 && avgTrend <= 0.55 && avgVol >= 0.4)
      return "DISTRIBUTION";

    return "RANGING";
  }

  _basic(trend, vol) {
    if (trend > 0.7 && vol < 0.5) return "TRENDING";
    if (vol > 0.75) return "VOLATILE";
    if (trend < 0.35) return "RANGING";
    return "ACCUMULATION";
  }
}

// ------------------------------------------------------
// REACTION ENGINE
// ------------------------------------------------------

class ReactionEngine {
  getProfile(context) {
    switch (context) {
      case "TRENDING":
        return { mode: "AGGRESSIVE", buy: 0.25, sell: -0.25, mult: 1.15 };

      case "RECOVERY":
        return { mode: "OPTIMISTIC", buy: 0.30, sell: -0.30, mult: 1.05 };

      case "ACCUMULATION":
        return { mode: "PREPARING", buy: 0.35, sell: -0.35, mult: 1.0 };

      case "DISTRIBUTION":
        return { mode: "CAUTIOUS", buy: 0.45, sell: -0.45, mult: 0.95 };

      case "VOLATILE":
        return { mode: "DEFENSIVE", buy: 0.60, sell: -0.60, mult: 0.85 };

      case "BREAKDOWN":
        return { mode: "SURVIVAL", buy: 0.75, sell: -0.25, mult: 0.75 };

      default:
        return { mode: "BALANCED", buy: 0.35, sell: -0.35, mult: 1.0 };
    }
  }
}

// ------------------------------------------------------
// OPPORTUNITY ENGINE (STAGE 3)
// ------------------------------------------------------

class OpportunityEngine {
  score(signal, context, reaction) {
    const trend = signal.trendStrength ?? 0;
    const volatility = signal.volatility ?? 0;
    const risk = signal.riskLevel;

    let score = trend * 0.5;

    if (context === "TRENDING") score *= 1.4;
    if (context === "VOLATILE") score *= 0.6;
    if (context === "BREAKDOWN") score *= 0.4;

    score *= reaction.mult;

    if (risk === "high") score -= 0.3;
    if (volatility > 0.8) score -= 0.25;

    return Math.max(0, Math.min(1, score));
  }

  isValid(score) {
    return score > 0.45;
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
    const trend =
      (signal.trendStrength ?? 0) + this.learning.trendBias;

    const risk =
      (signal.riskLevel === "high"
        ? -0.4
        : signal.riskLevel === "medium"
        ? -0.2
        : 0.1) + this.learning.riskBias;

    const volatility =
      (signal.volatility > 0.7 ? -0.3 : 0.2) +
      this.learning.volatilityBias;

    const zoneBias = this.zoneEngine.getZoneBias(signal);

    const rawScore = trend + risk + volatility + zoneBias;

    return {
      score: Math.max(-1, Math.min(1, rawScore)),
      trend,
      risk,
      volatility
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

  calibrate(confidence, signal) {
    const zone = this.zoneEngine.classify(signal);
    const rel = this.zoneEngine.reliability(zone);

    let adjusted =
      confidence *
      this.learning.confidenceCalibrator;

    adjusted *= 0.3 + rel;

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

    this.learning.trendBias =
      Math.max(-0.5, Math.min(0.5, this.learning.trendBias));

    this.learning.riskBias =
      Math.max(-0.5, Math.min(0.5, this.learning.riskBias));

    this.learning.volatilityBias =
      Math.max(-0.5, Math.min(0.5, this.learning.volatilityBias));

    this.learning.confidenceCalibrator =
      Math.max(0.5, Math.min(1.5, this.learning.confidenceCalibrator));
  }
}

// ------------------------------------------------------
// META BRAIN ORCHESTRATOR
// ------------------------------------------------------

export class MetaBrain {
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
    this.opportunityEngine = new OpportunityEngine();
    this.decisionEngine = new DecisionEngine(this.learning, this.zoneEngine);
    this.calibrationEngine = new CalibrationEngine(this.learning, this.zoneEngine);
    this.learningEngine = new LearningEngine(this.learning, this.zoneEngine);

    this.syncEngine = new SyncEngine();
    this.healthEngine = new HealthEngine();
  }

  evaluate(signal) {
    const context = this.contextEngine.classify(signal);
    const reaction = this.reactionEngine.getProfile(context);

    const opportunityScore =
      this.opportunityEngine.score(signal, context, reaction);

    if (!this.opportunityEngine.isValid(opportunityScore)) {
      const output = {
        action: "HOLD",
        confidence: 0,
        strength: 0,
        reasoning: "Low opportunity signal filtered",
        meta: { context, reactionMode: reaction.mode, opportunityScore }
      };

      this.memoryEngine.store(signal, output);
      return output;
    }

    const zone = this.zoneEngine.classify(signal);
    const raw = this.decisionEngine.evaluate(signal);

    let confidence = this.calibrationEngine.calibrate(
      Math.abs(raw.score),
      signal
    );

    confidence *= reaction.mult;
    confidence = Math.max(0, Math.min(1, confidence));

    const action = this._decide(raw.score, reaction);

    const output = {
      action,
      confidence,
      strength: raw.score,
      reasoning: this._reason(raw.score),
      meta: {
        context,
        reactionMode: reaction.mode,
        zone,
        opportunityScore
      }
    };

    this.memoryEngine.store(signal, output);
    return output;
  }

  _decide(score, reaction) {
    if (score > reaction.buy) return "BUY";
    if (score < reaction.sell) return "SELL";
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

  getSystemHealth() {
    const sync = this.syncEngine.getReport();
    return this.healthEngine.calculate(sync);
  }
     }
