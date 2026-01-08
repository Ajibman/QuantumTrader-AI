 /**
 * Central payment request handler
 * This function does NOT decide payment options.
 * It only routes based on the resolved payment layer.
 *
 * paymentLayer meanings:
 *  - NONE       → training incomplete / blocked
 *  - SIMULATED  → simulation funding only
 *  - LIVE       → real payment initiation
 */

export function handlePaymentRequest(method, amount) {
  // Defensive guards
  if (!method || !amount || amount <= 0) {
    notify('Invalid payment request.');
    console.warn('[Payment] Invalid method or amount', { method, amount });
    return;
  }

  switch (state.paymentLayer) {
    case 'NONE': {
      notify('Complete training to unlock payments.');
      addReflection('Payment attempt blocked: training incomplete.');
      return;
    }

    case 'SIMULATED': {
      try {
        simulateFunding(amount);
        addReflection(`Simulated funding applied: ₦${amount}`);
      } catch (err) {
        console.error('[Payment] Simulation failed', err);
        notify('Simulation failed.');
      }
      return;
    }

    case 'LIVE': {
      try {
        initiateLivePayment(method, amount);
        addReflection(`Live payment initiated via ${method}.`);
      } catch (err) {
        console.error('[Payment] Live payment error', err);
        notify('Live payment could not be initiated.');
      }
      return;
    }

    default: {
      console.error('[Payment] Unknown paymentLayer:', state.paymentLayer);
      notify('Payment system unavailable.');
      return;
    }
  }
}
