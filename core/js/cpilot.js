 // core/js/cpilot.js

import state from "./state.js";

/**
 * QuantumTrader-AI CPilot Service
 * --------------------------------
 * This layer controls:
 * - trading mode configuration
 * - system qualification state
 * - market "permission to act" logic (HOLD system)
 *
 * IMPORTANT:
 * CPilot does NOT execute trades.
 * CPilot ONLY decides if the system is allowed to act or stay idle.
 */

import { recordCycleOutcome } from "./cpilot_memory.js";

const cpilot = {

  /**
   * Trade Mode
   * Manual | Assisted | Automatic
   */
  setTradeMode(mode) {
    state.update("currentTradeMode", mode);
  },

  /**
   * Take-Profit Timing
   * 15s | 1m | 5m | Dynamic
   */
  setTpTiming(timing) {
    state.update("currentTpTiming", timing);
  },

  /**
   * Market Guidance (non-directional context only)
   * favorable | caution | unfavorable
   */
  setMarketGuidance(guidance) {
    state.update("currentGuidance", guidance);
  },

  /**
   * Trader Qualification Gate
   */
  qualifyTrader() {
    state.update("cPilotQualified", true);
  },

  resetQualification() {
    state.update("cPilotQualified", false);
  },

  /**
   * System Status Snapshot
   */
  getStatus() {
    return {
      tradeMode: state.currentTradeMode,
      tpTiming: state.currentTpTiming,
      guidance: state.currentGuidance,
      walletBalance: state.walletBalance,
      qualified: state.cPilotQualified
    };
  },

  /**
   * 🧠 CORE FUNCTION: HOLD-BASED DECISION ENGINE
   *
   * This replaces ALL "bias thinking".
   *
   * Output meaning:
   * - hold: true  → DO NOT run engine cycle
   * - hold: false → ALLOW engine cycle execution
   */
  getGuidance({ marketData = {}, qualification = {} } = {}) {

    const volatility = marketData?.volatility || 0;
    const qualified = qualification?.allowed ?? state.cPilotQualified;

    let hold = false;
    let confidence = 0.5;
    let riskLevel = "medium";

    /**
     * RULE SET (simple, stable gating logic)
     */

    // 1. Hard safety: not qualified → always HOLD
    if (!qualified) {
      hold = true;
      confidence = 0.2;
      riskLevel = "high";
    }

    // 2. Low volatility → no action environment
    else if (volatility < 0.2) {
      hold = true;
      confidence = 0.4;
      riskLevel = "low";
    }

    // 3. Extremely unstable market → HOLD for protection
    else if (volatility > 0.85) {
      hold = true;
      confidence = 0.3;
      riskLevel = "high";
    }

    // 4. Normal operating zone → ALLOW execution
    else {
      hold = false;
      confidence = 0.7;
      riskLevel = "medium";
    }

    return {
      hold,
      confidence,
      riskLevel,
      guidance: state.currentGuidance || "neutral",
      mode: state.currentTradeMode
    };
  },

  /**
   * Legacy hook (kept for compatibility)
   * Now just returns HOLD-safe default
   */
  analyzeMarket(data = {}) {
    return {
      decision: "HOLD",
      confidence: 0,
      message: "CPilot now uses HOLD-based guidance system"
    };
  }
};

export default cpilot;
