// ===============================
// OPTION 2 PAYMENT TRIGGER
// ===============================

import { processPayment } from './payments.js';
import { gatePayment } from './payment-gate.js';

/**
 * Option 2:
 * - Allowed in SIMULATION
 * - Allowed in LIVE
 * - Can be used as a secondary / alternative payment route
 */
export async function runOption2Payment(user, payment) {
    const gate = gatePayment('OPTION_2');

    // ===============================
    // GATE ENFORCEMENT
    // ===============================
    if (!gate.allowed) {
        console.warn('[Option 2 BLOCKED]', gate.reason);
        return {
            status: 'BLOCKED',
            reason: gate.reason
        };
    }

    console.log(`[Option 2] Executing in ${gate.environment} mode`);

    // ===============================
    // EXECUTION
    // ===============================
    try {
        const result = await processPayment(payment, {
            mode: 'OPTION_2',
            environment: gate.environment,
            logReflections: true,
            user
        });

        return {
            status: 'SUCCESS',
            data: result
        };

    } catch (error) {
        console.error('[Option 2] Payment failed', error);

        return {
            status: 'FAILED',
            error: error?.message || 'Option 2 payment failed'
        };
    }
}
