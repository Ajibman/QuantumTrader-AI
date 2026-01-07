// utils/option3-trigger.js
// ===============================
// Trigger script for Option 3 payment flow
// ===============================

import { processPayment } from './payments.js'; // main payments module

// Option 3 configuration
const option3Config = {
    mode: 'OPTION_3',
    enableMultiMethod: true,
    logReflections: true,
};

// Function to execute Option 3
export function runOption3Payment(userData, paymentDetails) {
    console.log('[Option 3] Initiating payment flow for user:', userData.id);

    try {
        const result = processPayment(paymentDetails, option3Config);
        
        if (option3Config.logReflections) {
            console.log('[Option 3 Reflection] Payment processed:', result.status);
        }

        return result;
    } catch (error) {
        console.error('[Option 3] Payment flow error:', error);
        return { status: 'FAILED', error };
    }
}

// Example usage (can be removed when integrated into dashboard)
if (import.meta.main) {
    const testUser = { id: 'USER123' };
    const testPayment = { amount: 1000, method: 'CARD' };
    runOption3Payment(testUser, testPayment);
}
