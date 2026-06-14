// Meta-Brain Evolution Layer — System Intelligence Over Time

import { listSessions } from "./traderlab_orchestrator.js";
import { getStrategyMemory } from "./strategy_memory.js";
import { getMemorySnapshot } from "../cpilot/cpilot_memory.js";

const metaState = {
  evolutionHistory: [],
  lastEvaluation: null
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
    runningSessions: sessions.filter(s => s.status === "running").length,

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

  const latest = metaState.lastEvaluation || evaluateSystemEvolution();

  const evolution = {
    riskAdjustment: "stable",
    strategyShift: "neutral",
    explorationRate: 0.1
  };

  // simple adaptive logic (safe baseline)
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
 * GET META-BRAIN STATUS
 */
export function getMetaBrainStatus() {
  return {
    lastEvaluation: metaState.lastEvaluation,
    historyLength: metaState.evolutionHistory.length
  };
}

/**
 * RESET META STATE
 */
export function resetMetaBrain() {
  metaState.evolutionHistory = [];
  metaState.lastEvaluation = null;
}
