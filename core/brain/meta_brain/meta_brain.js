 // ======================================================
// META BRAIN — SINGLE COGNITIVE ORCHESTRATION KERNEL
// FINAL BUILD (STAGE 7 INTEGRATED)
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

  getRecentSignals(n = 10) {
    return this.lastSignals.slice(-n);
  }
}

// ------------------------------------------------------
// CONTEXT ENGINE
// ------------------------------------------------------

class ContextEngine {
  constructor(memory) {
    this.memory = memory;
  }

  classify(signal) {
    const history = this.memory.getRecentSignals(10);

    if (history.length < 3) return "RANGING";

    const avgTrend =
      history.reduce((a, b) => a + (b.trendStrength ?? 0), 0) / history.length;

    const avgVol =
      history.reduce((a, b) => a + (b.volatility ?? 0), 0) / history.length;

    if (avgTrend > 0.7 && avgVol < 0.5) return "TRENDING";
    if (avgVol > 0.75) return "VOLATILE";
    if (avgTrend < 0.35) return "RANGING";

    return "ACCUMULATION";
  }
}

// ------------------------------------------------------
// DECISION ENGINE
// ------------------------------------------------------

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

    const volatility =
      (signal.volatility > 0.7 ? -0.3 : 0.2)
      + this.learning.volatilityBias;

    const zoneBias = this.zone.getZoneBias(signal);

    const score = trend + risk + volatility + zoneBias;

    return {
      score: Math.max(-1, Math.min(1, score)),
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
  constructor(learning, zone) {
    this.learning = learning;
    this.zone = zone;
  }

  calibrate(conf, signal) {
    const z = this.zone.classify(signal);
    const rel = this.zone.reliability(z);

    let adj = conf * this.learning.confidenceCalibrator;
    adj *= (0.3 + rel);

    return Math.max(0, Math.min(1, adj));
  }
}

// ------------------------------------------------------
// LEARNING ENGINE
// ------------------------------------------------------

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

      this.zone.record(zone, correct);

      const d = correct ? 0.005 : -0.005;

      this.learning.trendBias += d;
      this.learning.riskBias += d;
      this.learning.volatilityBias += d;

      this.learning.confidenceCalibrator += correct ? 0.001 : -0.001;
    }

    this.learning.trendBias = Math.max(-0.5, Math.min(0.5, this.learning.trendBias));
    this.learning.riskBias = Math.max(-0.5, Math.min(0.5, this.learning.riskBias));
    this.learning.volatilityBias = Math.max(-0.5, Math.min(0.5, this.learning.volatilityBias));

    this.learning.confidenceCalibrator =
      Math.max(0.5, Math.min(1.5, this.learning.confidenceCalibrator));
  }
}

// ------------------------------------------------------
// POLICY OPTIMIZER (STAGE 6)
// ------------------------------------------------------

class PolicyOptimizer {
  constructor() {
    this.state = {
      TRENDING: this._init(),
      VOLATILE: this._init(),
      RANGING: this._init(),
      ACCUMULATION: this._init()
    };
  }

  _init() {
    return {
      buy: 0.35,
      sell: -0.35,
      confidence: 1.0,
      ema: 0,
      count: 0
    };
  }

  update(context, score, correct) {
    const p = this.state[context];
    if (!p) return;

    if (p.count < 10) {
      p.count++;
      return;
    }

    const reward = correct ? 1 : -1;
    const alpha = 0.05;

    p.ema = alpha * score + (1 - alpha) * p.ema;

    if (Math.abs(p.ema) < 0.15) return;

    const step = 0.002;

    if (p.ema > 0.2 && reward > 0) p.buy = Math.min(0.6, p.buy + step);
    if (p.ema < -0.2 && reward < 0) p.buy = Math.max(0.25, p.buy - step);

    if (p.ema < -0.2 && reward > 0) p.sell = Math.max(-0.6, p.sell - step);
    if (p.ema > 0.2 && reward < 0) p.sell = Math.min(-0.25, p.sell + step);

    p.confidence = Math.max(0.8, Math.min(1.2, p.confidence + reward * 0.001));
  }

  get(context) {
    return this.state[context] || this.state.RANGING;
  }
}

// ------------------------------------------------------
// POLICY SUPERVISOR (STAGE 7)
// ------------------------------------------------------

class PolicySupervisor {
  constructor(policy) {
    this.policy = policy;
    this.snapshot = null;
    this.state = { anomaly: 0, instability: 0 };
  }

  snapshotState() {
    this.snapshot = JSON.parse(JSON.stringify(this.policy.state));
  }

  evaluate(metrics) {
    let a = 0;

    if (metrics.driftScore > 0.75) a += 0.4;
    if (metrics.winRate < 0.4) a += 0.3;
    if (metrics.confidence > 1.15) a += 0.2;

    this.state.anomaly = a;

    if (a > 0.6) this.state.instability++;
    else this.state.instability = Math.max(0, this.state.instability - 1);

    if (this.state.instability >= 3) {
      this.rollback();
      return { status: "ROLLBACK" };
    }

    return { status: "STABLE" };
  }

  rollback() {
    if (!this.snapshot) return;
    this.policy.state = JSON.parse(JSON.stringify(this.snapshot));
    this.state.instability = 0;
  }

  stabilize() {
    for (const k in this.policy.state) {
      const p = this.policy.state[k];
      p.buy = Math.max(0.25, Math.min(0.6, p.buy));
      p.sell = Math.max(-0.6, Math.min(-0.25, p.sell));
      p.confidence = Math.max(0.85, Math.min(1.15, p.confidence));
      p.ema *= 0.98;
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

    this.zone = new ZoneEngine();
    this.memory = new MemoryEngine();
    this.context = new ContextEngine(this.memory);

    this.decision = new DecisionEngine(this.learning, this.zone);
    this.calibration = new CalibrationEngine(this.learning, this.zone);
    this.learningEngine = new LearningEngine(this.learning, this.zone);

    this.policy = new PolicyOptimizer();
    this.supervisor = new PolicySupervisor(this.policy);

    this.sync = new SyncEngine();
    this.health = new HealthEngine();
  }

  evaluate(signal) {
    const ctx = this.context.classify(signal);
    const zone = this.zone.classify(signal);

    const raw = this.decision.evaluate(signal);

    const confidence = this.calibration.calibrate(Math.abs(raw.score), signal);

    const action =
      raw.score > 0.35 ? "BUY" :
      raw.score < -0.35 ? "SELL" : "HOLD";

    const output = {
      action,
      confidence,
      strength: raw.score,
      meta: { ctx, zone }
    };

    this.memory.store(signal, output);

    return output;
  }

  learn(results) {
    for (const r of results) {
      const ctx = r.decision?.meta?.ctx;
      const correct = r.evaluation?.actionCorrect;
      const score = r.decision?.strength ?? 0;

      this.policy.update(ctx, score, correct);
    }

    this.learningEngine.apply(results);

    this.supervisor.evaluate({
      winRate: this.sync.getReport().simulationWinRate,
      driftScore: this.sync.getReport().driftScore,
      confidence: this.learning.confidenceCalibrator
    });
  }

  recordSimulationOutcome(c) {
    this.sync.recordSimulation(c);
  }

  recordLiveOutcome(c) {
    this.sync.recordLive(c);
  }

  getHealth() {
    return {
      learning: this.learning,
      sync: this.sync.getReport(),
      policy: this.policy.state,
      supervisor: this.supervisor.state
    };
  }
}

// ------------------------------------------------------
// EXPORT
// ------------------------------------------------------

export const metaBrain = new MetaBrain();
