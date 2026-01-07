// ===============================
// PAYMENT STATE GATE
// ===============================

import { isLiveMode, isSimulationMode } from '../simulation.js';

export function gatePayment(option) {
    if (isSimulationMode()) {
        return {
            allowed: true,
            environment: 'SIMULATION'
        };
    }

    if (isLiveMode()) {
        if (option === 'OPTION_3') {
            return {
                allowed: false,
                reason: 'Option 3 not enabled for LIVE trading yet'
            };
        }

        return {
            allowed: true,
            environment: 'LIVE'
        };
    }

    return {
        allowed: false,
        reason: 'Unknown application state'
    };
}
