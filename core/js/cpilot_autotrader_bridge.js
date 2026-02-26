/* CPilot → Autotrader bridge
   Baseline: 19 TP radio buttons
*/

(function () {

  function normalizeToSeconds(value) {
    if (!value) return null;

    const num = parseInt(value, 10);

    if (value.endsWith('s')) return num;
    if (value.endsWith('m')) return num * 60;
    if (value.endsWith('h')) return num * 3600;
    if (value.endsWith('d')) return num * 86400;

    return null;
  }

  function onTakeProfitChange(e) {
    const seconds = normalizeToSeconds(e.target.value);
    if (!seconds) return;

    console.log('[CPilot] Take-profit interval:', seconds, 'seconds');

    // Store in CPilot runtime state (lightweight, no state.js)
    window.CPilot = window.CPilot || {};
    window.CPilot.takeProfitSeconds = seconds;

    // Hand off to Autotrader (no execution yet)
    if (window.Autotrader && typeof window.Autotrader.setTakeProfit === 'function') {
      window.Autotrader.setTakeProfit(seconds);
    }
  }

  document
    .querySelectorAll('input[name="tp-time"]')
    .forEach(radio => {
      radio.addEventListener('change', onTakeProfitChange);
    });

})();

(function () {

  const startBtn = document.getElementById('start-autotrade-btn');
  const stopBtn  = document.getElementById('stop-autotrade-btn');

  function autoTradeSelected() {
    const sel = document.querySelector('input[name="trade-type"]:checked');
    return sel && sel.value === 'autotrade';
  }

  startBtn.addEventListener('click', () => {
    if (!autoTradeSelected()) {
      alert('Auto Trade must be selected.');
      return;
    }

    if (!window.CPilot || !window.CPilot.takeProfitSeconds) {
      alert('Select a take-profit interval.');
      return;
    }

    if (!window.Autotrader || typeof window.Autotrader.start !== 'function') {
      console.warn('Autotrader not ready.');
      return;
    }

    // LOCK interval
    document
      .querySelectorAll('input[name="tp-time"]')
      .forEach(r => r.disabled = true);

    startBtn.disabled = true;
    stopBtn.disabled  = false;

    window.Autotrader.start({
      takeProfitSeconds: window.CPilot.takeProfitSeconds
    });

    console.log('[CPilot] AutoTrader started');
  });

  stopBtn.addEventListener('click', () => {
    if (window.Autotrader && typeof window.Autotrader.stop === 'function') {
      window.Autotrader.stop();
    }

    // UNLOCK interval
    document
      .querySelectorAll('input[name="tp-time"]')
      .forEach(r => r.disabled = false);

    startBtn.disabled = false;
    stopBtn.disabled  = true;

    console.log('[CPilot] AutoTrader stopped');
  });

})();
