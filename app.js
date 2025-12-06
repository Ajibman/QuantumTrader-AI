 // ======================================================
// QuantumTrader AI™ — app.js (browser-safe)
// Visionary, Architect & Builder: Olagoke Ajibulu
// - Replaces server-side import with HTTP handshake calls
// - CSS-based X-axis globe rotation (20s)
// - Defensive DOM checks and robust activation flow
// ======================================================

/* global fetch, localStorage, requestAnimationFrame */

document.addEventListener('DOMContentLoaded', () => {
  console.log("🚀 QuantumTrader AI (app.js) starting…");

  // ---------- Helpers ----------
  const safe = (fn) => { try { return fn(); } catch (e) { return undefined; } };

  async function callHandshakeBundle() {
    // Browser -> backend handshake that returns small bundle
    try {
      const res = await fetch('/api/handshake-bundle', { method: 'GET', cache: 'no-cache' });
      if (!res.ok) throw new Error(`Handshake bundle failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("🤝 Handshake bundle error:", err);
      return null;
    }
  }

  async function callHandshake() {
    try {
      const res = await fetch('/handshake', { method: 'GET', cache: 'no-cache' });
      if (!res.ok) throw new Error(`Handshake failed: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("🤝 Handshake error:", err);
      return null;
    }
  }

  async function activateServer(userId = 'local-user') {
    try {
      const res = await fetch('/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error(`Activate endpoint returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("⚠️ Activate server error:", err);
      return null;
    }
  }

  async function verifyPayment(userRef) {
    try {
      const res = await fetch('/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRef })
      });
      if (!res.ok) throw new Error(`Verify-payment returned ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("⚠️ verifyPayment error:", err);
      return null;
    }
  }

  // ---------- Node references (defensive) ----------
  const activationBtn = document.getElementById('activateQT');
  const modules = document.querySelectorAll('.floor-modules .module');
  const trays = Array.from(document.querySelectorAll('.horizontal-trays .tray'));
  const globe = document.querySelector('.rotating-globe');
  const oriOlokun = document.querySelector('.ori-olokun');

  // ---------- Activation flow ----------
  async function handleActivateClick() {
    if (!activationBtn) return;
    activationBtn.disabled = true;
    const originalText = activationBtn.textContent;
    activationBtn.textContent = "Initializing Quantum Systems…";

    // 1) handshake bundle (fast)
    const bundle = await callHandshakeBundle();
    if (!bundle) {
      // fallback to basic handshake
      const hs = await callHandshake();
      if (!hs) {
        activationBtn.textContent = "Handshake failed — retry";
        activationBtn.disabled = false;
        console.warn("Activation aborted: handshake failure.");
        return;
      }
    }

    // 2) (Optional) show payment modal or redirect to payment gateway here.
    // For now we call /activate to issue a test token (server must implement it).
    const activationResp = await activateServer('web-activation-test');
    if (activationResp && activationResp.token) {
      // store token and mark activated
      localStorage.setItem('qtai_token', activationResp.token);
      localStorage.setItem('qtai_activated', 'true');
      activationBtn.textContent = "QuantumTrader AI Activated ✓";
      activationBtn.classList.add('qt-activated');
      console.log("✅ Activation successful — token stored.");
    } else {
      activationBtn.textContent = "Activation pending — complete payment";
      activationBtn.disabled = false;
      console.warn("Activation endpoint did not confirm. Payment required.");
    }
  }

  if (activationBtn) {
    activationBtn.removeEventListener('click', handleActivateClick); // safe remove
    activationBtn.addEventListener('click', handleActivateClick);
  }

  // ---------- Trading Floor module interactions ----------
  if (modules && modules.length) {
    modules.forEach(mod => {
      mod.addEventListener('mouseenter', () => mod.classList.add('module-hovered'));
      mod.addEventListener('mouseleave', () => mod.classList.remove('module-hovered'));
      // optional click: if module links need activation gating
      mod.addEventListener('click', () => {
        const isActive = localStorage.getItem('qtai_activated') === 'true';
        if (!isActive) {
          alert("Access locked — please activate first.");
          window.location.hash = "#activation"; // quick nudge
        } else {
          // navigation logic - example: open module page if exists
          const moduleId = mod.id;
          console.log(`▶ Entering ${moduleId}`);
          // window.location.href = `/modules/${moduleId}.html`;
        }
      });
    });
  }

  // ---------- Horizontal trays auto scroll (robust) ----------
  if (trays.length) {
    let pos = 0;
    let lastFrame = performance.now();

    function step(now) {
      const dt = Math.min(40, now - lastFrame); // ms (cap)
      lastFrame = now;
      pos -= (dt / 45) * 0.6; // pace scaled by dt — smooth
      // apply transform and reset when too far
      trays.forEach(t => t.style.transform = `translateX(${Math.floor(pos)}px)`);
      // normalize to avoid overflow of the number
      if (Math.abs(pos) > 100000) pos = 0;
      // simple reset loop: if left-most tray completely scrolled out, reset
      const first = trays[0];
      if (first && first.getBoundingClientRect().right < -50) {
        pos = 0;
        trays.forEach(t => t.style.transform = 'translateX(0px)');
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---------- Globe rotation (X-axis vertical spin; 20s full rotation) ----------
  if (globe) {
    // ensure 3D preserved and smooth hardware accelerated animation
    globe.style.transformStyle = 'preserve-3d';
    globe.style.backfaceVisibility = 'hidden';

    // Inject keyframes if not already present (idempotent)
    const styleId = 'qtai-globe-keyframes';
    if (!document.getElementById(styleId)) {
      const s = document.createElement('style');
      s.id = styleId;
      s.textContent = `
      @keyframes qtai-globe-rotate-x {
        from { transform: rotateX(0deg); }
        to { transform: rotateX(360deg); }
      }`;
      document.head.appendChild(s);
    }

    // apply animation (20s, linear, infinite)
    globe.style.animation = 'qtai-globe-rotate-x 20s linear infinite';
    globe.style.willChange = 'transform';
    // gently reduce 2D rotation if present
    globe.style.transform = 'translateZ(0)';
  }

  // ---------- Ori Olokun pulse (gentle) ----------
  if (oriOlokun) {
    // Ensure a lightweight CSS pulse exists
    const pulseStyleId = 'qtai-ori-pulse';
    if (!document.getElementById(pulseStyleId)) {
      const s = document.createElement('style');
      s.id = pulseStyleId;
      s.textContent = `
        @keyframes qtai-ori-pulse {
          0% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.04); opacity: 1; }
          100% { transform: scale(1); opacity: 0.95; }
        }
      `;
      document.head.appendChild(s);
    }

    setInterval(() => {
      oriOlokun.style.animation = 'qtai-ori-pulse 1.0s ease-in-out';
      setTimeout(() => { oriOlokun.style.animation = ''; }, 1000);
    }, 5500);
  }

  // ---------- Short runtime status ----------
  console.log("✅ app.js: bindings established.");
  // show activation state if present
  if (localStorage.getItem('qtai_activated') === 'true' && activationBtn) {
    activationBtn.textContent = "QuantumTrader AI Activated ✓";
    activationBtn.classList.add('qt-activated');
  }
});
