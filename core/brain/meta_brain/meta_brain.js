 // ======================================================
// META BRAIN — APP GRADE PRODUCTION KERNEL
// STAGES 1–18B UNIFIED SYSTEM
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

  getBias(signal) {
    const z = this.classify(signal);
    return z === "profit" ? 0.1 : z === "danger" ? -0.1 : 0;
  }
}


// ======================================================
// STAGE 3: MEMORY ENGINE
// ======================================================

class MemoryEngine {
  constructor() {
    this.signals = [];
    this.decisions = [];
  }

  store(signal, decision) {
    this.signals.push(signal);
    this.decisions.push(decision);

    if (this.signals.length > 100) {
      this.signals.shift();
      this.decisions.shift();
    }
  }

  recent(n = 10) {
    return this.signals.slice(-n);
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
    const hist = this.memory.recent(12);

    if (hist.length < 3) return "RANGING";

    const avgT =
      hist.reduce((s, x) => s + (x.trendStrength ?? 0), 0) / hist.length;

    const avgV =
      hist.reduce((s, x) => s + (x.volatility ?? 0), 0) / hist.length;

    const t = signal.trendStrength ?? 0;
    const v = signal.volatility ?? 0;

    if (avgT > 0.7 && avgV < 0.5) return "TRENDING";
    if (avgV > 0.75) return "VOLATILE";
    if (t > avgT && v < avgV) return "RECOVERY";
    if (t < avgT && v > avgV) return "BREAKDOWN";

    return "RANGING";
  }
}


// ======================================================
// STAGE 5: REACTION ENGINE
// ======================================================

class ReactionEngine {
  getProfile(context) {
    switch (context) {
      case "TRENDING":
        return { buy: 0.25, sell: -0.25, mult: 1.15 };
      case "RECOVERY":
        return { buy: 0.3, sell: -0.3, mult: 1.05 };
      case "VOLATILE":
        return { buy: 0.6, sell: -0.6, mult: 0.85 };
      case "BREAKDOWN":
        return { buy: 0.75, sell: -0.25, mult: 0.75 };
      default:
        return { buy: 0.35, sell: -0.35, mult: 1 };
    }
  }
}


// ======================================================
// STAGE 6: DECISION ENGINE
// ======================================================

class DecisionEngine {
  constructor(learning, zone) {
    this.learning = learning;
    this.zone = zone;
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

    const zoneBias = this.zone.getBias(signal);

    const score = trend + risk + vol + zoneBias;

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

  calibrate(conf, signal, reaction) {
    const z = this.zone.classify(signal);
    const rel = this.zone.reliability?.(z) ?? 0.5;

    let adj = conf * this.learning.confidenceCalibrator * (0.3 + rel);
    adj *= reaction.mult;

    return Math.max(0, Math.min(1, adj));
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
      if (!zone) continue;

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
  validate(signal, decision, context) {
    const issues = [];

    if (decision.confidence > 0.95 || decision.confidence < 0.05)
      issues.push("CONFIDENCE_OUT_OF_RANGE");

    if (context === "BREAKDOWN")
      issues.push("DANGEROUS_CONTEXT");

    if ((signal.volatility ?? 0) > 0.95)
      issues.push("EXTREME_VOLATILITY");

    return { allowed: issues.length === 0, issues };
  }
}

class AnomalyDetector {
  constructor() { this.h = []; }

  track(signal, output) {
    this.h.push({
      score: output.strength,
      vol: signal.volatility ?? 0,
      conf: output.confidence
    });

    if (this.h.length > 60) this.h.shift();
  }

  detect() {
    if (this.h.length < 10) return { anomaly: false };

    const avg = this.h.reduce((s, x) => s + x.score, 0) / this.h.length;
    const last = this.h.at(-1);

    return {
      anomaly:
        Math.abs(last.score - avg) > 0.6 ||
        last.vol > 0.9 ||
        last.conf < 0.3
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
    return !safety.safeMode &&
           decision.confidence > 0.2 &&
           decision.action !== "HOLD";
  }
}


// ======================================================
// STAGE 13: ORCHESTRATOR
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

    // STAGE 14–15–16–17–18 modules
    this.swarm = null; // optional plug
    this.capitalControl = null;
  }

  evaluate(signal) {
    const context = this.context.classify(signal);
    const reaction = this.reaction.getProfile(context);

    const raw = this.decision.evaluate(signal);

    let confidence = this.calibration.calibrate(
      Math.abs(raw.score),
      signal,
      reaction
    );

    const decision = {
      action:
        raw.score > reaction.buy ? "BUY" :
        raw.score < reaction.sell ? "SELL" : "HOLD",

      confidence,
      strength: raw.score,
      meta: { context }
    };

    const firewall = this.firewall.validate(signal, decision, context);
    const anomaly = this.anomaly.detect();
    const safety = this.governor.evaluate(firewall, anomaly);

    this.anomaly.track(signal, decision);

    let execution = null;

    if (!this.governor.shouldBlock()) {
      const intent = this.intent.build(signal, decision, decision.meta);
      if (this.gate.allow(decision, safety)) {
        execution = this.execution.execute(intent);
      }
    }

    this.memory.store(signal, decision);

    return {
      ...decision,
      execution,
      meta: { ...decision.meta, safeMode: safety.safeMode }
    };
  }

  learn(results = []) {
    this.learningEngine.apply(results);
  }
}


// ======================================================
// EXPORT
// ======================================================

export const metaBrain = new MetaBrain();
