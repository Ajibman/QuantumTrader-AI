/* =========================
   CPilot Full 4-Step Controller
   Authoritative, modular, drop-in
   ========================= */

(function() {
  // ----------------------
  // STEP 1 — Signal Definition
  // ----------------------
  function mapToSeconds(value) {
    const num = parseInt(value, 10);
    if (value.endsWith('s')) return num;
    if (value.endsWith('m')) return num * 60;
    if (value.endsWith('h')) return num * 3600;
    if (value.endsWith('d')) return num * 86400;
    return null;
  }

  function buildSignalFromUI() {
    const tpRadio = document.querySelector('input[name="tp-time"]:checked');
    const modeRadio = document.querySelector('input[name="trade-type"]:checked');

    return {
      mode: modeRadio.value, // "auto" | "manual"
      tp: {
        duration: mapToSeconds(tpRadio.value),
        label: tpRadio.value
      },
      strategy: "default",
      source: "cpilot",
      issuedAt: Date.now()
    };
  }

  // ----------------------
  // STEP 2 — Execution Gate (Permission Boundary)
  // ----------------------
  const ExecutionGate = {
    evaluate: function(context) {
      if (!context.system.cpilotReady) return { allowed: false, reason: "CPilot not ready" };
      if (context.access.locked) return { allowed: false, reason: "Access locked" };
      if (!context.mode.autotrade) return { allowed: false, reason: "Auto Trade not selected" };
      if (!context.signal.valid) return { allowed: false, reason: "Take-profit interval not selected" };
      if (!context.traderLab.autotradeAllowed) return { allowed: false, reason: "TraderLab permission denied" };
      if (context.traderLab.expiry && context.traderLab.expiry < Date.now()) return { allowed: false, reason: "TraderLab access expired" };
      return { allowed: true };
    }
  };

  // ----------------------
  // STEP 3 — Run / Stop + Lock / Unlock Controller
  // ----------------------
  const startBtn = document.getElementById('start-autotrade-btn');
  const stopBtn = document.getElementById('stop-autotrade-btn');
  const tpRadios = document.querySelectorAll('input[name="tp-time"]');

  const CPilotController = {
    access: { locked: false, runEnabled: true, running: false },
    lock: function() {
      tpRadios.forEach(r => r.disabled = true);
      this.access.locked = true;
      this.access.running = true;
      startBtn.disabled = true;
      stopBtn.disabled = false;
    },
    unlock: function() {
      tpRadios.forEach(r => r.disabled = false);
      this.access.locked = false;
      this.access.running = false;
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  };

  // ----------------------
  // STEP 4 — Autotrader Execution
  // ----------------------
  window.Autotrader = {
    activeSignal: null,
    timer: null,
    start: function(signal) {
      this.activeSignal = signal;
      console.log("[Autotrader] RUNNING with signal:", signal);
      // Example timer simulation
      this.timer = setTimeout(() => {
        console.log("[Autotrader] COMPLETED signal:", signal.tp.label);
        CPilotController.unlock();
      }, signal.tp.duration * 1000);
    },
    stop: function() {
      clearTimeout(this.timer);
      console.log("[Autotrader] STOPPED manually.");
      this.activeSignal = null;
      CPilotController.unlock();
    }
  };

  // ----------------------
  // Step 3 Event Wiring
  // ----------------------
  startBtn.addEventListener('click', () => {
    const signal = buildSignalFromUI();

    const context = {
      mode: { autotrade: signal.mode === "auto", manual: signal.mode === "manual" },
      signal: { ...signal, valid: !!signal.tp.duration },
      traderLab: window.TraderLab || { passed: true, autotradeAllowed: true, expiry: null },
      access: CPilotController.access,
      system: { cpilotReady: true, environment: "production" }
    };

    const verdict = ExecutionGate.evaluate(context);
    if (!verdict.allowed) return alert(verdict.reason);

    CPilotController.lock();
    window.Autotrader.start(signal);
  });

  stopBtn.addEventListener('click', () => {
    window.Autotrader.stop();
  });

})();
