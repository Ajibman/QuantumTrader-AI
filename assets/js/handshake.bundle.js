/* assets/js/handshake.bundle.js
   Hardened Handshake Bundle for QuantumTrader-AI
   - safeFetch with timeout + retries
   - service worker registration
   - handshake + module init
   - payment verification + token handling
   - accessNode with anti-double-tap lock
   - heartbeat + Medusa™ auto-recovery hook
   - visibility refresh for payment state
   Exposes window.QTAI API for UI bindings.
*/

(function () {
  // ---------- CONFIG ----------
  const ENDPOINTS = {
    handshake: "/handshake",
    verifyPayment: "/verify-payment",
    modules: "/modules",
    recover: "/recover",
    status: "/status",
    paymentStatus: "/payment-status",
    activate: "/activate"
  };
  const HEARTBEAT_INTERVAL_MS = 30_000; // 30s
  const HANDSHAKE_TIMEOUT_MS = 5000;
  const FETCH_RETRIES = 2;

  // ---------- STATE ----------
  let accessLock = false;
  let paymentStatus = (localStorage.getItem('qtai_activated') === 'true');
  let hbTimer = null;

  // ---------- HELPERS ----------
  const wait = ms => new Promise(r => setTimeout(r, ms));

  async function safeFetch(url, opts = {}, retries = FETCH_RETRIES, timeoutMs = HANDSHAKE_TIMEOUT_MS) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        const response = await fetch(url, { signal: controller.signal, ...opts });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // Try to parse JSON but guard
        const text = await response.text();
        try { return JSON.parse(text); } catch(e) { return text; }
      } catch (err) {
        if (attempt === retries) throw err;
        await wait(300 + attempt * 200);
      }
    }
  }

  // ---------- SW ----------
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js');
        console.log('ServiceWorker registered', reg.scope || reg);
      } catch (err) {
        console.warn('SW registration failed', err);
      }
    }
  }

  // ---------- HANDSHAKE ----------
  async function performHandshake() {
    try {
      const r = await safeFetch(ENDPOINTS.handshake, {}, 1);
      console.log('Handshake OK', r);
      return true;
    } catch (err) {
      console.warn('Handshake failed', err);
      return false;
    }
  }

  // ---------- MODULES (init) ----------
  async function initModulesRender() {
    try {
      const payload = await safeFetch(ENDPOINTS.modules, {}, 1);
      if (payload && Array.isArray(payload.modules)) {
        const container = document.getElementById('module-list');
        if (container) container.innerHTML = payload.modules.map(m => `• ${m}`).join('<br>');
        console.log('Modules loaded');
      }
    } catch (err) {
      console.warn('initModulesRender failed', err);
    }
  }

  // ---------- PAYMENT VERIFICATION ----------
  // server expected to verify and optionally return {confirmed: boolean, token: string}
  async function verifyPayment(userRef = null) {
    try {
      const res = await safeFetch(ENDPOINTS.verifyPayment, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRef })
      }, 1);
      if (res && res.confirmed) {
        localStorage.setItem('qtai_activated', 'true');
        if (res.token) localStorage.setItem('qtai_token', res.token);
        paymentStatus = true;
        updateActivationUI(true);
        return true;
      }
    } catch (err) {
      console.warn('verifyPayment error', err);
    }
    paymentStatus = false;
    updateActivationUI(false);
    return false;
  }

  // ---------- REFRESH PAYMENT STATUS ----------
  async function refreshPaymentStatus() {
    // Quick local check
    paymentStatus = (localStorage.getItem('qtai_activated') === 'true');
    // If false, do a light server check (no retries)
    if (!paymentStatus) {
      try {
        const srv = await safeFetch(ENDPOINTS.paymentStatus, {}, 0).catch(() => null);
        if (srv && srv.activated) {
          localStorage.setItem('qtai_activated', 'true');
          paymentStatus = true;
        }
      } catch (e) { /* ignore */ }
    }
    updateActivationUI(paymentStatus);
    return paymentStatus;
  }

  // ---------- UI UPDATE ----------
  function updateActivationUI(isActive) {
    const el = document.getElementById('activation-state');
    if (!el) return;
    if (isActive) {
      el.textContent = '✓ Activation Verified — Full Access Granted.';
      el.style.color = '#1abc9c';
    } else {
      el.textContent = '✗ Not Activated — Restricted Mode.';
      el.style.color = '#e74c3c';
    }
  }

  // ---------- ACCESS NODE (anti-double) ----------
  async function accessNode(node) {
    if (accessLock) return;
    accessLock = true;
    setTimeout(() => accessLock = false, 800);

    await refreshPaymentStatus();

    if (!paymentStatus) {
      // bring payment UI into view if present
      const paymentEl = document.getElementById('payment-section');
      if (paymentEl) paymentEl.scrollIntoView({ behavior: 'smooth' });
      alert('Access denied. Please complete your NGN10k activation payment.');
      return false;
    }

    // Attach token if present
    const token = localStorage.getItem('qtai_token');
    const url = token ? `${node}.html?tk=${encodeURIComponent(token)}` : `${node}.html`;
    window.location.href = url;
    return true;
  }

  // ---------- HEARTBEAT + MEDUSA ----------
  async function heartbeat() {
    try {
      const s = await safeFetch(ENDPOINTS.status, {}, 0);
      if (s && s.status === 'ok') {
        // console.log('Heartbeat ok', new Date().toISOString());
        return true;
      }
    } catch (err) {
      console.warn('Heartbeat failed', err);
      medusaAutoRecover();
    }
    return false;
  }

  function startHeartbeat() {
    if (hbTimer) clearInterval(hbTimer);
    hbTimer = setInterval(() => heartbeat().catch(() => {}), HEARTBEAT_INTERVAL_MS);
  }

  async function medusaAutoRecover() {
    try {
      console.log('Medusa™ auto-recover invoked');
      await safeFetch(ENDPOINTS.recover, { method: 'POST' }, 1);
      // after recovery attempt, refresh handshake & modules
      await performHandshake();
      initModulesRender();
    } catch (err) {
      console.warn('Medusa recovery failed', err);
    }
  }

  // ---------- VISIBILITY HANDLER ----------
  function installVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // refresh state when user comes back
        refreshPaymentStatus().catch(() => {});
      }
    });
  }

  // ---------- PUBLIC API ----------
  window.QTAI = {
    performHandshake,
    registerServiceWorker,
    verifyPayment,
    accessNode,
    refreshPaymentStatus,
    startHeartbeat,
    initModules: initModulesRender,
    medusaAutoRecover
  };

  // ---------- BOOTSEQUENCE (best-effort) ----------
  (async function boot() {
    try {
      registerServiceWorker();
    } catch (e) { /* continue */ }

    try {
      await performHandshake();
    } catch (e) { /* continue */ }

    try {
      await refreshPaymentStatus();
    } catch (e) { /* continue */ }

    try {
      await initModulesRender();
    } catch (e) { /* continue */ }

    startHeartbeat();
    installVisibilityHandler();
    console.log('handshake.bundle.js initialized');
  })();

})();
