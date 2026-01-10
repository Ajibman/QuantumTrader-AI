import { AppState, saveState } from "./state.js";

export function payWithPaystack() {
  const handler = PaystackPop.setup({
    key: "pk_live_REPLACE_WITH_YOUR_KEY", // or pk_test_
    email: "user@quantumtrader.ai",       // placeholder
    amount: 10000 * 100,                  // ₦10,000 in kobo
    currency: "NGN",
    ref: "QT_" + Date.now(),

    callback: function (response) {
      // AUTHORITATIVE activation
      AppState.subscription.active = true;
      AppState.subscription.expiresAt =
        Date.now() + 30 * 24 * 60 * 60 * 1000;

      saveState();

      alert("Trading Floor activated successfully.");
      window.QT.finish(); // continue onboarding safely
    },

    onClose: function () {
      alert("Payment cancelled. Trading Floor remains locked.");
    }
  });

  handler.openIframe();
}
