 // ======================================================
// META BRAIN OS — PRODUCTION KERNEL
// STAGES 1–17 FULLY UNIFIED (CLEAN ARCHITECTURE)
// ======================================================

import { SyncEngine } from "./engines/sync_engine.js";
import { HealthEngine } from "./engines/health_engine.js";


// ======================================================
// STAGE 1–2: ZONE ENGINE
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

  bias(signal) {
    const z = this.classify(signal);
    return z === "profit" ? 0.1 : z === "danger" ? -0.1 : 0;
  }
}


// ======================================================
// STAGE 3: MEMORY ENGINE
// ======================================================

class MemoryEngine {
  constructor() {
    this.history = [];
  }

  store(signal, decision) {
    this.history.push({ signal, decision });
    if (this.history.length > 100) this.history.shift();
  }

  recent(n = 10) {
    return this.history.slice(-n).map(h => h.signal);
  }
}


// ======================================================
// STAGE 4: CONTEXT ENGINE
// ======================================================

class ContextEngine {
  constructor(memory) {
    this.memory = memory;
  }

  classify(signal) {
    const hist = this.memory.recent(10);

    if (hist.length < 3) return "RANGING";

    const avgT =
      hist.reduce((s, x) => s + (x.trendStrength ?? 0), 0) / hist.length;

    const avgV =
      hist.reduce((s, x) => s + (x.volatility ?? 0), 0) / hist.length;

    if (avgT > 0.7 && avgV < 0.5) return "TRENDING";
    if (avgV > 0.75) return "VOLATILE";
    if (signal.trendStrength > avgT && signal.volatility < avgV) return "RECOVERY";
    if (signal.trendStrength < avgT && signal.volatility > avgV) return "BREAKDOWN";

    return "RANGING";
  }
}


// ======================================================
// STAGE 5: REACTION ENGINE
// ======================================================

class ReactionEngine {
  getProfile(context) {
    const map = {
      TRENDING: { buy: 0.25, sell: -0.25, mult: 1.15, mode: "AGGRESSIVE" },
      RECOVERY: { buy: 0.30, sell: -0.30, mult: 1.05, mode: "OPTIMISTIC" },
      VOLATILE: { buy: 0.60, sell: -0.60, mult: 0.85, mode: "DEFENSIVE" },
      BREAKDOWN: { buy: 0.75, sell: -0.25, mult: 0.75, mode: "SURVIVAL" },
      RANGING: { buy: 0.35, sell: -0.35, mult: 1.0, mode: "BALANCED" }
    };

    return map[context] ?? map.RANGING;
  }
}


// ======================================================
// STAGE 6: CORE DECISION ENGINE
// ======================================================

class DecisionEngine {
  constructor(learning, zone) {
    this.learning = learning;
    this.zone = zone;
  }

  evaluate(signal) {
    const t = (signal.trendStrength ?? 0) + this.learning.trendBias;
    const r = (signal.riskLevel === "high" ? -0.4 : 0.1) + this.learning.riskBias;
    const v = (signal.volatility > 0.7 ? -0.3 : 0.2) + this.learning.volatilityBias;
    const z = this.zone.bias(signal);

    const score = t + r + v + z;

    return { score: Math.max(-1, Math.min(1, score)) };
  }
}


// ======================================================
// STAGE 7: CALIBRATION ENGINE
// ======================================================

class CalibrationEngine {
  constructor(learning, zone) {
    this.learning = learning;
    this.zone = zone;
  }

  calibrate(confidence, signal, reaction) {
    const z = this.zone.classify(signal);

    let adjusted =
      confidence *
      this.learning.confidenceCalibrator *
      (0.3 + (z === "profit" ? 0.8 : z === "danger" ? 0.2 : 0.5));

    adjusted *= reaction.mult;

    return Math.max(0, Math.min(1, adjusted));
  }
}


// ======================================================
// STAGE 8: LEARNING ENGINE
// ======================================================

class LearningEngine {
  constructor(learning, zone) {
    this.learning = learning;
    this.zone = zone;
  }

  apply(results = []) {
    for (const r of results) {
      const correct = r.evaluation?.actionCorrect;
      const zone = r.decision?.meta?.zone;

      const d = correct ? 0.005 : -0.005;

      this.learning.trendBias += d;
      this.learning.riskBias += d;
      this.learning.volatilityBias += d;

      this.learning.confidenceCalibrator += correct ? 0.001 : -0.001;
    }
  }
}


// ======================================================
// STAGE 9–12: SAFETY + EXECUTION CORE
// ======================================================

class PolicyFirewall {
  validate(signal, decision) {
    const issues = [];

    if (decision.confidence < 0.05 || decision.confidence > 0.95)
      issues.push("CONFIDENCE_OUT_OF_RANGE");

    if ((signal.volatility ?? 0) > 0.95)
      issues.push("EXTREME_VOLATILITY");

    return { allowed: issues.length === 0, issues };
  }
}

class AnomalyDetector {
  constructor() {
    this.buffer = [];
  }

  track(signal, decision) {
    this.buffer.push({
      score: decision.strength,
      vol: signal.volatility ?? 0
    });

    if (this.buffer.length > 50) this.buffer.shift();
  }

  detect() {
    if (this.buffer.length < 10) return { anomaly: false };

    const avg = this.buffer.reduce((s, b) => s + b.score, 0) / this.buffer.length;
    const last = this.buffer.at(-1);

    return {
      anomaly: Math.abs(last.score - avg) > 0.6 || last.vol > 0.9
    };
  }
}

class SystemGovernor {
  constructor() {
    this.safe = false;
    this.freeze = 0;
  }

  evaluate(firewall, anomaly) {
    if (!firewall.allowed || anomaly.anomaly) this.freeze++;
    else this.freeze = Math.max(0, this.freeze - 1);

    if (this.freeze >= 3) this.safe = true;

    return { safeMode: this.safe };
  }

  shouldBlock() {
    return this.safe;
  }
}

class ExecutionEngine {
  execute(intent) {
    return { status: "PAPER", ...intent };
  }
}

class IntentBuilder {
  build(signal, decision, meta) {
    return {
      symbol: signal.symbol ?? "UNKNOWN",
      side: decision.action,
      confidence: decision.confidence,
      strength: decision.strength,
      price: signal.price ?? 1,
      meta,
      time: Date.now()
    };
  }
}

class ExecutionGate {
  allow(decision, safety) {
    return !safety.safeMode && decision.confidence > 0.2 && decision.action !== "HOLD";
  }
}


// ======================================================
// STAGE 13: META BRAIN ORCHESTRATOR
// ======================================================

class MetaBrain {
  constructor() {
    this.learning = {
      trendBias: 0,
      riskBias: 0,
      volatilityBias: 0,
      confidenceCalibrator: 1
    };

    this.zone = new ZoneEngine();
    this.memory = new MemoryEngine();
    this.context = new ContextEngine(this.memory);
    this.reaction = new ReactionEngine();

    this.decision = new DecisionEngine(this.learning, this.zone);
    this.calibration = new CalibrationEngine(this.learning, this.zone);
    this.learningEngine = new LearningEngine(this.learning, this.zone);

    this.firewall = new PolicyFirewall();
    this.anomaly = new AnomalyDetector();
    this.governor = new SystemGovernor();

    this.execution = new ExecutionEngine();
    this.intent = new IntentBuilder();
    this.gate = new ExecutionGate();

    this.sync = new SyncEngine();
    this.health = new HealthEngine();
  }

  evaluate(signal) {
    const context = this.context.classify(signal);
    const reaction = this.reaction.getProfile(context);

    const raw = this.decision.evaluate(signal);

    const confidence = this.calibration.calibrate(
      Math.abs(raw.score),
      signal,
      reaction
    );

    const decision = {
      action:
        raw.score > reaction.buy ? "BUY" :
        raw.score < reaction.sell ? "SELL" :
        "HOLD",

      confidence,
      strength: raw.score,
      meta: {
        context,
        zone: this.zone.classify(signal),
        reaction: reaction.mode
      }
    };

    const firewall = this.firewall.validate(signal, decision);
    const anomaly = this.anomaly.detect();
    const safety = this.governor.evaluate(firewall, anomaly);

    this.anomaly.track(signal, decision);

    let execution = null;

    if (!this.governor.shouldBlock() && this.gate.allow(decision, safety)) {
      const intent = this.intent.build(signal, decision, decision.meta);
      execution = this.execution.execute(intent);
    }

    this.memory.store(signal, decision);

    return { ...decision, execution, meta: { ...decision.meta, safeMode: safety.safeMode } };
  }

  learn(results) {
    this.learningEngine.apply(results);
  }
}


// ======================================================
// STAGE 14: SWARM CONSENSUS
// ======================================================

class SwarmNode {
  constructor(factory) {
    this.brain = factory();
    this.bias = (Math.random() - 0.5) * 0.05;
  }

  evaluate(signal) {
    const mutated = {
      ...signal,
      trendStrength: (signal.trendStrength ?? 0) + this.bias
    };

    return this.brain.evaluate(mutated);
  }
}

class SwarmLayer {
  constructor(factory, size = 5) {
    this.nodes = Array.from({ length: size }, () => new SwarmNode(factory));
  }

  evaluate(signal) {
    const results = this.nodes.map(n => n.evaluate(signal));

    const avg =
      results.reduce((s, r) => s + r.score, 0) / results.length;

    const dispersion =
      results.reduce((s, r) => s + Math.abs(r.score - avg), 0) / results.length;

    return { swarmScore: avg, dispersion };
  }
}


// ======================================================
// STAGE 15: EVOLUTION CONTROLLER
// ======================================================

class EvolutionController {
  adapt(learning, swarm) {
    if (swarm.dispersion > 0.6) learning.confidenceCalibrator *= 0.99;
    if (swarm.dispersion < 0.3) learning.confidenceCalibrator *= 1.01;
  }
}


// ======================================================
// STAGE 16–17: CAPITAL CONTROL SYSTEM
// ======================================================

class CapitalControlSystem {
  constructor() {
    this.state = {
      dailyLoss: 0,
      dailyTrades: 0,
      exposure: 0,
      maxDailyLoss: 0.05,
      maxTrades: 50,
      maxExposure: 0.3
    };
  }

  evaluateRisk(signal, decision) {
    const issues = [];

    if (decision.confidence < 0.25) issues.push("LOW_CONFIDENCE");
    if ((signal.volatility ?? 0) > 0.95) issues.push("EXTREME_VOLATILITY");

    return {
      allowed: issues.length === 0,
      riskLevel: "AUTO",
      issues
    };
  }

  computeExecution(signal, decision, risk) {
    let size = decision.confidence * (1 - (signal.volatility ?? 0));
    size = Math.max(0, Math.min(1, size));

    return {
      size,
      mode: risk.riskLevel === "HIGH" ? "PAPER_ONLY" : "LIVE",
      adjustedConfidence: decision.confidence
    };
  }
}


// ======================================================
// EXPORT
// ======================================================

export const metaBrain = new MetaBrain();
export const swarmLayer = new SwarmLayer(() => new MetaBrain());
export const capitalControl = new CapitalControlSystem();
