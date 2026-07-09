// core/js/tradingfloor_entry.js

/**
 * ============================================================
 * QuantumTrader-AI™ (Qonexai™)
 * TRADING FLOOR ENTRY SIGNAL
 * ============================================================
 *
 * PURPOSE
 * -------
 * Provides Trading Floor access qualification signal.
 *
 * Responsibilities:
 * • Read CPilot qualification state
 * • Build Trading Floor permission object
 * • Return access decision
 *
 * This file does NOT:
 * • execute trades
 * • start Trading Floor runtime
 * • manage capital
 * ============================================================
 */

export function buildTradingFloorSignal() {

  const cpilotQualified =
    localStorage.getItem(
      "cpilotQualified"
    ) === "true";


  return {

    permission: {

      tradingFloorAllowed:
        cpilotQualified

    }

  };

}
