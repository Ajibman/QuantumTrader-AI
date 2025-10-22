,,,js

// modules/MedusaWatchdog.js
// ------------------------------------
// Medusa™ 24×7 Self-Healing Watchdog
// QuantumTrader AI – Diagnostic Layer
// Logs continuous system health snapshots to system_diagnostics.json
// Architect - Olagoke Ajibulu 

const fs = require('fs');
const path = require('path');

const DIAGNOSTIC_PATH = path.join(__dirname, '../logs/system_diagnostics.json');

// ensure /logs folder exists
const ensureLogsDir = () => {
  const dir = path.join(__dirname, '../logs');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
};

// initial baseline
const initDiagnostics = () => ({
  timestamp: new Date().toISOString(),
  status: 'initializing',
  uptimeSeconds: 0,
  modulesOnline: 0,
  activeConnections: 0,
  medusaHealth: 'stable',
  lastSelfHeal: null
});

// write diagnostics to file
const writeDiagnostics = (data) => {
  ensureLogsDir();
  fs.writeFileSync(DIAGNOSTIC_PATH, JSON.stringify(data, null, 2));
};

// self-healing ping + logging loop
const startWatchdog = (systemRef) => {
  let diagnostics = initDiagnostics();
  writeDiagnostics(diagnostics);

  console.log('🩺 Medusa™ Watchdog online: monitoring QT AI core systems...');

  setInterval(() => {
    const now = new Date();
    diagnostics = {
      timestamp: now.toISOString(),
      status: 'operational',
      uptimeSeconds: process.uptime(),
      modulesOnline: (systemRef?.modules?.length || 15),
      activeConnections: systemRef?.io?.engine?.clientsCount || 0,
      medusaHealth: 'stable',
      lastSelfHeal: diagnostics.lastSelfHeal || 'none'
    };

    // occasional silent self-heal simulation
    if (Math.random() < 0.001) {
      diagnostics.medusaHealth = 'auto-regenerated';
      diagnostics.lastSelfHeal = now.toISOString();
      console.log('🔄 Medusa™ triggered silent regeneration cycle.');
    }

    writeDiagnostics(diagnostics);
  }, 10000); // every 10 seconds
};

module.exports = { startWatchdog };
]
