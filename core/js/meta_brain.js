// core/js/meta_brain.js

/**
 * META-BRAIN LAYER
 * -----------------
 * This sits ABOVE TraderLab Orchestrator.
 *
 * It does NOT trade.
 * It does NOT execute.
 * It ONLY configures the lab.
 *
 * Its job:
 * - choose strategy sets
 * - choose risk posture
 * - define experiment configuration
 * - evolve system behavior over sessions
 */

import { createSession, startSession } from "./traderlab_orchestrator.js";
import { getStrategyMemory } from "./strategy_memory.js";
import { getMemorySnapshot } from "./cpilot_memory.js";

const metaState = {
  lastSessionConfig: null,
  sessionHistory: []
};

/**
 * 🧠 GENERATE STRATEGY CONFIGURATION
 */
function selectStrategySet(memory) {
  const ctx = memory?.contextStrategyMap || {};

  const low = ctx.lowVolatility || {};
  const med = ctx.mediumVolatility || {};
  const high = ctx.highVolatility || {};

  /**
   * Simple adaptive selection logic:
   * - prefer strongest-performing strategies per context
   */
  return {
    safety: (low.safety + med.safety + high.safety) / 3,
    momentum: (low.momentum + med.momentum + high.momentum) / 3,
    stability: (low.stability + med.stability + high.stability) / 3
  };
}

/**
 * 🧠 DEFINE SYSTEM RISK POSTURE
 */
function determineRiskProfile(memory) {
  const ctx = memory?.contextStrategyMap?.mediumVolatility;

  const avg =
    (ctx?.safety + ctx?.momentum + ctx?.stability) / 3;

  if (avg > 1.2) return "aggressive";
  if (avg < 0.8) return "conservative";

  return "balanced";
}

/**
 * 🧠 CREATE INTELLIGENT SESSION CONFIG
 */
export function buildSessionConfig() {

  const strategyMemory = getStrategyMemory();
  const cpilotMemory = getMemorySnapshot();

  const strategySet = selectStrategySet(strategyMemory);
  const riskProfile = determineRiskProfile(strategyMemory);

  const config = {
    strategySet,
    riskProfile,
    cpilotMemorySnapshot: cpilotMemory,
    createdAt: Date.now()
  };

  metaState.lastSessionConfig = config;

  return config;
}

/**
 * 🧪 CREATE + START INTELLIGENT SESSION
 */
export function launchIntelligentSession({
  name = "meta-session",
  mode = "simulation",
  interval = 5000,
  getMarketData
}) {
  const config = buildSessionConfig();

  const sessionId = createSession({
    name,
    mode,
    interval,
    config
  });

  const session = startSession(sessionId, {
    getMarketData
  });

  metaState.sessionHistory.push({
    sessionId,
    config,
    startedAt: Date.now()
  });

  return {
    sessionId,
    config,
    session
  };
}

/**
 * 🧠 EVOLVE NEXT SESSION STRATEGY
 */
export function evolveMetaBrain() {
  const strategyMemory = getStrategyMemory();

  const nextConfig = buildSessionConfig();

  return {
    previous: metaState.lastSessionConfig,
    next: nextConfig,
    delta: "adaptive recalibration based on strategy + context memory"
  };
}

/**
 * 📊 META-BRAIN STATUS
 */
export function getMetaBrainStatus() {
  return {
    lastSessionConfig: metaState.lastSessionConfig,
    sessionCount: metaState.sessionHistory.length
  };
}
