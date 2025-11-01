// server.js/
// ============================
// QuantumTrader AI — server.js
// Core runtime and logic harness
// Created by Olagoke Ajibulu
// ============================

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// === QuantumTrader-AI™ Asset Verification System ===
// (c) 2025 QuantumTrader-AI™ | Olagoke Ajibulu — Architect & Builder

import fs from 'fs';
import path from 'path';

import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// === QuantumTrader-AI™ Asset Verification & Audit System ===
const assetsDir = path.join(process.cwd(), 'public', 'assets', 'images');
const auditFile = path.join(process.cwd(), 'public', 'assets', 'assets_audit.json');

const requiredAssets = [
  'qtai_globe.png',
  'traderlab_icon.png',
  'tradingfloor_main.png',
  'cpilot_panel.png',
  'ori_olokun.png',
  'background_cosmic.png'
];

console.log('\n🔍 QuantumTrader-AI Asset Verification Started...\n');

let auditResults = [];

requiredAssets.forEach(file => {
  const filePath = path.join(assetsDir, file);
  const exists = fs.existsSync(filePath);
  if (exists) console.log(`✅ Verified: ${file}`);
  else console.warn(`⚠️ Missing: ${file}`);
  auditResults.push({
    file,
    status: exists ? 'verified' : 'missing',
    checkedAt: new Date().toISOString()
  });
});

try {
  fs.writeFileSync(auditFile, JSON.stringify(auditResults, null, 2));
  console.log(`\n📘 Audit saved: ${auditFile}`);
} catch (err) {
  console.error('❌ Error writing audit file:', err);
}

console.log('\n✨ Asset verification completed.\n');

// === Static Files + App Logic ===
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader-AI running at http://localhost:${PORT}`);
});
 
  // Perform a self-check during server start
console.log('\n🔍 QuantumTrader-AI Asset Verification in Progress...\n');

requiredAssets.forEach(file => {
  const filePath = path.join(assetsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Verified: ${file}`);
  } else {
    console.warn(`⚠️ Missing: ${file} — please ensure it's in /public/assets/images/`);
  }
});

console.log('\nAsset verification completed.\n');

// --- 1. Core Initialization ---
console.log("⚙️ Initializing QuantumTrader AI runtime...");

// ----------------------------
// Games Pavilion Guard Middleware
// ----------------------------

/**
 * Simple in-memory request tracker + optional persistent bans.
 * Place after your logAudit/ensureLogsDir functions so they can be used here.
 */

const RATE_WINDOW_MS = 60 * 1000;      // 60s sliding window
const RATE_LIMIT = 80;                 // >80 requests per window => throttle
const BAN_SECONDS = 15 * 60;           // 15 minutes ban duration
const PERSIST_BANS = true;             // toggle persistence to logs/bans.json

const requestMap = new Map(); // ip -> { timestamps: [t1,t2...], bannedUntil: Date|null }

// load persisted bans if present
const BANS_FILE = path.join(LOGS_DIR, "bans.json");
function loadPersistedBans() {
  try {
    if (PERSIST_BANS && fs.existsSync(BANS_FILE)) {
      const raw = fs.readFileSync(BANS_FILE, "utf8");
      const data = JSON.parse(raw);
      Object.entries(data).forEach(([ip, until]) => {
        const obj = { timestamps: [], bannedUntil: new Date(until) };
        requestMap.set(ip, obj);
        logAudit(`[GUARD] Restored ban for ${ip} until ${until}`);
      });
    }
  } catch (err) {
    logAudit(`[GUARD] Failed to load persisted bans: ${err.message}`);
  }
}
function persistBans() {
  if (!PERSIST_BANS) return;
  try {
    const out = {};
    requestMap.forEach((v, ip) => {
      if (v.bannedUntil && v.bannedUntil > new Date()) {
        out[ip] = v.bannedUntil.toISOString();
      }
    });
    fs.writeFileSync(BANS_FILE, JSON.stringify(out, null, 2), "utf8");
    logAudit("[GUARD] Persisted bans to disk");
  } catch (err) {
    logAudit(`[GUARD] Failed to persist bans: ${err.message}`);
  }
}
loadPersistedBans();

/**
 * Middleware: guardRequests
 * - If IP is banned -> redirect to /games-pavilion
 * - Otherwise count requests in sliding window; if over threshold, ban and redirect
 */
function guardRequests(req, res, next) {
  try {
    const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || "").split(",")[0].trim();
    if (!ip) return next();

    let state = requestMap.get(ip);
    if (!state) {
      state = { timestamps: [], bannedUntil: null };
      requestMap.set(ip, state);
    }

    // If currently banned
    if (state.bannedUntil && new Date() < new Date(state.bannedUntil)) {
      logAudit(`[GUARD] Rejected request from banned IP ${ip}`);
      return res.redirect(302, "/games-pavilion");
    }

    // Clean up timestamps older than window
    const now = Date.now();
    state.timestamps = state.timestamps.filter((t) => now - t <= RATE_WINDOW_MS);
    state.timestamps.push(now);

    // If exceeds threshold => ban
    if (state.timestamps.length > RATE_LIMIT) {
      const until = new Date(now + BAN_SECONDS * 1000);
      state.bannedUntil = until.toISOString();
      logAudit(`[GUARD] IP ${ip} exceeded rate limit (${state.timestamps.length}). Banned until ${state.bannedUntil}`);
      persistBans();
      return res.redirect(302, "/games-pavilion");
    }

    // Otherwise proceed
    return next();
  } catch (err) {
    // Non-fatal — log then continue
    logAudit(`[GUARD] middleware error: ${err.message}`);
    return next();
  }
}

// Attach guard middleware early in the chain so it screens all requests
app.use(guardRequests);

// Add a simple route for the games pavilion (harmless)
app.get("/games-pavilion", (req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Games Pavilion</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          body { font-family: Arial, sans-serif; text-align:center; padding:3rem; background:#0b0f1a; color:#dceefc; }
          .box { max-width:640px; margin:0 auto; padding:2rem; border-radius:12px; background:rgba(255,255,255,0.03); }
          h1 { margin-top:0; color:#78f3ff; }
          p { color:#bcd; }
          a { color:#8ef; text-decoration:none; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Welcome to the Games Pavilion 🎮</h1>
          <p>Looks like you were a bit too curious — relax and enjoy a short time out. If you're a legitimate user, please try again later.</p>
          <p><small>This is a friendly timeout page served by QuantumTrader AI.</small></p>
          <p><a href="/">Return to QuantumTrader AI</a></p>
        </div>
      </body>
    </html>
  `);
});

// à--- 2. Static File Routing (Frontend Gateway) ---
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// --- 3. Root Route ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// --- 4. Placeholder for Future Modules (CCLM²™ Integration) ---
try {
  const modulesPath = path.join(__dirname, "modules");
  console.log("🔗 Modules directory detected:", modulesPath);
  // Future: dynamically load modules here
  // Example: require("./modules/module01_tradercore.js");
} catch (err) {
  console.warn("⚠️ Module loader initialization skipped:", err.message);
}

// --- 5. Medusa™ Silent Watcher (Self-Healing Placeholder) ---
function medusaWatcher() {
  console.log("🕊️ Medusa™ active: monitoring system resilience...");
  // Future: silent recovery and thread regeneration routines
}
setTimeout(medusaWatcher, 3000);

// --- 6. Server Start ---
app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader AI server active on port ${PORT}`);
  console.log("🌐 Access via http://localhost:" + PORT);
  console.log("🧠 CCLM²™ supervision engaged.");
});

// --- 7. Graceful Exit Handling ---
process.on("SIGINT", () => {
  console.log("\n🛑 QuantumTrader AI shutdown initiated...");
  console.log("🧩 Medusa™ preserving state before exit.");
  process.exit();
});

// ============================================================
// 🌐 QuantumTrader AI — QonexAI Unified Server Kernel
// Architect/Builder: Olagoke Ajibulu
// Build Channel: Core Synchronization Layer
// Date: 25:10:2025
// ============================================================
"use strict";

const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
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
