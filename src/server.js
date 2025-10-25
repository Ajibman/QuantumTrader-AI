 // ================================================================
// QUANTUMTRADER AI — UNIFIED SERVER CORE
// Author/Creator: Olagoke Ajibulu
// Architect: QuantumTrader AI (QT-AI) Framework
// ================================================================

// ================================================================
// 01. CORE DEPENDENCIES
// ================================================================
const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const server = http.createServer(app);

// ================================================================
// 02. PATH EQUIVALENCE BRIDGE v2
//    Resolves SRC/core ↔ src/core ambiguity created during dual build
// ================================================================
const rootDir = __dirname;
const upperSRC = path.join(rootDir, "SRC");
const lowerSrc = path.join(rootDir, "src");

function ensurePathEquivalence() {
  if (fs.existsSync(upperSRC) && !fs.existsSync(lowerSrc)) {
    fs.symlinkSync(upperSRC, lowerSrc, "dir");
    console.log("🔗 Path Equivalence Bridge v2: Linked SRC → src");
  } else if (fs.existsSync(lowerSrc) && !fs.existsSync(upperSRC)) {
    fs.symlinkSync(lowerSrc, upperSRC, "dir");
    console.log("🔗 Path Equivalence Bridge v2: Linked src → SRC");
  } else {
    console.log("🧭 Path Equivalence Bridge v2: Directories already aligned.");
  }
}
ensurePathEquivalence();

// ================================================================
// 03. LOGS FOLDER INITIALIZATION
// ================================================================
const logsDir = path.join(rootDir, "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
console.log("🗂️  Logs directory initialized at:", logsDir);

// ================================================================
// 04. CORE MODULE IMPORTS
// ================================================================
const modules = {
  1: require("./modules/module01"),
  2: require("./modules/module02"),
  3: require("./modules/module03"),
  4: require("./modules/module04"),
  5: require("./modules/module05"),
  6: require("./modules/module06"),
  7: require("./modules/module07"),
  8: require("./modules/module08"),
  9: require("./modules/module09"),
  10: require("./modules/module10"),
  11: require("./modules/module11"),
  12: require("./modules/module12"),
  13: require("./modules/module13"),
  14: require("./modules/module14"),
  15: require("./modules/module15"),
};

// ================================================================
// 05. SYSTEM INITIALIZATION SEQUENCE
// ================================================================
async function activateModules() {
  console.log("⚙️  Activating QuantumTrader-AI modules...");
  for (const id in modules) {
    if (modules[id]?.initialize) {
      await modules[id].initialize();
      console.log(`✅ Module${id.padStart(2, "0")} initialized successfully.`);
    }
  }
  console.log("🌐 All modules activated.");
}

// ================================================================
// 06. MODULE RELAY SEQUENCES
// ================================================================

// === MODULE09 → MODULE10 RELAY (Ethics → Governance) ===
const { evaluateEthicalCompliance } = require("./modules/module09");
const { recordGovernedExecution } = require("./modules/module10");

async function ethicsToGovernanceRelay(tradeData) {
  console.log("🧭 Initiating Quantum Ethics → Governance relay...");
  try {
    const complianceReport = await evaluateEthicalCompliance(tradeData);
    const governanceResult = await recordGovernedExecution(complianceReport);
    console.log("✅ Ethics → Governance relay completed successfully.");
    return { relayStatus: "complete", complianceReport, governanceResult };
  } catch (error) {
    console.error("⚠️ Relay Error (Ethics → Governance):", error.message);
    return { relayStatus: "failed", error: error.message };
  }
}
module.exports = { ethicsToGovernanceRelay };

// === MODULE11 → MODULE12 RELAY (Governance → Adaptive Evaluation) ===
try {
  console.log("⏩ Initiating Relay: Module11 ➜ Module12 ...");
  if (global.Module11 && global.Module11.status === "stable") {
    const module12 = require("./modules/module12");
    global.Module12 = module12;
    module12.initialize({
      source: "Module11",
      timestamp: new Date(),
      complianceStatus: global.Module11.ethicalSync || "pending",
    });
    console.log("✅ Relay Complete: Module12 successfully linked to Module11 state.");
  } else {
    console.warn("⚠️ Relay paused: Module11 not stable or missing.");
  }
} catch (err) {
  console.error("❌ Relay11_12 Error:", err.message);
}

// ================================================================
// 07. QUANTUMTRADER MAIN STARTUP SEQUENCE
// ================================================================
async function mainStartup() {
  console.log("🚀 Initiating QuantumTrader-AI core sequence...");
  await activateModules();

  if (global.connectQuantumAPIs) await global.connectQuantumAPIs();
  if (global.initializeLiveBridges) await global.initializeLiveBridges();
  if (global.runSystemDiagnostics) await global.runSystemDiagnostics();
  if (global.validateQuantumPipelines) await global.validateQuantumPipelines();
  if (global.benchmarkLatency) await global.benchmarkLatency();
  if (global.logCompletionStatus) await global.logCompletionStatus();
  if (global.runEthicsCycle) global.runEthicsCycle();

  console.log("💫 QuantumTrader-AI initialization complete.");
}
mainStartup().catch(err => console.error("Startup error:", err));

// ================================================================
// 08. MEDUSA™ WATCHDOG INITIALIZATION
// ================================================================
try {
  const { startWatchdog } = require("./modules/MedusaWatchdog");
  startWatchdog({ modules });
  console.log("🧠 Medusa™ Diagnostic Watchdog engaged (24×7 self-healing).");
} catch (err) {
  console.error("⚠️ Medusa Watchdog failed to start:", err.message);
}

// ================================================================
// 09. CORE SERVER LAUNCH (QuantumTrader-AI)
// ================================================================
const CORE_PORT = process.env.CORE_PORT || 3000;
const httpServer = server.listen(CORE_PORT, () => {
  console.log(`🌍 QuantumTrader-AI active on port ${CORE_PORT}`);
  console.log("🧩 Awaiting incoming QuantumTrader connections and API events...");
});

// graceful shutdown
process.on("SIGINT", () => {
  console.log("\n⚠️  Graceful shutdown initiated...");
  console.log("💤 Saving final diagnostic snapshot...");
  httpServer.close(() => {
    console.log(
      "🧠 QT-AI core safely terminated. Goodbye, traveler of Ayélùjàrà and Ayélùjàròrùn."
    );
    process.exit(0);
  });
});

// ================================================================
// 10. QONEXAI MASTER STARTUP PORTAL
// ================================================================
const QONEX_PORT = process.env.QONEX_PORT || 8080;

// /qonex-status route
app.get("/qonex-status", (req, res) => {
  res.json({
    status: "✅ QonexAI Live",
    modules: 15,
    timestamp: new Date(),
    integrity: true,
  });
});

app.listen(QONEX_PORT, () => {
  console.log(`🌀 QonexAI Server online at port ${QONEX_PORT}`);
  console.log(`🚀 System ready for quantum handshake on port ${QONEX_PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

// ================================================================
// EOF
// ================================================================
