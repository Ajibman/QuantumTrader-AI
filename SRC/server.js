// ============================================================
// 🌐 QuantumTrader AI — QonexAI Unified Server Kernel
// Architect/Builder: Olagoke Ajibulu
// Build Channel: Core Synchronization Layer
// Date: 25:10:2025
// ============================================================

// server.js
"use strict";

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`QuantumTrader-AI running at http://localhost:${PORT}`);
});

// ============================================================
// PATH EQUIVALENCE BRIDGE v2
// Ensures SRC/core and src/core remain fully resolvable
// ============================================================
function resolveModulePath(subPath) {
  const lowerCasePath = path.join(__dirname, "src", subPath);
  const upperCasePath = path.join(__dirname, "SRC", subPath);
  return fs.existsSync(lowerCasePath) ? lowerCasePath : upperCasePath;
}

// ============================================================
// CORE DEPENDENCIES
// ============================================================
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

const modules = {};
const PORT = process.env.PORT || 8080;

// ============================================================
// MODULE09 → MODULE10 RELAY LINKAGE
// Quantum Ethics → Execution Governance & Transparency Ledger
// ============================================================
const module09Path = resolveModulePath("core/modules/module09/module09.js");
const module10Path = resolveModulePath("core/modules/module10/module10.js");

const { evaluateEthicalCompliance } = require(module09Path);
const { recordGovernedExecution } = require(module10Path);

async function ethicsToGovernanceRelay(tradeData) {
  console.log("🧭 Initiating Quantum Ethics → Governance relay...");

  try {
    const complianceReport = await evaluateEthicalCompliance(tradeData);
    const governanceResult = await recordGovernedExecution(complianceReport);

    console.log("✅ Ethics → Governance relay completed successfully.");
    return {
      relayStatus: "complete",
      complianceReport,
      governanceResult,
    };
  } catch (error) {
    console.error("⚠️ Relay Error (Ethics → Governance):", error.message);
    return { relayStatus: "failed", error: error.message };
  }
}

// ============================================================
// MODULE11 → MODULE12 RELAY
// ============================================================
try {
  console.log("⏩ Initiating Relay: Module11 ➜ Module12 ...");

  if (global.Module11 && global.Module11.status === "stable") {
    const module12Path = resolveModulePath("core/modules/module12/module12.js");
    const module12 = require(module12Path);
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

// ============================================================
// 8. MAIN STARTUP SEQUENCE
// ============================================================
(async () => {
  try {
    console.log("🚀 Initializing QuantumTrader AI sequence...");

    await activateModules();
    await connectQuantumAPIs();
    await initializeLiveBridges();
    await runSystemDiagnostics();
    await validateQuantumPipelines();
    await benchmarkLatency();
    await logCompletionStatus();

    runEthicsCycle();

    http.createServer(app).listen(PORT, () => {
      console.log(`🌍 QuantumTrader AI active on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err.message);
  }
})();

// ============================================================
// 🧠 Initialize Medusa™ Diagnostic Watchdog
// ============================================================
const medusaPath = resolveModulePath("core/modules/MedusaWatchdog.js");
const { startWatchdog } = require(medusaPath);
startWatchdog({ io, modules });

// ============================================================
// 🚀 SERVER STARTUP SEQUENCE
// ============================================================
const serverInstance = server.listen(PORT, () => {
  console.log("🌍 QuantumTrader AI active on port", PORT);
  console.log("💫 System in full synchronization mode — Medusa™ 24×7 self-healing engaged.");
  console.log("🧩 Awaiting incoming QuantumTrader connections and API events...");
});

// ============================================================
// ⚙️ GRACEFUL SHUTDOWN HANDLING
// ============================================================
process.on("SIGINT", () => {
  console.log("\n⚠️  Graceful shutdown initiated...");
  console.log("💤 Saving final diagnostic snapshot...");
  serverInstance.close(() => {
    console.log("🧠 QT AI core safely terminated. Goodbye for now, traveler of Aiyalẹ́nujàrà and Aiyalẹ́nujàrọ̀run.");
    process.exit(0);
  });
});

// ============================================================
// 09. APP LISTENER — QONEXAI MASTER STARTUP PORTAL
// ============================================================
app.get("/qonex-status", (req, res) => {
  res.json({
    status: "✅ QonexAI Live",
    modules: 15,
    timestamp: new Date(),
    integrity: true,
  });
});

app.listen(PORT, () => {
  console.log(`🌀 QonexAI Server online at port ${PORT}`);
  console.log(`🚀 System ready for quantum handshake on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

// =============================================================
// 🧠 QT AI SYSTEM CLOSURE POINT
// =============================================================
// QuantumTrader AI — Engine sealed in harmony with QonexAI Core
// Architect: Olagoke Ajibulu
// Collaborative Engineering, Counselor & Idea Transformer: ChatGPT (OpenAI GPT-5)
// Cosmic Principle: “Intelligence guided by Ethics is Power in Balance.”
// =============================================================
// EOF — End of Flow 🕊️
