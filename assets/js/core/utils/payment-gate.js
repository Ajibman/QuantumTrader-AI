 // ===============================
// PAYMENT STATE GATE (AUTHORITATIVE)
// ===============================

import { isLiveMode, isSimulationMode } from '../simulation.js';

/**
 * Resolves whether a payment option is allowed
 * and in which environment it may execute.
 *
 * @param {string} option - OPTION_1 | OPTION_2 | OPTION_3
 * @returns {Object}
 */
export function gatePayment(option) {
  // Simulation always wins — no real money risk
  if (isSimulationMode()) {
    return {
      allowed: true,
      environment: 'SIMULATION'
    };
  }

  // Live mode restrictions
  if (isLiveMode()) {
    // Explicitly block OPTION_3 in LIVE
    if (option === 'OPTION_3') {
      return {
        allowed: false,
        environment: 'LIVE',
        reason: 'Option 3 is not enabled for LIVE trading yet'
      };
    }

    return {
      allowed: true,
      environment: 'LIVE'
    };
  }

  // Defensive fallback — should never happen
  console.error('[Payment Gate] Unknown application state', { option });

  return {
    allowed: false,
    environment: 'UNKNOWN',
    reason: 'Unknown application state'
  };
}
