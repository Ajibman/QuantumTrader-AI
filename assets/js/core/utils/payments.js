function handlePaymentRequest(method, amount) {

  if (state.paymentLayer === 'NONE') {
    notify('Complete training to unlock payments.');
    return;
  }

  if (state.paymentLayer === 'SIMULATED') {
    simulateFunding(amount);
    addReflection('Simulated funding applied.');
    return;
  }

  if (state.paymentLayer === 'LIVE') {
    initiateLivePayment(method, amount);
    addReflection('Live payment initiated.');
    return;
  }

  notify('Payment system unavailable.');
}
