 // Strategy Memory Layer — CPilot Learning + Competition Extension

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
 * STRATEGY COMPETITION REGISTRY
 */
const strategyCompetition = {
  candidates: [],
  lastWinner: null
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

/* =========================================================
   STRATEGY OUTCOME LEARNING
========================================================= */

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

  const entry =
    memory.strategyStats[context][strategy];

  const pnl = result?.pnl;

  if (typeof pnl !== "number") return;

  entry.total += 1;
  memory.totalRecords += 1;

  if (pnl > 0) entry.wins++;
  else entry.losses++;

  updateScore(entry);
}

/**
 * UPDATE STRATEGY SCORE
 */
function updateScore(entry) {
  const total = entry.wins + entry.losses;

  if (total < 5) return;

  const winRate = entry.wins / total;

  if (winRate > 0.6) {
    entry.score += 0.05;
  } else if (winRate < 0.4) {
    entry.score -= 0.05;
  }

  entry.score = clamp(entry.score, 0.2, 3.0);
}

/* =========================================================
   BASIC BEST STRATEGY (BACKWARD COMPATIBILITY)
========================================================= */

export function getBestStrategy(marketData = {}) {
  const context = getContext(marketData);
  const strategies = memory.strategyStats[context];

  let best = {
    name: "default",
    score: 1
  };

  for (const [name, data] of Object.entries(strategies)) {
    if (data.score > best.score) {
      best = { name, score: data.score };
    }
  }

  return {
    context,
    bestStrategy: best
  };
}

/* =========================================================
   STRATEGY COMPETITION LAYER (NEW)
========================================================= */

/**
 * REGISTER STRATEGY CANDIDATE
 */
export function registerStrategyCandidate(strategy) {
  if (!strategy?.name) return;

  strategyCompetition.candidates.push({
    ...strategy,
    registeredAt: Date.now()
  });
}

/**
 * SCORE CANDIDATES (META-BRAIN READY)
 */
export function scoreStrategyCandidates(
  marketData = {},
  influence = null
) {
  const multiplier =
    influence?.riskBias || 1;

  return strategyCompetition.candidates.map(
    strategy => {

      const context =
        getContext(marketData);

      const data =
        memory.strategyStats?.[context]?.[
          strategy.name
        ] || { wins: 0, losses: 0, score: 1 };

      const total =
        data.wins + data.losses;

      const winRate =
        total > 0
          ? data.wins / total
          : 0.5;

      return {
        ...strategy,

        competitionScore:
          (data.score * winRate) / multiplier
      };
    }
  );
}

/**
 * SELECT WINNING STRATEGY
 */
export function selectWinningStrategy(
  marketData = {},
  influence = null
) {
  const scored =
    scoreStrategyCandidates(
      marketData,
      influence
    );

  if (!scored.length) return null;

  const winner =
    scored.sort(
      (a, b) =>
        b.competitionScore -
        a.competitionScore
    )[0];

  strategyCompetition.lastWinner = winner;

  return winner;
}

/* =========================================================
   UNIFIED STRATEGY DECISION ENGINE (NEW - CPILOT USES THIS)
========================================================= */

export function getStrategyDecision(
  marketData = {},
  influence = null,
  mode = "competition" // "competition" | "legacy"
) {

  let selected;

  if (mode === "competition") {
    selected = selectWinningStrategy(
      marketData,
      influence
    );
  } else {
    const legacy = getBestStrategy(marketData);
    selected = {
      name: legacy.bestStrategy.name,
      score: legacy.bestStrategy.score,
      context: legacy.context
    };
  }

  const score =
    selected?.competitionScore ||
    selected?.score ||
    1;

  const decision =
    score >= 1 ? "ALLOW" : "HOLD";

  const confidence =
    Math.min(0.95, Math.max(0.35, score / 2));

  return {
    strategy: selected,
    decision,
    confidence,
    mode
  };
}

/**
 * GET COMPETITION STATUS
 */
export function getCompetitionStatus() {
  return {
    candidateCount:
      strategyCompetition.candidates.length,

    lastWinner:
      strategyCompetition.lastWinner,

    candidates:
      strategyCompetition.candidates
  };
}

/* =========================================================
   MEMORY MANAGEMENT
========================================================= */

export function getStrategyMemory() {
  return { ...memory };
}

export function resetStrategyMemory() {
  memory.totalRecords = 0;

  memory.strategyStats = {
    lowVolatility: {},
    mediumVolatility: {},
    highVolatility: {}
  };

  strategyCompetition.candidates = [];
  strategyCompetition.lastWinner = null;
}

/* =========================================================
   UTIL
========================================================= */

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
