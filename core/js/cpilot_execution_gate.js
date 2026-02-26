/* CPilot STEP 2 — Execution Gate
   No execution. No locking.
*/

(function () {

  function isAutoTradeSelected() {
    const selected = document.querySelector(
      'input[name="trade-type"]:checked'
    );
    return selected && selected.value === 'autotrade';
  }

  function canStartAutotrader() {
    if (!isAutoTradeSelected()) {
      return { ok: false, reason: 'Auto Trade not selected' };
    }

    if (!window.CPilot || !window.CPilot.takeProfitSeconds) {
      return { ok: false, reason: 'Take-profit interval not set' };
    }

    if (!window.Autotrader) {
      return { ok: false, reason: 'Autotrader not available' };
    }

    return { ok: true };
  }

  // Expose gate result — do NOT start anything
  window.CPilotGate = {
    check: canStartAutotrader
  };

})();
