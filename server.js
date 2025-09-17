// scripts/mockVisitors.js
const axios = require("axios");

const SERVER_URL = "http://localhost:4000";

// Generate random visitor
function generateVisitor() {
  const id = "visitor_" + Math.floor(Math.random() * 10000);
  const score = Math.floor(Math.random() * 100);
  const tier = ["Bronze", "Silver", "Gold", "Platinum"][Math.floor(Math.random() * 4)];
  const behavior = ["peaceful", "neutral", "resistant"][Math.floor(Math.random() * 3)];

  return { visitorId: id, score, tier, behavior };
}

// Simulate sending visitors to server
async function sendVisitor(visitorData) {
  try {
    const res = await axios.post(`${SERVER_URL}/api/visitor/re-evaluate/${visitorData.visitorId}`, visitorData);
    console.log(`✅ Visitor routed:`, res.data.visitor ?? visitorData);
  } catch (err) {
    // If visitor does not exist yet, create manually via reroute to trigger routing
    if (err.response && err.response.status === 404) {
      try {
        await axios.post(`${SERVER_URL}/api/visitor/reroute/${visitorData.visitorId}`, {
          bubble: "TraderLab"
        });
        console.log(`✅ Visitor created & routed: ${visitorData.visitorId}`);
      } catch (e) {
        console.error("❌ Failed to create visitor:", e.message);
      }
    } else {
      console.error("❌ Routing error:", err.message);
    }
  }
}

// Simulate multiple visitors
async function simulateVisitors(count = 5, delay = 1000) {
  for (let i = 0; i < count; i++) {
    const visitor = generateVisitor();
    await sendVisitor(visitor);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

simulateVisitors(10, 1500);

// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const TraderRoutingEngine = require("../Trader_Routing_Engine");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 4000;
const logFile = path.join(__dirname, "logs/restarts.log");

// Ensure logs directory exists
if (!fs.existsSync(path.join(__dirname, "logs"))) fs.mkdirSync(path.join(__dirname, "logs"));

// --- Logging Utility ---
function logRestart(reason) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] Server restart triggered: ${reason}\n`;
  fs.appendFileSync(logFile, logEntry, { encoding: "utf8" });
  console.log("📝 Restart logged.");
}

// --- Data Stores ---
let visitors = {}; // visitorId -> current visitor data
let entryHistory = {}; // visitorId -> array of history entries
let leaderboard = {}; // visitorId -> {count, highestTier, totalScore}

// --- Socket.IO Handling ---
io.on("connection", (socket) => {
  console.log(`👤 Client connected: ${socket.id}`);
  socket.emit("initialData", { visitors, leaderboard, entryHistory });
});

// --- Core Routing Function ---
function handleVisitor(visitorData) {
  // Route visitor through TraderRoutingEngine
  const destination = TraderRoutingEngine.route(visitorData);
  visitorData.destination = destination;

  // Update visitors store
  visitors[visitorData.visitorId] = visitorData;

  // Update entryHistory
  if (!entryHistory[visitorData.visitorId]) entryHistory[visitorData.visitorId] = [];
  entryHistory[visitorData.visitorId].unshift({
    timestamp: new Date().toISOString(),
    bubble: destination,
    score: visitorData.score ?? "N/A",
    tier: visitorData.tier ?? "N/A",
  });

  // Update leaderboard
  const prev = leaderboard[visitorData.visitorId] || { count: 0, highestTier: null, totalScore: 0 };
  leaderboard[visitorData.visitorId] = {
    count: prev.count + 1,
    highestTier: visitorData.tier ?? prev.highestTier,
    totalScore: prev.totalScore + (visitorData.score ?? 0),
  };

  // Emit updates to dashboard
  io.emit("visitorRouted", visitorData);
  io.emit("entryHistoryUpdate", { visitorId: visitorData.visitorId, entry: entryHistory[visitorData.visitorId][0] });
  io.emit("leaderboardUpdate", leaderboard);
}

// --- REST API Endpoints ---
app.use(express.json());

// Get all active visitors
app.get("/api/visitors", (req, res) => res.json(visitors));

// Get single visitor
app.get("/api/visitor/:id", (req, res) => {
  const visitorId = req.params.id;
  res.json({ current: visitors[visitorId] ?? null, history: entryHistory[visitorId] ?? [] });
});

// Re-evaluate visitor
app.post("/api/visitor/re-evaluate/:id", (req, res) => {
  const visitorId = req.params.id;
  const visitorData = visitors[visitorId];
  if (!visitorData) return res.status(404).json({ error: "Visitor not found" });

  handleVisitor(visitorData); // Re-route
  res.json({ message: "Visitor re-evaluated", visitor: visitors[visitorId] });
});

// Manually reroute visitor
app.post("/api/visitor/reroute/:id", (req, res) => {
  const visitorId = req.params.id;
  const { bubble } = req.body;
  if (!visitorId || !bubble) return res.status(400).json({ error: "Missing visitorId or bubble" });

  const visitorData = visitors[visitorId];
  if (!visitorData) return res.status(404).json({ error: "Visitor not found" });

  visitorData.destination = bubble;
  handleVisitor(visitorData);
  res.json({ message: `Visitor manually routed to ${bubble}`, visitor: visitors[visitorId] });
});

// Leaderboard & export
app.get("/api/leaderboard", (req, res) => res.json(leaderboard));
app.get("/api/leaderboard/export", (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=leaderboard.json");
  res.json(leaderboard);
});

// Entry history & export
app.get("/api/history", (req, res) => res.json(entryHistory));
app.get("/api/history/export", (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=entryHistory.json");
  res.json(entryHistory);
});

// Admin: reset session
app.post("/api/admin/reset", (req, res) => {
  visitors = {};
  entryHistory = {};
  leaderboard = {};
  res.json({ message: "All session data cleared" });
});

// Admin: fix dependencies
app.post("/api/admin/fix-deps", (req, res) => {
  exec("npm run fix-deps", (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: error.message });
    if (stderr) console.error(stderr);
    res.json({ message: "Dependencies fixed", output: stdout });
  });
});

// Admin: server status
app.get("/api/admin/status", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    visitorsCount: Object.keys(visitors).length,
  });
});

// --- Self-Healing / Self-Correcting ---
function startServer() {
  try {
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Server crashed:", err);
    logRestart(`Exception: ${err.message}`);
    selfCorrectAndRestart();
  }
}

function selfCorrectAndRestart() {
  console.log("🔧 Running self-correction (npm run fix-deps)...");
  exec("npm run fix-deps", (error, stdout, stderr) => {
    if (error) console.error(`⚠️ Self-correction failed: ${error.message}`);
    if (stderr) console.error(`stderr: ${stderr}`);
    console.log(stdout);
    logRestart("Self-correction executed, restarting server...");
    console.log("🔄 Restarting server after correction...");
    setTimeout(startServer, 3000);
  });
}

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception:", err);
  logRestart(`Uncaught Exception: ${err.message}`);
  selfCorrectAndRestart();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection:", reason);
  logRestart(`Unhandled Rejection: ${reason}`);
  selfCorrectAndRestart();
});

// --- Start Server ---
startServer();

// server.js
const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// Example route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Start server with auto-recovery + self-correction
function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server crashed:", err);
    selfCorrectAndRestart();
  }
}

// Function to self-correct dependencies & restart
function selfCorrectAndRestart() {
  console.log("🔧 Running self-correction (npm run fix-deps)...");
  exec("npm run fix-deps", (error, stdout, stderr) => {
    if (error) {
      console.error(`⚠️ Self-correction failed: ${error.message}`);
    }
    if (stderr) console.error(`stderr: ${stderr}`);
    console.log(stdout);

    console.log("🔄 Restarting server after correction...");
    setTimeout(startServer, 3000);
  });
}

startServer();

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception:", err);
  selfCorrectAndRestart();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection:", reason);
  selfCorrectAndRestart();
});

// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Example route
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// Start server with auto-recovery
function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server crashed:", err);
    console.log("🔄 Restarting server...");
    setTimeout(startServer, 3000); // restart after 3s
  }
}

startServer();

// Global error handlers
process.on("uncaughtException", (err) => {
  console.error("⚠️ Uncaught Exception:", err);
  startServer();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Unhandled Rejection:", reason);
  startServer();
});

// scripts/checkServer.js
const fs = require("fs");
const path = require("path");

const expectedPath = path.join(__dirname, "../server/server.js");
const misplacedPath = path.join(__dirname, "../src/server.js");

// Ensure /server folder exists
const serverDir = path.join(__dirname, "../server");
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir);
  console.log("📂 Created /server directory.");
}

// 1. Handle misplaced file in /src
if (fs.existsSync(misplacedPath)) {
  console.warn("⚠️ Found misplaced server.js in /src.");
  if (!fs.existsSync(expectedPath)) {
    fs.renameSync(misplacedPath, expectedPath);
    console.log("✅ Moved server.js to /server/");
  } else {
    // If both exist, keep /server copy, archive the /src one
    const archivePath = path.join(__dirname, "../server/server_src_backup.js");
    fs.renameSync(misplacedPath, archivePath);
    console.log("🗂️ Duplicate found. Kept /server/server.js, archived /src/server.js as server_src_backup.js");
  }
}

// 2. Detect multiple server.js anywhere in repo
function findServerFiles(dir, results = []) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      findServerFiles(filePath, results);
    } else if (file === "server.js") {
      results.push(filePath);
    }
  });
  return results;
}

const allServerFiles = findServerFiles(path.join(__dirname, ".."));
if (allServerFiles.length > 1) {
  console.warn("⚠️ Multiple server.js files detected:");
  allServerFiles.forEach((f) => console.warn("   - " + f));
  console.warn("👉 Keeping only /server/server.js as the authoritative backend file.");
}

// 3. Final validation
if (!fs.existsSync(expectedPath)) {
  console.error("❌ ERROR: server.js missing in /server/. Please restore it manually!");
  process.exit(1);
} else {
  console.log("✅ server.js is correctly located in /server/");
}

// Trader_Routing_Engine.js
// Quantum Trader AI - Bubble Routing Engine with Live Stream + Chained Audit + Central Sync
// © Olagoke Ajibulu | QT AI

import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// === Local Chained Audit Logger ===
class AuditLogger {
  constructor(logFile = "./audit_log.json") {
    this.logFile = path.resolve(logFile);
    if (!fs.existsSync(this.logFile)) fs.writeFileSync(this.logFile, JSON.stringify([], null, 2));
  }

  static hashEntry(entry) {
    // stable stringify for consistent hashing
    const stableStringify = (o) => {
      if (o === null || typeof o !== "object") return JSON.stringify(o);
      if (Array.isArray(o)) return "[" + o.map(stableStringify).join(",") + "]";
      const keys = Object.keys(o).sort();
      return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(o[k])).join(",") + "}";
    };
    return crypto.createHash("sha256").update(stableStringify(entry)).digest("hex");
  }

  _readLogs() {
    return JSON.parse(fs.readFileSync(this.logFile, "utf8"));
  }

  _writeLogs(logs) {
    fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2));
  }

  async write(visitorId, action, details = {}) {
    const logs = this._readLogs();
    const prevHash = logs.length ? logs[logs.length - 1].entryHash : null;
    const entry = { timestamp: new Date().toISOString(), visitorId, action, details, previousHash: prevHash };
    entry.entryHash = AuditLogger.hashEntry(entry);
    logs.push(entry);
    this._writeLogs(logs);
    return entry.entryHash;
  }

  verify() {
    const logs = this._readLogs();
    const problems = [];
    for (let i = 0; i < logs.length; i++) {
      const e = logs[i];
      const entryToHash = {
        timestamp: e.timestamp,
        visitorId: e.visitorId,
        action: e.action,
        details: e.details,
        previousHash: e.previousHash ?? null
      };
      const recomputed = AuditLogger.hashEntry(entryToHash);
      if (recomputed !== e.entryHash) problems.push({ index: i, reason: "HASH_MISMATCH", expected: e.entryHash, recomputed });
      if (i > 0 && e.previousHash !== logs[i - 1].entryHash) problems.push({ index: i, reason: "CHAIN_BROKEN", expectedPreviousHash: logs[i - 1].entryHash, actualPreviousHash: e.previousHash });
      if (i === 0 && e.previousHash) problems.push({ index: 0, reason: "FIRST_ENTRY_PREVHASH_NOT_NULL" });
    }
    return { valid: problems.length === 0, problems, totalEntries: logs.length };
  }

  query({ visitorId = null, action = null, from = null, to = null } = {}) {
    return this._readLogs().filter(e => {
      if (visitorId && e.visitorId !== visitorId) return false;
      if (action && e.action !== action) return false;
      if (from && new Date(e.timestamp) < new Date(from)) return false;
      if (to && new Date(e.timestamp) > new Date(to)) return false;
      return true;
    });
  }
}

const auditLogger = new AuditLogger();

// === Central Audit Sync ===
async function centralAuditLog(visitorId, action, details = {}) {
  try {
    // Note: replace with real QT AI central audit endpoint
    await axios.post("https://qt-ai/api/audit-log", { visitorId, action, details, timestamp: new Date().toISOString() });
    return true;
  } catch (err) {
    // fallback: log the central sync failure locally in chained ledger (tamper-evident)
    await auditLogger.write(visitorId, `CENTRAL_SYNC_FAIL_${action}`, { error: err.message });
    return false;
  }
}

// === Visitor/Trader Model ===
class VisitorTrader {
  constructor(id, peaceIndex, emotionalIntelligence, integrityScore) {
    this.id = id;
    this.peaceIndex = peaceIndex ?? 0;
    this.emotionalIntelligence = emotionalIntelligence ?? 0;
    this.integrityScore = integrityScore ?? 0;
    this.intentionScore = null;
    this.accessLevel = null;
    this.lastSeen = new Date().toISOString();
  }
}

// === Routing Logic ===
async function assessIntention(visitor) {
  let intention;
  if (visitor.peaceIndex >= 80 && visitor.emotionalIntelligence >= 70 && visitor.integrityScore >= 75) intention = "Peaceful & Constructive";
  else if (visitor.peaceIndex >= 50 && visitor.emotionalIntelligence >= 50) intention = "Neutral/Inexperienced";
  else intention = "Resistant/Unstable";

  visitor.intentionScore = intention;
  visitor.lastSeen = new Date().toISOString();

  await auditLogger.write(visitor.id, "ASSESS_INTENTION", { intention, scores: { peaceIndex: visitor.peaceIndex, emotionalIntelligence: visitor.emotionalIntelligence, integrityScore: visitor.integrityScore } });
  await centralAuditLog(visitor.id, "ASSESS_INTENTION", { intention, scores: { peaceIndex: visitor.peaceIndex, emotionalIntelligence: visitor.emotionalIntelligence, integrityScore: visitor.integrityScore } });

  return intention;
}

async function grantAccess(visitor, destination) {
  visitor.accessLevel = destination;
  await auditLogger.write(visitor.id, "ACCESS_GRANTED", { destination });
  await centralAuditLog(visitor.id, "ACCESS_GRANTED", { destination });
}

async function guideVisitor(visitor) {
  visitor.accessLevel = "Guidance Modules";
  await auditLogger.write(visitor.id, "GUIDANCE_ASSIGNED", {});
  await centralAuditLog(visitor.id, "GUIDANCE_ASSIGNED", {});
}

async function redirectToPavilion(visitor) {
  visitor.accessLevel = "Games Pavilion";
  await auditLogger.write(visitor.id, "REDIRECTED_TO_PAVILION", {});
  await centralAuditLog(visitor.id, "REDIRECTED_TO_PAVILION", {});
}

async function routeVisitor(visitor) {
  const intention = await assessIntention(visitor);
  switch (intention) {
    case "Peaceful & Constructive": await grantAccess(visitor, "TraderLab™ + CPilot™"); break;
    case "Neutral/Inexperienced": await guideVisitor(visitor); break;
    case "Resistant/Unstable": await redirectToPavilion(visitor); break;
  }
  return visitor;
}

// === Live QT AI Stream (internal emitter) ===
import EventEmitter from "events";
const qtStream = new EventEmitter();

// Helper: receive external event (from server or other source) and emit
async function receiveVisitorEvent(data) {
  // data should contain id, peaceIndex, emotionalIntelligence, integrityScore
  const v = new VisitorTrader(data.id, data.peaceIndex, data.emotionalIntelligence, data.integrityScore);
  await routeVisitor(v);
  qtStream.emit("visitorEvent", {
    id: v.id,
    accessLevel: v.accessLevel,
    intentionScore: v.intentionScore,
    lastSeen: v.lastSeen
  });
  return v;
}

// Exports used by server.js
export { qtStream, receiveVisitorEvent, auditLogger, routeVisitor, assessIntention };
