// mobile/ui/trading_dashboard.js

import { on, emit } from "./event_system.js";

/**
 * QuantumTrader-AI
 * Trading Dashboard
 *
 * Responsibilities:
 * - Signal monitoring
 * - CPilot intelligence display
 * - Market opportunity tracking
 * - Trading readiness visibility
 */

const tradingState = {

  latestSignal: null,

  latestDecision: null,

  signalCount: 0,

  bullishSignals: 0,

  bearishSignals: 0,

  neutralSignals: 0,

  confidenceScore: 0,

  marketSentiment: "NEUTRAL",

  lastUpdate: null

};

/**
 * Initialize Trading Dashboard
 */
export function initializeTradingDashboard() {

  registerTradingEvents();

  console.log("[TradingDashboard] Initialized");

}

/**
 * Register Event Listeners
 */
function registerTradingEvents() {

  /**
   * CPilot Signal Feed
   */
  on("CPILOT_SIGNAL", signal => {

    tradingState.latestSignal = signal;

    tradingState.signalCount++;

    updateSignalStatistics(signal);

    tradingState.lastUpdate = Date.now();

    renderTradingDashboard();

  });

  /**
   * CPilot Decisions
   */
  on("CPILOT_DECISION", decision => {

    tradingState.latestDecision = decision;

    if (decision?.confidence) {
      tradingState.confidenceScore =
        decision.confidence;
    }

    tradingState.lastUpdate = Date.now();

    renderTradingDashboard();

  });

  /**
   * Meta Brain Override
   */
  on("META_BRAIN_DECISION", decision => {

    tradingState.latestDecision = decision;

    tradingState.lastUpdate = Date.now();

    renderTradingDashboard();

  });

}

/**
 * Signal Statistics
 */
function updateSignalStatistics(signal) {

  const direction =
    signal?.direction?.toUpperCase();

  switch (direction) {

    case "BUY":
    case "BULLISH":
      tradingState.bullishSignals++;
      break;

    case "SELL":
    case "BEARISH":
      tradingState.bearishSignals++;
      break;

    default:
      tradingState.neutralSignals++;
      break;

  }

  calculateMarketSentiment();

}

/**
 * Market Sentiment
 */
function calculateMarketSentiment() {

  const bullish =
    tradingState.bullishSignals;

  const bearish =
    tradingState.bearishSignals;

  if (bullish > bearish) {

    tradingState.marketSentiment =
      "BULLISH";

  } else if (bearish > bullish) {

    tradingState.marketSentiment =
      "BEARISH";

  } else {

    tradingState.marketSentiment =
      "NEUTRAL";

  }

}

/**
 * Render Dashboard
 */
function renderTradingDashboard() {

  emit("TRADING_DASHBOARD_UPDATED", {
    ...tradingState
  });

  console.log(
    "[TradingDashboard]",
    tradingState
  );

}

/**
 * State Accessor
 */
export function getTradingState() {

  return {
    ...tradingState
  };

}

/**
 * Reset Dashboard
 */
export function resetTradingDashboard() {

  tradingState.latestSignal = null;
  tradingState.latestDecision = null;
  tradingState.signalCount = 0;
  tradingState.bullishSignals = 0;
  tradingState.bearishSignals = 0;
  tradingState.neutralSignals = 0;
  tradingState.confidenceScore = 0;
  tradingState.marketSentiment = "NEUTRAL";
  tradingState.lastUpdate = null;

  renderTradingDashboard();

}
