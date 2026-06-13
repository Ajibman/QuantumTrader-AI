 // core/js/cpilot.js

import state from "./state.js";

/**
 * QuantumTrader-AI CPilot Service
 * --------------------------------
 * HOLD-based decision gate system
 * Now enhanced with context-aware memory feedback.
 */

import { getContextStrength } from "./cpilot_memory.js";

const cpilot = {

  setTradeMode(mode) {
    state.update("currentTradeMode", mode);
  },

  setTpTiming(timing) {
    state.update("currentTpTiming", timing);
  },

  setMarketGuidance(guidance) {
    state.update("currentGuidance", guidance);
  },

  qualifyTrader() {
    state.update("cPilotQualified", true);
  },

  resetQualification() {
    state.update("cPilotQualified", false);
  },

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
   * 🧠 CORE HOLD-BASED DECISION ENGINE (MEMORY ENHANCED)
   *
   * - hold: true  → BLOCK execution
   * - hold: false → ALLOW execution
   */
  getGuidance({ marketData = {}, qualification = {} } = {}) {

    const volatility = marketData?.volatility || 0;

    const qualified =
      qualification?.allowed ?? state.cPilotQualified;

    /**
     * 🧠 MEMORY CONTEXT SIGNAL
     * This adjusts how strict CPilot behaves in different environments
     */
    const contextSignal = getContextStrength(marketData);
    const contextWeight = contextSignal?.weight || 1.0;

    let hold = false;
    let confidence = 0.5;
    let riskLevel = "medium";

    /**
     * 1. Hard safety gate
     */
    if (!qualified) {
      hold = true;
      confidence = 0.2;
      riskLevel = "high";
    }

    /**
     * 2. Low volatility → usually no action
     * Memory can slightly relax or tighten this rule
     */
    else if (volatility < 0.2) {
      hold = contextWeight < 1.0; // adaptive HOLD
      confidence = 0.4 * contextWeight;
      riskLevel = "low";
    }

    /**
     * 3. Extreme volatility → always risky
     */
    else if (volatility > 0.85) {
      hold = true;
      confidence = 0.3;
      riskLevel = "high";
    }

    /**
     * 4. Normal trading zone → memory-influenced execution
     */
    else {
      hold = contextWeight < 0.7; // learned preference influences execution
      confidence = 0.7 * contextWeight;
      riskLevel = "medium";
    }

    return {
      hold,
      confidence,
      riskLevel,
      context: contextSignal.context,
      contextWeight,
      guidance: state.currentGuidance || "neutral",
      mode: state.currentTradeMode
    };
  },

  /**
   * Legacy compatibility hook
   */
  analyzeMarket(data = {}) {
    return {
      decision: "HOLD",
      confidence: 0,
      message: "CPilot uses HOLD-based + memory-aware guidance system"
    };
  }
};

export default cpilot;
