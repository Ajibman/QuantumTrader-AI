 // ======================================================
// META BRAIN — SINGLE COGNITIVE ORCHESTRATION KERNEL
// STAGE 12 — EXECUTION LAYER INTEGRATION
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
// REACTION ENGINE
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

    const volatility =
      (signal.volatility > 0.7 ? -0.3 : 0.2)
      + this.learning.volatilityBias;

    const zoneBias = this.zoneEngine.getZoneBias(signal);

    const raw = trend + risk + volatility + zoneBias;

    return {
      score: Math.max(-1, Math.min(1, raw)),
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
// STAGE 11 — SAFETY LAYER
// ------------------------------------------------------

class PolicyFirewall {
  validate(signal, decision, context) {
    const issues = [];

    if (decision.confidence > 0.95 || decision.confidence < 0.05)
      issues.push("CONFIDENCE_OUT_OF_RANGE");

    if (context === "BREAKDOWN")
      issues.push("DANGEROUS_CONTEXT");

    if ((signal.volatility ?? 0) > 0.95)
      issues.push("EXTREME_VOLATILITY");

    return {
      allowed: issues.length === 0,
      issues
    };
  }
}


// ------------------------------------------------------

class AnomalyDetector {
  constructor() {
    this.history = [];
    this.max = 50;
  }

  track(signal, output) {
    this.history.push({
      score: output.strength,
      volatility: signal.volatility ?? 0,
      confidence: output.confidence
    });

    if (this.history.length > this.max) this.history.shift();
  }

  detect() {
    if (this.history.length < 10)
      return { anomaly: false };

    const avg =
      this.history.reduce((s, h) => s + h.score, 0) /
      this.history.length;

    const last = this.history.at(-1);

    return {
      anomaly:
        Math.abs(last.score - avg) > 0.6 ||
        last.volatility > 0.9 ||
        last.confidence < 0.3
    };
  }
}


// ------------------------------------------------------

class SystemGovernor {
  constructor() {
    this.safeMode = false;
    this.freeze = 0;
  }

  evaluate(firewall, anomaly) {
    if (!firewall.allowed || anomaly.anomaly) {
      this.freeze++;
      if (this.freeze >= 3) this.safeMode = true;
    } else {
      this.freeze = Math.max(0, this.freeze - 1);
    }

    return {
      safeMode: this.safeMode,
      freeze: this.freeze
    };
  }

  shouldBlock() {
    return this.safeMode;
  }
}


// ------------------------------------------------------
// STAGE 12 — EXECUTION LAYER
// ------------------------------------------------------

class ExecutionEngine {
  constructor() {
    this.paperMode = true;
    this.slippage = 0.0005;
  }

  execute(intent) {
    if (this.paperMode) return this.paper(intent);

    return this.live(intent);
  }

  paper(intent) {
    const fill = intent.price * (1 + (Math.random() - 0.5) * this.slippage);

    return {
      status: "FILLED_PAPER",
      ...intent,
      fillPrice: fill
    };
  }

  live(intent) {
    return {
      status: "SENT_LIVE",
      ...intent
    };
  }
}


// ------------------------------------------------------

class IntentBuilder {
  build(signal, decision, meta) {
    return {
      symbol: signal.symbol || "UNKNOWN",
      side: decision.action,
      confidence: decision.confidence,
      strength: decision.strength,
      price: signal.price ?? 1,
      context: meta.context,
      zone: meta.zone,
      time: Date.now()
    };
  }
}


// ------------------------------------------------------

class ExecutionGate {
  allow(decision, safety) {
    if (safety.safeMode) return false;
    if (decision.confidence < 0.2) return false;
    if (decision.action === "HOLD") return false;
    return true;
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

    this.firewall = new PolicyFirewall();
    this.anomaly = new AnomalyDetector();
    this.governor = new SystemGovernor();

    this.executionEngine = new ExecutionEngine();
    this.intentBuilder = new IntentBuilder();
    this.executionGate = new ExecutionGate();

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

    const decision = {
      action:
        raw.score > reaction.buy ? "BUY" :
        raw.score < reaction.sell ? "SELL" :
        "HOLD",

      confidence,
      strength: raw.score,
      meta: {
        context,
        zone: this.zoneEngine.classify(signal),
        reaction: reaction.mode,
        drift: sync.driftScore
      }
    };

    const firewall = this.firewall.validate(signal, decision, context);
    const anomaly = this.anomaly.detect();
    const safety = this.governor.evaluate(firewall, anomaly);

    this.anomaly.track(signal, decision);

    if (this.governor.shouldBlock()) {
      return {
        action: "HOLD",
        confidence: 0,
        strength: 0,
        meta: { blocked: true }
      };
    }

    const intent = this.intentBuilder.build(signal, decision, decision.meta);
    const allowed = this.executionGate.allow(decision, safety);

    let execution = null;

    if (allowed) {
      execution = this.executionEngine.execute(intent);
    }

    this.memoryEngine.store(signal, decision);

    return {
      ...decision,
      execution,
      meta: {
        ...decision.meta,
        firewall: firewall.allowed,
        anomaly: anomaly.anomaly,
        safeMode: safety.safeMode,
        executed: !!execution
      }
    };
  }

  learn(results = []) {
    this.learningEngine.apply(results);
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
