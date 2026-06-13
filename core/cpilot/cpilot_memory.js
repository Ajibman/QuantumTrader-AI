// cpilot_memory.js

/**
 * CPilot Memory Layer
 * -------------------
 * Learns from trading outcomes and adjusts
 * guidance bias weights over time.
 *
 * This is NOT execution logic.
 * It is behavioral adaptation logic.
 */

const memory = {
  totalCycles: 0,

  // performance tracking by bias type
  biasStats: {
    bullish: { wins: 0, losses: 0 },
    bearish: { wins: 0, losses: 0 },
    neutral: { wins: 0, losses: 0 }
  },

  // adaptive weights (this evolves CPilot behavior)
  biasWeights: {
    bullish: 1.0,
    bearish: 1.0,
    neutral: 1.0
  }
};

/**
 * FEED RESULT INTO MEMORY
 * Called after each engine cycle
 */
export function recordCycleOutcome({ guidance, result }) {
  const bias = guidance?.bias || "neutral";
  const pnl = result?.pnl;

  if (!memory.biasStats[bias]) return;

  memory.totalCycles += 1;

  if (typeof pnl !== "number") return;

  if (pnl > 0) {
    memory.biasStats[bias].wins += 1;
  } else {
    memory.biasStats[bias].losses += 1;
  }

  // Recalculate weights after update
  updateBiasWeights();
}

/**
 * CORE LEARNING FUNCTION
 * Adjusts CPilot bias strength based on performance
 */
function updateBiasWeights() {
  const biases = Object.keys(memory.biasStats);

  biases.forEach((bias) => {
    const stats = memory.biasStats[bias];

    const total = stats.wins + stats.losses;

    if (total < 3) return; // avoid early noise

    const winRate = stats.wins / total;

    /**
     * Learning rule:
     * - Above 55% win rate → strengthen bias
     * - Below 45% win rate → weaken bias
     * - Else → neutral
     */

    if (winRate > 0.55) {
      memory.biasWeights[bias] += 0.05;
    } else if (winRate < 0.45) {
      memory.biasWeights[bias] -= 0.05;
    }

    // clamp values (stability protection)
    memory.biasWeights[bias] = clamp(memory.biasWeights[bias], 0.3, 2.0);
  });
}

/**
 * USED BY CPilot
 * Applies learned weights to guidance decision
 */
export function getWeightedBias(rawBias = "neutral") {
  const weight = memory.biasWeights[rawBias] || 1.0;

  return {
    bias: rawBias,
    weight,
    adjustedStrength: weight
  };
}

/**
 * READ MEMORY STATE (for dashboards/debugging)
 */
export function getMemorySnapshot() {
  return {
    ...memory
  };
}

/**
 * RESET MEMORY (optional system reset mode)
 */
export function resetMemory() {
  memory.totalCycles = 0;

  Object.keys(memory.biasStats).forEach((b) => {
    memory.biasStats[b] = { wins: 0, losses: 0 };
    memory.biasWeights[b] = 1.0;
  });
}

/**
 * Utility
 */
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
  }
