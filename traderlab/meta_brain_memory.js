// core/js/meta_brain_memory.js

/**
 * META-BRAIN EVOLUTION MEMORY LAYER
 * ---------------------------------
 * Learns from entire TraderLab sessions.
 *
 * Unlike other memory layers:
 * - does NOT track trades
 * - does NOT track strategies directly
 * - tracks SYSTEM CONFIGURATIONS
 *
 * It answers:
 * "What system setup works best?"
 */

const memory = {

  totalSessions: 0,

  sessionStats: [],

  configPerformance: {
    aggressive: { sessions: 0, avgPnL: 0, wins: 0 },
    balanced: { sessions: 0, avgPnL: 0, wins: 0 },
    conservative: { sessions: 0, avgPnL: 0, wins: 0 }
  }
};

/**
 * 🧪 FEED SESSION RESULT INTO META-BRAIN
 */
export function recordSessionOutcome({
  config,
  report
}) {
  if (!report) return;

  const risk = config?.riskProfile || "balanced";
  const pnl = report?.totalPnL || 0;
  const winRate = report?.winRate || 0;

  memory.totalSessions += 1;

  memory.sessionStats.push({
    risk,
    pnl,
    winRate,
    trades: report.trades,
    timestamp: Date.now()
  });

  updateConfigPerformance(risk, pnl, winRate);
}

/**
 * 🧠 UPDATE SYSTEM CONFIG LEARNING
 */
function updateConfigPerformance(risk, pnl, winRate) {

  const entry = memory.configPerformance[risk];
  if (!entry) return;

  entry.sessions += 1;

  // running average PnL
  entry.avgPnL =
    (entry.avgPnL * (entry.sessions - 1) + pnl) / entry.sessions;

  if (winRate > 0.5) {
    entry.wins += 1;
  }
}

/**
 * 🧠 GET BEST CONFIGURATION
 */
export function getBestConfiguration() {

  let best = {
    riskProfile: "balanced",
    score: -Infinity
  };

  Object.keys(memory.configPerformance).forEach((key) => {

    const cfg = memory.configPerformance[key];

    const score =
      cfg.avgPnL * 0.6 +
      cfg.wins * 0.4;

    if (score > best.score) {
      best = {
        riskProfile: key,
        score
      };
    }
  });

  return best;
}

/**
 * 📊 FULL META-BRAIN MEMORY SNAPSHOT
 */
export function getMetaBrainMemory() {
  return { ...memory };
}

/**
 * 🔁 RESET META EVOLUTION MEMORY
 */
export function resetMetaBrainMemory() {

  memory.totalSessions = 0;
  memory.sessionStats = [];

  Object.keys(memory.configPerformance).forEach((k) => {
    memory.configPerformance[k] = {
      sessions: 0,
      avgPnL: 0,
      wins: 0
    };
  });
}
