 // cpilot_memory.js

/**
 * CPilot Memory Layer (v2)
 * ------------------------
 * Now learns CONTEXT + OUTCOME, not just win/loss.
 *
 * Key improvement:
 * We track WHEN decisions work, not just IF they work.
 */

const memory = {
  totalCycles: 0,

  // context-based performance tracking
  contextStats: {
    lowVolatility: { wins: 0, losses: 0 },
    mediumVolatility: { wins: 0, losses: 0 },
    highVolatility: { wins: 0, losses: 0 }
  },

  biasWeights: {
    lowVolatility: 1.0,
    mediumVolatility: 1.0,
    highVolatility: 1.0
  }
};

/**
 * CLASSIFY MARKET CONTEXT
 */
function getContext(marketData = {}) {
  const v = marketData.volatility || 0;

  if (v < 0.3) return "lowVolatility";
  if (v < 0.7) return "mediumVolatility";
  return "highVolatility";
}

/**
 * FEED ONLY REAL EXECUTED OUTCOMES
 */
export function recordCycleOutcome({ guidance, result, marketData }) {
  const pnl = result?.pnl;
  if (typeof pnl !== "number") return;

  const context = getContext(marketData);

  if (!memory.contextStats[context]) return;

  memory.totalCycles += 1;

  if (pnl > 0) {
    memory.contextStats[context].wins += 1;
  } else {
    memory.contextStats[context].losses += 1;
  }

  updateWeights();
}

/**
 * LEARNING LOGIC (context-aware adaptation)
 */
function updateWeights() {
  Object.keys(memory.contextStats).forEach((ctx) => {
    const stats = memory.contextStats[ctx];

    const total = stats.wins + stats.losses;
    if (total < 5) return; // avoid noise early

    const winRate = stats.wins / total;

    if (winRate > 0.55) {
      memory.biasWeights[ctx] += 0.05;
    } else if (winRate < 0.45) {
      memory.biasWeights[ctx] -= 0.05;
    }

    memory.biasWeights[ctx] = clamp(memory.biasWeights[ctx], 0.3, 2.0);
  });
}

/**
 * CPilot uses this to understand environment quality
 */
export function getContextStrength(marketData = {}) {
  const context = getContext(marketData);

  return {
    context,
    weight: memory.biasWeights[context] || 1.0
  };
}

/**
 * DEBUG / ANALYTICS
 */
export function getMemorySnapshot() {
  return { ...memory };
}

/**
 * RESET MEMORY
 */
export function resetMemory() {
  memory.totalCycles = 0;

  Object.keys(memory.contextStats).forEach((k) => {
    memory.contextStats[k] = { wins: 0, losses: 0 };
    memory.biasWeights[k] = 1.0;
  });
}

/**
 * UTILITY
 */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
