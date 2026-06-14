// Strategy Memory Layer — CPilot Learning Extension

const memory = {
  totalRecords: 0,

  // performance by strategy + context
  strategyStats: {
    lowVolatility: {},
    mediumVolatility: {},
    highVolatility: {}
  }
};

/**
 * CLASSIFY CONTEXT
 */
function getContext(marketData = {}) {
  const v = marketData.volatility || 0;

  if (v < 0.3) return "lowVolatility";
  if (v < 0.7) return "mediumVolatility";
  return "highVolatility";
}

/**
 * RECORD STRATEGY OUTCOME
 * Called after each cycle or module execution
 */
export function recordStrategyOutcome({
  strategy = "default",
  result = {},
  marketData = {}
}) {
  const context = getContext(marketData);

  if (!memory.strategyStats[context][strategy]) {
    memory.strategyStats[context][strategy] = {
      wins: 0,
      losses: 0,
      total: 0,
      score: 1
    };
  }

  const entry = memory.strategyStats[context][strategy];

  const pnl = result?.pnl;

  if (typeof pnl !== "number") return;

  entry.total += 1;
  memory.totalRecords += 1;

  if (pnl > 0) {
    entry.wins += 1;
  } else {
    entry.losses += 1;
  }

  updateScore(entry);
}

/**
 * UPDATE STRATEGY SCORE
 */
function updateScore(entry) {
  const total = entry.wins + entry.losses;

  if (total < 5) return; // avoid noise early

  const winRate = entry.wins / total;

  if (winRate > 0.6) {
    entry.score += 0.05;
  } else if (winRate < 0.4) {
    entry.score -= 0.05;
  }

  entry.score = clamp(entry.score, 0.2, 3.0);
}

/**
 * GET BEST STRATEGY FOR CONTEXT
 */
export function getBestStrategy(marketData = {}) {
  const context = getContext(marketData);
  const strategies = memory.strategyStats[context];

  let best = {
    name: "default",
    score: 1
  };

  for (const [name, data] of Object.entries(strategies)) {
    if (data.score > best.score) {
      best = {
        name,
        score: data.score
      };
    }
  }

  return {
    context,
    bestStrategy: best
  };
}

/**
 * MEMORY SNAPSHOT
 */
export function getStrategyMemory() {
  return { ...memory };
}

/**
 * RESET MEMORY
 */
export function resetStrategyMemory() {
  memory.totalRecords = 0;

  memory.strategyStats = {
    lowVolatility: {},
    mediumVolatility: {},
    highVolatility: {}
  };
}

/**
 * UTIL
 */
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
