// ======================================================
// META BRAIN — FINAL CONSOLIDATED PRODUCTION KERNEL
// (Stage 13.1 + 14 + 15 Unified System)
// ======================================================

import { SyncEngine } from "./engines/sync_engine.js";
import { HealthEngine } from "./engines/health_engine.js";

// ======================================================
// CORE ENGINE (Stage 13.1)
// ======================================================

class CoreEngine {
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

    const score = trend + risk + volatility + zoneBias;

    return {
      score: Math.max(-1, Math.min(1, score)),
      trend,
      risk,
      volatility
    };
  }
}

// ======================================================
// ZONE ENGINE
// ======================================================

class ZoneEngine {
  classify(signal) {
    const t = signal.trendStrength ?? 0;
    const v = signal.volatility ?? 0;
    const r = signal.riskLevel;

    if (t > 0.6 && v < 0.5 && r !== "high") return "profit";
    if (v > 0.8 || r === "high") return "danger";
    return "neutral";
  }

  getZoneBias(signal) {
    const z = this.classify(signal);
    if (z === "profit") return 0.1;
    if (z === "danger") return -0.1;
    return 0;
  }
}

// ======================================================
// MEMORY ENGINE
// ======================================================

class MemoryEngine {
  constructor() {
    this.history = [];
  }

  store(signal, output) {
    this.history.push({ signal, output });
    if (this.history.length > 50) this.history.shift();
  }

  recent(n = 10) {
    return this.history.slice(-n).map(h => h.signal);
  }
}

// ======================================================
// CONTEXT ENGINE
// ======================================================

class ContextEngine {
  constructor(memory) {
    this.memory = memory;
  }

  classify(signal) {
    const hist = this.memory.recent(10);

    if (hist.length < 3) return "RANGING";

    const avgT =
      hist.reduce((s, x) => s + (x.trendStrength ?? 0), 0) /
      hist.length;

    const avgV =
      hist.reduce((s, x) => s + (x.volatility ?? 0), 0) /
      hist.length;

    if (avgT > 0.7 && avgV < 0.5) return "TRENDING";
    if (avgV > 0.75) return "VOLATILE";
    if (avgT < 0.35) return "RANGING";

    if (signal.trendStrength > avgT) return "RECOVERY";
    if (signal.trendStrength < avgT) return "BREAKDOWN";

    return "RANGING";
  }
}

// ======================================================
// REACTION ENGINE (Stage 15 behavior layer)
// ======================================================

class ReactionEngine {
  getProfile(context) {
    switch (context) {
      case "TRENDING":
        return { buy: 0.25, sell: -0.25, mult: 1.15 };

      case "RECOVERY":
        return { buy: 0.30, sell: -0.30, mult: 1.05 };

      case "VOLATILE":
        return { buy: 0.60, sell: -0.60, mult: 0.85 };

      case "BREAKDOWN":
        return { buy: 0.75, sell: -0.25, mult: 0.75 };

      default:
        return { buy: 0.35, sell: -0.35, mult: 1.0 };
    }
  }
}

// ======================================================
// DECISION ENGINE
// ======================================================

class DecisionEngine {
  constructor(learning, zoneEngine) {
    this.learning = learning;
    this.zoneEngine = zoneEngine;
  }

  evaluate(signal) {
    const core = this.learning;

    const trend = (signal.trendStrength ?? 0) + core.trendBias;
    const risk =
      (signal.riskLevel === "high"
        ? -0.4
        : signal.riskLevel === "medium"
        ? -0.2
        : 0.1) + core.riskBias;

    const volatility =
      (signal.volatility > 0.7 ? -0.3 : 0.2) + core.volatilityBias;

    const zoneBias = this.zoneEngine.getZoneBias(signal);

    const score = trend + risk + volatility + zoneBias;

    return {
      score: Math.max(-1, Math.min(1, score))
    };
  }
}

// ======================================================
// CALIBRATION ENGINE
// ======================================================

class CalibrationEngine {
  constructor(learning) {
    this.learning = learning;
  }

  calibrate(confidence, reaction) {
    let adjusted =
      confidence * this.learning.confidenceCalibrator;

    adjusted *= reaction.mult;

    return Math.max(0, Math.min(1, adjusted));
  }
}

// ======================================================
// SWARM ENGINE (Stage 14)
// ======================================================

class SwarmEngine {
  constructor(coreEvaluate) {
    this.coreEvaluate = coreEvaluate;
    this.nodes = 5;
  }

  evaluate(signal) {
    const results = [];

    for (let i = 0; i < this.nodes; i++) {
      const mutated = {
        ...signal,
        trendStrength:
          (signal.trendStrength ?? 0) +
          (Math.random() - 0.5) * 0.05
      };

      results.push(this.coreEvaluate(mutated));
    }

    const avg =
      results.reduce((s, r) => s + r.score, 0) / results.length;

    return {
      swarmScore: avg,
      dispersion: this._dispersion(results)
    };
  }

  _dispersion(results) {
    const mean =
      results.reduce((s, r) => s + r.score, 0) / results.length;

    return (
      results.reduce(
        (s, r) => s + Math.abs(r.score - mean),
        0
      ) / results.length
    );
  }
}

// ======================================================
// EVOLUTION ENGINE (Stage 15)
// ======================================================

class EvolutionEngine {
  adjust(learning, swarmResult) {
    if (swarmResult.dispersion > 0.6) {
      learning.confidenceCalibrator *= 0.99;
    }

    if (swarmResult.dispersion < 0.3) {
      learning.confidenceCalibrator *= 1.01;
    }
  }
}

// ======================================================
// META BRAIN (FINAL ORCHESTRATOR)
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
    this.contextEngine = new ContextEngine(this.memoryEngine);

    this.coreEngine = new CoreEngine(this.learning, this.zoneEngine);

    this.swarmEngine = new SwarmEngine(
      this.coreEngine.evaluate.bind(this.coreEngine)
    );

    this.reactionEngine = new ReactionEngine();
    this.decisionEngine = new DecisionEngine(this.learning, this.zoneEngine);
    this.calibrationEngine = new CalibrationEngine(this.learning);
    this.evolutionEngine = new EvolutionEngine();

    this.syncEngine = new SyncEngine();
    this.healthEngine = new HealthEngine();
  }

  evaluate(signal) {
    const context = this.contextEngine.classify(signal);
    const reaction = this.reactionEngine.getProfile(context);

    const core = this.coreEngine.evaluate(signal);
    const swarm = this.swarmEngine.evaluate(signal);

    const confidence = this.calibrationEngine.calibrate(
      Math.abs(core.score),
      reaction
    );

    const action =
      core.score > reaction.buy
        ? "BUY"
        : core.score < reaction.sell
        ? "SELL"
        : "HOLD";

    this.evolutionEngine.adjust(this.learning, swarm);

    const output = {
      action,
      confidence,
      strength: core.score,
      meta: {
        context,
        swarmScore: swarm.swarmScore,
        dispersion: swarm.dispersion
      }
    };

    this.memoryEngine.store(signal, output);

    return output;
  }

  learn(results = []) {
    for (const r of results) {
      const delta = r.correct ? 0.005 : -0.005;
      this.learning.trendBias += delta;
      this.learning.riskBias += delta;
      this.learning.volatilityBias += delta;
    }
  }

  getSystemHealth() {
    return this.healthEngine.calculate(this.learning);
  }
}

// ======================================================
// EXPORT
// ======================================================

export const metaBrain = new MetaBrain();
    
