// Meta-Brain Evolution Layer — System Intelligence Over Time

import { listSessions } from "./traderlab_orchestrator.js";
import { getStrategyMemory } from "./strategy_memory.js";
import { getMemorySnapshot } from "../cpilot/cpilot_memory.js";

const metaState = {
  evolutionHistory: [],
  lastEvaluation: null
};

/**
 * META-BRAIN INFLUENCE PROFILE
 *
 * This does NOT execute trades.
 * This does NOT control TradingFloor.
 *
 * It only influences:
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

/**
 * ANALYZE SYSTEM PERFORMANCE ACROSS SESSIONS
 */
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

    timestamp: Date.now()
  };

  metaState.lastEvaluation = analysis;
  metaState.evolutionHistory.push(analysis);

  return analysis;
}

/**
 * GENERATE NEXT EVOLUTION CONFIG
 */
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

/**
 * GET META-BRAIN INFLUENCE PROFILE
 */
export function getMetaInfluence() {
  return { ...influenceState };
}

/**
 * APPLY META-BRAIN INFLUENCE
 *
 * Uses CPilot learning performance
 * to adapt system posture.
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

  // Conservative adaptation
  if (averageWeight < 0.9) {

    influenceState.riskBias = 1.2;
    influenceState.cpilotSensitivity = 1.2;
    influenceState.explorationRate = 0.20;

  }

  // Strong adaptation
  else if (averageWeight > 1.1) {

    influenceState.riskBias = 0.9;
    influenceState.cpilotSensitivity = 0.9;
    influenceState.explorationRate = 0.05;

  }

  // Balanced adaptation
  else {

    influenceState.riskBias = 1.0;
    influenceState.cpilotSensitivity = 1.0;
    influenceState.explorationRate = 0.10;
  }

  influenceState.lastAdjustment = Date.now();

  return getMetaInfluence();
}

/**
 * RUN META-BRAIN EVOLUTION CYCLE
 */
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

/**
 * META-BRAIN STATUS
 */
export function getMetaBrainStatus() {
  return {
    lastEvaluation: metaState.lastEvaluation,
    historyLength: metaState.evolutionHistory.length,
    influence: getMetaInfluence()
  };
}

/**
 * RESET META STATE
 */
export function resetMetaBrain() {

  metaState.evolutionHistory = [];
  metaState.lastEvaluation = null;

  influenceState.riskBias = 1.0;
  influenceState.explorationRate = 0.10;
  influenceState.cpilotSensitivity = 1.0;
  influenceState.lastAdjustment = null;
}
