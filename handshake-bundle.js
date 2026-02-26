// handshake-bundle.js
/* Hardened Handshake Bundle for QuantumTrader-AI
   - registerServiceWorker()
   - safeFetch() with timeout + retries
   - performHandshake()
   - payment verification flow (verifyPayment)
   - accessNode() with anti-double-click lock
   - heartbeat() to /status
   - medusaAutoRecover() placeholder (calls /recover)
   - refreshPaymentStatus on visibilitychange
*/

(function () {
  // CONFIG
  const HANDSHAKE_ENDPOINT = "/handshake";
  const VERIFY_PAYMENT_ENDPOINT = "/verify-payment"; // server should implement
  const MODULES_ENDPOINT = "/modules";
  const RECOVER_ENDPOINT = "/recover";
  const STATUS_ENDPOINT = "/status";
  const HEARTBEAT_INTERVAL = 30_000; // 30s
  const HANDSHAKE_TIMEOUT = 5000; // ms
  const FETCH_RETRIES = 2;
  let accessLock = false;
  let paymentStatus = false;

  // small helper: timeout fetch
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function safeFetch(url, opts = {}, retries = FETCH_RETRIES, timeoutMs = HANDSHAKE_TIMEOUT) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, { signal: controller.signal, ...opts });
        clearTimeout(id);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        if (attempt === retries) throw err;
        await timeout(300); // small backoff
      }
    }
  }

  // Register service worker safely
  async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js');
        console.log('ServiceWorker registered', reg);
      } catch (err) {
        console.warn('ServiceWorker registration failed', err);
      }
    }
  }

  // Backend handshake
  async function performHandshake() {
    try {
      const data = await safeFetch(HANDSHAKE_ENDPOINT, {}, 1);
      console.log('Handshake OK:', data);
      return true;
    } catch (err) {
      console.warn('Handshake failed (frontend)', err);
      return false;
    }
  }

  // Payment verification (calls server /verify-payment)
  async function verifyPayment(userRef) {
    // userRef optional; server can accept POST {userRef}
    try {
      const data = await safeFetch(VERIFY_PAYMENT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRef: userRef || null })
      }, 1);
      // Expect { confirmed: boolean, token?: string }
      if (data && data.confirmed) {
        localStorage.setItem('qtai_activated', 'true');
        paymentStatus = true;
        if (data.token) localStorage.setItem('qtai_token', data.token);
        return true;
      }
    } catch (err) {
      console.warn('Payment verify failed', err);
    }
    return false;
  }

  // Access node with anti-double-click and payment check
  async function accessNode(node) {
    if (accessLock) return;
    accessLock = true;
    setTimeout(() => (accessLock = false), 800);

    // Ensure payment status is current
    await refreshPaymentStatus();
    if (!paymentStatus) {
      // if not paid, scroll to payment section
      const el = document.getElementById('payment-section') || document.querySelector('#payment-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      alert('Access denied. Please complete your NGN10k activation payment.');
      return;
    }
    // If a token exists, include it in URL as short-lived param (optional)
    const token = localStorage.getItem('qtai_token');
    const url = token ? `${node}.html?tk=${encodeURIComponent(token)}` : `${node}.html`;
    window.location.href = url;
  }

  // Recheck payment status from localStorage and (optionally) backend
  async function refreshPaymentStatus() {
    paymentStatus = localStorage.getItem('qtai_activated') === 'true';
    // optionally re-verify with server when offline/uncertain
    if (!paymentStatus) {
      try {
        // a quick HEAD/GET to verify endpoint
        const status = await safeFetch('/payment-status', {}, 0).catch(() => null);
        if (status && status.activated) {
          localStorage.setItem('qtai_activated', 'true');
          paymentStatus = true;
        }
      } catch (e) {
        // ignore
      }
    }
    // update UI if present
    try {
      const display = document.getElementById('activation-state');
      if (display) {
        if (paymentStatus) {
          display.textContent = '✓ Activation Verified — Full Access Granted.';
          display.style.color = '#1abc9c';
        } else {
          display.textContent = '✗ Not Activated — Restricted Mode.';
          display.style.color = '#e74c3c';
        }
      }
    } catch (e) { /* noop */ }
    return paymentStatus;
  }

  // Heartbeat to server
  let hbTimer = null;
  async function startHeartbeat() {
    hbTimer = setInterval(async () => {
      try {
        const s = await safeFetch(STATUS_ENDPOINT, {}, 0);
        if (s && s.status === 'ok') {
          console.log('Heartbeat OK', new Date().toISOString());
        }
      } catch (err) {
        console.warn('Heartbeat failed; invoking Medusa recovery', err);
        medusaAutoRecover();
      }
    }, HEARTBEAT_INTERVAL);
  }

  // Medusa: silent auto-repair hook (server-side /recover must accept)
  async function medusaAutoRecover() {
    console.log('Medusa™: attempting silent recovery...');
    try {
      await safeFetch(RECOVER_ENDPOINT, { method: 'POST' }, 1);
      console.log('Medusa™: recover invoked.');
    } catch (err) {
      console.warn('Medusa™: recovery invocation failed', err);
    }
  }

  // Initialize module registry from server
  async function initModules() {
    try {
      const list = await safeFetch(MODULES_ENDPOINT, {}, 1);
      // Optionally render module statuses
      if (list && Array.isArray(list.modules)) {
        const container = document.getElementById('module-list');
        if (container) container.innerHTML = list.modules.map(m => `• ${m}`).join('<br>');
      }
    } catch (err) {
      console.warn('initModules failed', err);
    }
  }

  // Visibility handling: refresh payment token & status
  function installVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refreshPaymentStatus();
      }
    });
  }

  // Public / attach to window for use from HTML buttons
  window.QTAI = {
    performHandshake,
    registerServiceWorker,
    verifyPayment,
    accessNode,
    refreshPaymentStatus,
    startHeartbeat,
    initModules,
    medusaAutoRecover
  };

  // Auto-run (best-effort)
  (async function boot() {
    registerServiceWorker().catch(() => {});
    await performHandshake().catch(() => {});
    await refreshPaymentStatus().catch(() => {});
    initModules().catch(() => {});
    startHeartbeat();
    installVisibilityHandler();
    console.log('Handshake bundle initialized.');
  })();
})();
