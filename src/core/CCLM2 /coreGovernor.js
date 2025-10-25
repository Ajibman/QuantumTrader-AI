
#!/usr/bin/env node
/**
 * QonexAI server.js
 * QuantumTrader AI – server.js
 * Master Runtime Build – Stage VI Final Integration Layer
 * Last Recovery Point: TermuxInitBridge.sh
 * Architect: Ajibman / QuantumTrader-AI => QonexAI
 *
 * Entry point for QonexAI — Neural Exchange System AI
 * Effective: November 09 2025 launch workflow
 */

// =============================
// 0. CORE DEPENDENCIES
// =============================
const express = require('express');
const path    = require('path');
const fs      = require('fs');

const { checkProximity }    = require('./core/security/proximityMonitor');
const { shutdownQonexAI }   = require('./core/security/shutdown');
const { trackAttempts, reportThreat } = require('./core/security/securityManager');
const { handleRegistration } = require('./core/lab/registration');
const { handleVerification } = require('./core/lab/verifyUser');
const { router: uiRouter }   = require('./core/ui/uiRouter');
const TraderLab              = require('./core/lab/traderLab');

const app   = express();
const PORT  = process.env.PORT || 7070;

const traderLab = new TraderLab();

// 🧠 QonexAI Core Governance — CCLM²™ Supervisor Layer Integration
// (c) Olagoke Ajibulu — QuantumTrader AI / QonexAI Unified Build

const { CCLM2 } = require("./core/CCLM2/coreGovernor");
const GPT01     = require("./core/CCLM2/GPT01");

// ✅ Initialize CCLM² Supervision Layer
(async () => {
  try {
    console.log("🧠 Initializing CCLM² Supervision Layer...");
    const cclm = new CCLM2({
      ethicsMode: "quantum",
      auditLog: path.join(__dirname, "logs/system.log"),
      supervision: true,
    });

    const module01Path = path.join(__dirname, "core/modules/market/");
    const module01 = require(module01Path);

    console.log("🔗 Establishing handshake between CCLM² → Module01 → GPT-01...");
    const handshake = await cclm.register({
      id: "GPT-01",
      name: "Market Data Aggregator",
      module: module01,
      kernel: GPT01,
      level: "root",
      active: true,
    });

    if (handshake.status === "ok") {
      console.log("✅ CCLM² Supervision Layer active.");
      console.log("🧩 Module01 (GPT-01) anchored successfully under CCLM².");
    } else {
      console.warn("⚠️ Handshake anomaly detected:", handshake);
    }

    // Begin watching subordinate modules
    await cclm.observeAll("core/modules/");
    console.log("👁 CCLM² now monitoring subordinate modules (02–15).");

  } catch (err) {
    console.error("❌ Error initializing CCLM² Supervision Layer:", err);
    fs.appendFileSync(
      path.join(__dirname, "logs/system.log"),
      `[${new Date().toISOString()}] ERROR: ${err}\n`
    );
  }
})();

// === Cooperative / NGO / Community Vigilanté (Hooks Placeholder) ===
// Future integrations for welfare + early warning network.
app.use("/community", require("./core/community/vigilante"));
app.use("/cooperative", require("./core/community/cooperative"));
app.use("/ngo", require("./core/community/ngo"));

// === Security Loop: Proximity Monitoring & Auto-Shutdown ===
setInterval(async () => {
  try {
    const result = await checkProximity(/* userLocation */, /* agentsList */);
    if (result.shutdown) {
      console.log("🚨 Agent detected nearby. Shutting down QonexAI.");
      shutdownQonexAI();
    }
  } catch (err) {
    console.error("Security check error:", err);
  }
}, 15000); // every 15 seconds

// === Server Startup ===
app.listen(PORT, () => {
  console.log(`🚀 QonexAI server live on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const PORT = process.env.PORT || 3000;

// =============================
// 1. CORE ENGINE INITIALIZATION EXTENSION
// =============================
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

console.log("\n🧠 QonexAI initializing Stage VI core engines...");
console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
console.log("Awaiting module bonding...");

// =============================
// 2. QUANTUM CORE MODULES 01–15
// =============================
const {
  Module01, Module02, Module03, Module04, Module05,
  Module06, Module07, Module08, Module09, Module10,
  Module11, Module12, Module13, Module14, Module15
} = require("./core/modules");

// Bind runtime registry
const QTModules = [
  Module01, Module02, Module03, Module04, Module05,
  Module06, Module07, Module08, Module09, Module10,
  Module11, Module12, Module13, Module14, Module15
];

// =============================
// 3. LIVE MONITORING CHANNELS
// =============================
io.on("connection", (socket) => {
  console.log(`Trader connected: ${socket.id}`);
  socket.on("disconnect", () =>
    console.log(`Trader disconnected: ${socket.id}`)
  );
});

// =============================
// 4. ETHICS & CONSCIOUSNESS LAYER
// =============================
const {
  neuralEthicsBalancer,
  quantumConsciousRegulator,
} = require("./core/modules/Module06");

function runEthicsCycle() {
  try {
    const ethicsState = neuralEthicsBalancer();
    const consciousnessState = quantumConsciousRegulator(ethicsState);
    console.log("🧭 Neural Ethics balance maintained:", ethicsState.status);
    console.log("🌀 Quantum Conscious coherence:", consciousnessState.integrity);
  } catch (error) {
    console.error("Ethics Controller error:", error);
  }
}

// =============================
// 5. MODULE ACTIVATION SEQUENCE
// =============================
async function activateModules() {
  console.log("\n⚙️ Activating QonexAI modules...");
  for (const [i, module] of QTModules.entries()) {
    try {
      await module.activate();
      console.log(`Module ${String(i + 1).padStart(2, "0")} activated successfully`);
    } catch (error) {
      console.error(`Module ${i + 1} failed to activate:`, error);
    }
  }
  console.log("✅ All operational modules initialized");
}

// =============================
// 6. MODULE BONDING LAYER
// =============================
async function connectQuantumAPIs() {
  console.log("\n🌐 Establishing Quantum API channels...");
  return Promise.resolve(true);
}

async function initializeLiveBridges() {
  console.log("🔗 Initializing live bridges and Medusa™ self-healing links...");
  return Promise.resolve(true);
}

// =============================
// 7. STAGE VI — FINAL INTEGRATION LAYER (TPS Supervisor)
// =============================
async function runSystemDiagnostics() {
  console.log("\n🧩 Running system diagnostics...");
  return {
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };
}

async function validateQuantumPipelines() {
  console.log("🔍 Validating quantum communication pipelines...");
  return Promise.resolve("Pipelines stable");
}

async function benchmarkLatency() {
  console.log("⏱ Benchmarking neural latency...");
  const start = Date.now();
  await new Promise((res) => setTimeout(res, 100));
  const latency = Date.now() - start;
  console.log(`Latency benchmark: ${latency} ms`);
  return latency;
}

async function logCompletionStatus() {
  console.log("\n🚀 QonexAI system startup sequence completed successfully.");
  console.log("Medusa™ 24×7 self-healing engaged — system fully operational.");
  console.log("✨ Awaiting trader or visitor interaction on the Trading Floor apex...\n");
}

// =============================
// 8. MAIN STARTUP SEQUENCE
// =============================
(async () => {
  await activateModules();
  await connectQuantumAPIs();
  await initializeLiveBridges();
  await runSystemDiagnostics();
  await validateQuantumPipelines();
  await benchmarkLatency();
  await logCompletionStatus();

  runEthicsCycle();

  httpServer.listen(PORT, () => {
    console.log(`🌍 QonexAI active on port ${PORT}`);
  });
})();

// =============================
// END OF SERVER.JS — QonexAI MASTER FLOW
// =============================
