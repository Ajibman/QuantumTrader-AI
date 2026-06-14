 // Meta-Brain Evolution Layer — System Intelligence Over Time

import { listSessions } from "./traderlab_orchestrator.js";
import { getStrategyMemory } from "./strategy_memory.js";
import { getMemorySnapshot } from "../cpilot/cpilot_memory.js";

/* =========================================================
   META STATE
========================================================= */

const metaState = {
  evolutionHistory: [],
  lastEvaluation: null
};

/**
 * META-BRAIN INFLUENCE PROFILE
 *
 * Only affects system behavior:
 * - risk posture
 * - exploration rate
 * - CPilot sensitivity
 */
const influenceState = {
  riskBias: 1.0,
  explorationRate: 0.10,
  cpilotSensitivity: 1.0,
  lastAdjustment: null
};

/* =========================================================
   🔥 NEW: STRATEGY REINFORCEMENT MEMORY
========================================================= */

const reinforcementMemory = {
  strategyWins: {},
  strategyLosses: {}
};

/**
 * FEED STRATEGY OUTCOME INTO META-BRAIN
 * (called from CPilot / Strategy layer)
 */
export function recordMetaStrategyOutcome({
  strategyName,
  pnl
}) {
  if (!strategyName || typeof pnl !== "number") return;

  if (pnl > 0) {
    reinforcementMemory.strategyWins[strategyName] =
      (reinforcementMemory.strategyWins[strategyName] || 0) + 1;
  } else {
    reinforcementMemory.strategyLosses[strategyName] =
      (reinforcementMemory.strategyLosses[strategyName] || 0) + 1;
  }
}

/* =========================================================
   SYSTEM ANALYSIS
========================================================= */

export function evaluateSystemEvolution() {

  const sessions = listSessions();
  const strategyMemory = getStrategyMemory();
  const cpilotMemory = getMemorySnapshot();

  const analysis = {
    totalSessions: sessions.length,
    runningSessions: sessions.filter(
      s => s.status === "running"
    ).length,

    cpilot: {
      totalCycles: cpilotMemory.totalCycles,
      contextStats: cpilotMemory.contextStats,
      biasWeights: cpilotMemory.biasWeights
    },

    strategy: {
      totalRecords: strategyMemory.totalRecords,
      strategyStats: strategyMemory.strategyStats
    },

    // 🔥 NEW: reinforcement snapshot
    reinforcement: {
      wins: reinforcementMemory.strategyWins,
      losses: reinforcementMemory.strategyLosses
    },

    timestamp: Date.now()
  };

  metaState.lastEvaluation = analysis;
  metaState.evolutionHistory.push(analysis);

  return analysis;
}

/* =========================================================
   EVOLUTION LOGIC
========================================================= */

export function generateNextEvolution() {

  const latest =
    metaState.lastEvaluation ||
    evaluateSystemEvolution();

  const evolution = {
    riskAdjustment: "stable",
    strategyShift: "neutral",
    explorationRate: 0.1
  };

  const lowPerformance =
    latest?.cpilot?.biasWeights?.mediumVolatility < 0.9;

  if (lowPerformance) {
    evolution.explorationRate = 0.2;
    evolution.strategyShift = "explore";
  }

  const highCycleVolume =
    latest?.cpilot?.totalCycles > 100;

  if (highCycleVolume) {
    evolution.riskAdjustment = "conservative";
  }

  return {
    basedOn: latest,
    evolution,
    timestamp: Date.now()
  };
}

/* =========================================================
   META INFLUENCE ACCESS
========================================================= */

export function getMetaInfluence() {
  return { ...influenceState };
}

/**
 * 🔥 UPDATED: APPLY META INFLUENCE WITH REINFORCEMENT LEARNING
 */
export function applyMetaInfluence(analysis) {

  const weights =
    analysis?.cpilot?.biasWeights || {};

  const values = Object.values(weights);

  let averageWeight = 1.0;

  if (values.length) {
    averageWeight =
      values.reduce((a, b) => a + b, 0) /
      values.length;
  }

  // =====================================================
  // BASE CPilot LEARNING SIGNAL
  // =====================================================

  if (averageWeight < 0.9) {

    influenceState.riskBias = 1.2;
    influenceState.cpilotSensitivity = 1.2;
    influenceState.explorationRate = 0.20;

  } else if (averageWeight > 1.1) {

    influenceState.riskBias = 0.9;
    influenceState.cpilotSensitivity = 0.9;
    influenceState.explorationRate = 0.05;

  } else {

    influenceState.riskBias = 1.0;
    influenceState.cpilotSensitivity = 1.0;
    influenceState.explorationRate = 0.10;
  }

  // =====================================================
  // 🔥 NEW: STRATEGY REINFORCEMENT ADJUSTMENT
  // =====================================================

  const wins = reinforcementMemory.strategyWins;
  const losses = reinforcementMemory.strategyLosses;

  for (const strategy in wins) {

    const w = wins[strategy] || 0;
    const l = losses[strategy] || 0;

    const total = w + l;

    if (total < 5) continue;

    const winRate = w / total;

    if (winRate > 0.6) {
      influenceState.riskBias += 0.02;
      influenceState.explorationRate -= 0.01;
    }

    if (winRate < 0.4) {
      influenceState.riskBias -= 0.02;
      influenceState.explorationRate += 0.02;
    }
  }

  // SAFETY CLAMP
  influenceState.riskBias =
    Math.max(0.5, Math.min(2, influenceState.riskBias));

  influenceState.explorationRate =
    Math.max(0.05, Math.min(0.5, influenceState.explorationRate));

  influenceState.lastAdjustment = Date.now();

  return getMetaInfluence();
}

/* =========================================================
   META CYCLE
========================================================= */

export function runMetaBrainCycle() {

  const analysis =
    evaluateSystemEvolution();

  const influence =
    applyMetaInfluence(analysis);

  return {
    analysis,
    influence
  };
}

/* =========================================================
   STATUS
========================================================= */

export function getMetaBrainStatus() {
  return {
    lastEvaluation: metaState.lastEvaluation,
    historyLength: metaState.evolutionHistory.length,
    influence: getMetaInfluence()
  };
}

/* =========================================================
   RESET
========================================================= */

export function resetMetaBrain() {

  metaState.evolutionHistory = [];
  metaState.lastEvaluation = null;

  reinforcementMemory.strategyWins = {};
  reinforcementMemory.strategyLosses = {};

  influenceState.riskBias = 1.0;
  influenceState.explorationRate = 0.10;
  influenceState.cpilotSensitivity = 1.0;
  influenceState.lastAdjustment = null;
}
