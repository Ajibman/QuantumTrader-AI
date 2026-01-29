/* CPilot STEP 3 — Run / Stop + Lock / Unlock */

(function () {

  const startBtn = document.getElementById('start-autotrade-btn');
  const stopBtn  = document.getElementById('stop-autotrade-btn');
  const tpRadios = document.querySelectorAll('input[name="tp-time"]');

  function lockIntervals(lock) {
    tpRadios.forEach(r => r.disabled = lock);
  }

  startBtn.addEventListener('click', () => {

    if (!window.CPilotGate) {
      console.warn('CPilot gate not available');
      return;
    }

    const gate = window.CPilotGate.check();
    if (!gate.ok) {
      alert(gate.reason);
      return;
    }

    if (typeof window.Autotrader.start !== 'function') {
      console.warn('Autotrader.start not implemented');
      return;
    }

    lockIntervals(true);
    startBtn.disabled = true;
    stopBtn.disabled  = false;

    window.Autotrader.start({
      takeProfitSeconds: window.CPilot.takeProfitSeconds
    });

    console.log('[CPilot] Autotrader RUNNING');
  });

  stopBtn.addEventListener('click', () => {

    if (window.Autotrader && typeof window.Autotrader.stop === 'function') {
      window.Autotrader.stop();
    }

    lockIntervals(false);
    startBtn.disabled = false;
    stopBtn.disabled  = true;

    console.log('[CPilot] Autotrader STOPPED');
  });

})();
