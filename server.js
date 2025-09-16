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
