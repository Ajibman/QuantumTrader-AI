 // ===============================
// OPTION 3 PAYMENT TRIGGER
// ===============================

import { processPayment } from './payments.js';
import { gatePayment } from './payment-gate.js';

/**
 * Runs Option 3 payment flow.
 * Option 3 is allowed ONLY in SIMULATION mode.
 */
export async function runOption3Payment(user, payment) {
    const gate = gatePayment('OPTION_3');

    // ===============================
    // GATE ENFORCEMENT
    // ===============================
    if (!gate.allowed) {
        console.warn('[Option 3 BLOCKED]', gate.reason);
        return {
            status: 'BLOCKED',
            reason: gate.reason
        };
    }

    console.log(`[Option 3] Executing in ${gate.environment} mode`);

    // ===============================
    // EXECUTION (SIMULATION ONLY)
    // ===============================
    try {
        const result = await processPayment(payment, {
            mode: 'OPTION_3',
            environment: gate.environment,
            logReflections: true,
            user
        });

        return {
            status: 'SUCCESS',
            data: result
        };

    } catch (error) {
        console.error('[Option 3] Payment failed', error);

        return {
            status: 'FAILED',
            error: error?.message || 'Option 3 payment failed'
        };
    }
}
