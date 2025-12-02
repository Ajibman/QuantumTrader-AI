// ======================================================
// QuantumTrader AI™ — app.js
// Visionary, Architect & Builder: Olagoke Ajibulu
// ======================================================

// =============== 1. Activation Gate ===================
const activationBtn = document.getElementById('activateQT');

activationBtn?.addEventListener('click', async () => {
  console.log("🚀 QuantumTrader AI Activation Initiated…");

  activationBtn.disabled = true;
  activationBtn.textContent = "Initializing Quantum Systems…";

  try {
    // Trigger handshake
    const handshake = await import('./server.mjs');
    if (handshake.handshakeWithServer) {
      await handshake.handshakeWithServer();
      console.log("🤝 Handshake with QT-AI Server Completed.");
    } else {
      console.warn("⚠️ handshakeWithServer() not found in server.mjs");
    }
  } catch (err) {
    console.error("❌ Handshake Import Error:", err);
  }

  // Visual activation confirmation
  activationBtn.textContent = "QuantumTrader AI Activated ✓";
  activationBtn.classList.add("qt-activated");
});


// =============== 2. Trading Floor: Module Effects ===================

const modules = document.querySelectorAll('.floor-modules .module');

modules.forEach(mod => {
  mod.addEventListener('mouseenter', () => {
    mod.classList.add('module-hovered');
  });

  mod.addEventListener('mouseleave', () => {
    mod.classList.remove('module-hovered');
  });
});


// =============== 3. Horizontal Tray Auto-Scroll =====================

const trays = document.querySelectorAll('.horizontal-trays .tray');

let trayPosition = 0;
function scrollTrays() {
  trayPosition -= 1; // smooth inward drift
  trays.forEach(t => {
    t.style.transform = `translateX(${trayPosition}px)`;
  });
}

setInterval(scrollTrays, 45); // smooth, stable movement


// =============== 4. Globe Rotation Controller =======================

const globe = document.querySelector('.rotating-globe');

if (globe) {
  let globeRotation = 0;

  function rotateGlobe() {
    globeRotation += 0.15;
    globe.style.transform = `rotate(${globeRotation}deg)`;
  }

  setInterval(rotateGlobe, 20);
}


// =============== 5. Ori Olokun Footer Pulse =========================

const oriOlokun = document.querySelector('.ori-olokun');
if (oriOlokun) {
  setInterval(() => {
    oriOlokun.classList.add('pulse');
    setTimeout(() => oriOlokun.classList.remove('pulse'), 800);
  }, 5000);
}


// =============== QT-AI Console Identity =============================

console.log("==============================================");
console.log("🌐 QuantumTrader AI™");
console.log("🔧 Core Application Runtime Loaded (app.js)");
console.log("🧠 Architect: Olagoke Ajibulu");
console.log("==============================================");
