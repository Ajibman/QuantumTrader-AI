// === AuditLogger (Self-Verifying Chained Ledger) ===
// Usage: See bottom for example usage
import crypto from "crypto";
import fs from "fs";
import path from "path";

class AuditLogger {
  /**
   * @param {string} logFile - path to log file (JSON array). Defaults to ./audit_log.json
   */
  constructor(logFile = "audit_log.json") {
    this.logFile = path.resolve(logFile);
    // Initialize file if missing
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, JSON.stringify([], null, 2));
    }
  }

  // Create SHA-256 hash of an object (deterministic ordering)
  static computeHash(obj) {
    // Stable stringify: keys sorted to ensure deterministic hashing
    const stableStringify = (o) => {
      if (o === null || typeof o !== "object") return JSON.stringify(o);
      if (Array.isArray(o)) return "[" + o.map(stableStringify).join(",") + "]";
      const keys = Object.keys(o).sort();
      return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(o[k])).join(",") + "}";
    };
    const str = stableStringify(obj);
    return crypto.createHash("sha256").update(str).digest("hex");
  }

  // Read all logs (returns array)
  _readLogs() {
    const raw = fs.readFileSync(this.logFile, "utf8");
    try {
      return JSON.parse(raw);
    } catch (err) {
      throw new Error(`Failed to parse audit log file: ${err.message}`);
    }
  }

  // Write logs array back to file atomically
  _writeLogs(logs) {
    const tmp = this.logFile + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(logs, null, 2));
    fs.renameSync(tmp, this.logFile); // atomic-ish replace
  }

  // Get previous entry hash (or null if none)
  _getPreviousHash(logs) {
    if (!logs || logs.length === 0) return null;
    return logs[logs.length - 1].entryHash || null;
  }

  // Create and append a new chained log entry
  writeLog(visitor, action, details = {}) {
    const logs = this._readLogs();

    const entryCore = {
      timestamp: new Date().toISOString(),
      visitorId: visitor?.id ?? null,
      intentionScore: visitor?.intentionScore ?? null,
      accessLevel: visitor?.accessLevel ?? null,
      action,
      details,
    };

    const previousHash = this._getPreviousHash(logs); // may be null
    const entry = {
      ...entryCore,
      previousHash, // link in the chain
    };

    // entryHash is hash of entry object including previousHash to chain
    entry.entryHash = AuditLogger.computeHash(entry);

    logs.push(entry);
    this._writeLogs(logs);

    console.log(`[AUDIT] Logged action for ${entry.visitorId} : ${action}`);
    return entry.entryHash;
  }

  // Verify integrity of the entire log file; returns { valid: bool, problems: [] }
  verifyLog() {
    const logs = this._readLogs();
    const problems = [];

    for (let i = 0; i < logs.length; i++) {
      const entry = logs[i];
      // Recompute hash of entry excluding entryHash (we need to reconstruct object same way)
      const entryToHash = {
        timestamp: entry.timestamp,
        visitorId: entry.visitorId,
        intentionScore: entry.intentionScore,
        accessLevel: entry.accessLevel,
        action: entry.action,
        details: entry.details,
        previousHash: entry.previousHash === undefined ? null : entry.previousHash,
      };
      const recomputedHash = AuditLogger.computeHash(entryToHash);

      if (recomputedHash !== entry.entryHash) {
        problems.push({
          index: i,
          reason: "ENTRY_HASH_MISMATCH",
          expected: entry.entryHash,
          recomputed: recomputedHash,
        });
      }

      // Verify chain: entry.previousHash must match prior entry.entryHash (or null for first)
      if (i === 0) {
        if (entry.previousHash !== null && entry.previousHash !== undefined) {
          problems.push({
            index: i,
            reason: "FIRST_ENTRY_PREVIOUSHASH_NOT_NULL",
            previousHash: entry.previousHash,
          });
        }
      } else {
        const prev = logs[i - 1];
        if (entry.previousHash !== prev.entryHash) {
          problems.push({
            index: i,
            reason: "CHAIN_BROKEN",
            expectedPreviousHash: prev.entryHash,
            actualPreviousHash: entry.previousHash,
          });
        }
      }
    }

    return {
      valid: problems.length === 0,
      problems,
      totalEntries: logs.length,
    };
  }

  // Optional: export subset of logs for auditing (by visitorId, time range, action etc.)
  query({ visitorId = null, action = null, from = null, to = null } = {}) {
    const logs = this._readLogs();
    return logs.filter((e) => {
      if (visitorId && e.visitorId !== visitorId) return false;
      if (action && e.action !== action) return false;
      if (from && new Date(e.timestamp) < new Date(from)) return false;
      if (to && new Date(e.timestamp) > new Date(to)) return false;
      return true;
    });
  }
}

// === Example usage (standalone) ===
// Uncomment to test locally
/*
const logger = new AuditLogger("./audit_log.json");

// Fake visitor object shape expected by caller
const visitor = { id: "QT-Visitor-001", intentionScore: "Peaceful & Constructive", accessLevel: "TraderLab™ + CPilot™" };
logger.writeLog(visitor, "ASSESS_INTENTION", { peaceScore: 0.92, emotionalScore: 0.88, genomPScore: 0.91 });
logger.writeLog(visitor, "ROUTE_USER", { newAccess: "TraderLab™ + CPilot™" });

// Verify file
const verification = logger.verifyLog();
console.log("Verification:", verification);
*/

// Export for external require/import
export default AuditLogger;

// === Trader_Routing_Engine.js ===
// QT AI Visitor/Trader Access & Bubble Routing (with API scoring + Secure Audit Logging)

import axios from "axios";
import crypto from "crypto";
import fs from "fs";

// === Secure Logger ===
class AuditLogger {
  constructor(logFile = "audit_log.json") {
    this.logFile = logFile;
    if (!fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, JSON.stringify([], null, 2));
    }
  }

  // Generate tamper-proof hash for each log entry
  static hashEntry(entry) {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(entry))
      .digest("hex");
  }

  writeLog(visitor, action, details) {
    const entry = {
      timestamp: new Date().toISOString(),
      visitorId: visitor.id,
      intentionScore: visitor.intentionScore,
      accessLevel: visitor.accessLevel,
      action,
      details,
    };
    entry.hash = AuditLogger.hashEntry(entry);

    const logs = JSON.parse(fs.readFileSync(this.logFile));
    logs.push(entry);
    fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2));

    console.log(`[AUDIT] Logged action for ${visitor.id}`);
  }
}

const auditLogger = new AuditLogger();

// === VisitorTrader Model ===
class VisitorTrader {
  constructor(id, actions = [], statements = [], patterns = []) {
    this.id = id;
    this.actions = actions;
    this.statements = statements;
    this.patterns = patterns;
    this.intentionScore = null;
    this.accessLevel = null;
  }
}

const thresholds = {
  peace: 0.8,
  emotional: 0.75,
  genomP: 0.85,
};

// === API Integration with QT AI ===
async function fetchScore(visitor, dimension) {
  try {
    const response = await axios.post(`https://qt-ai/api/score/${dimension}`, {
      id: visitor.id,
      actions: visitor.actions,
      statements: visitor.statements,
      patterns: visitor.patterns,
    });
    return response.data.score;
  } catch (err) {
    console.error(`[ERROR] Failed to fetch ${dimension} score:`, err.message);
    auditLogger.writeLog(visitor, "API_ERROR", { dimension, error: err.message });
    return 0.0;
  }
}

// === Step 1: Assess Intention ===
async function assessIntention(visitor) {
  const peaceScore = await fetchScore(visitor, "peace");
  const emotionalScore = await fetchScore(visitor, "emotional");
  const genomPScore = await fetchScore(visitor, "genomP");

  if (
    peaceScore >= thresholds.peace &&
    emotionalScore >= thresholds.emotional &&
    genomPScore >= thresholds.genomP
  ) {
    visitor.intentionScore = "Peaceful & Constructive";
  } else if (peaceScore < thresholds.peace && emotionalScore < thresholds.emotional) {
    visitor.intentionScore = "Confused/Disoriented";
  } else {
    visitor.intentionScore = "Resistant/Unstable";
  }

  auditLogger.writeLog(visitor, "ASSESS_INTENTION", {
    peaceScore,
    emotionalScore,
    genomPScore,
  });

  return visitor.intentionScore;
}

// === Step 2: Route User ===
function routeUser(visitor) {
  switch (visitor.intentionScore) {
    case "Peaceful & Constructive":
      visitor.accessLevel = "TraderLab™ + CPilot™";
      grantTraderLabAccess(visitor);
      break;

    case "Confused/Disoriented":
      visitor.accessLevel = "Guidance Modules";
      assignGuidance(visitor);
      break;

    case "Resistant/Unstable":
      visitor.accessLevel = "Games Pavilion";
      assignGames(visitor);
      break;
  }

  auditLogger.writeLog(visitor, "ROUTE_USER", { newAccess: visitor.accessLevel });
  return visitor.accessLevel;
}

// === Step 3: Re-Evaluation ===
async function reevaluate(visitor) {
  await assessIntention(visitor);
  routeUser(visitor);
  auditLogger.writeLog(visitor, "REEVALUATE", { reevaluated: true });
  return visitor.accessLevel;
}

// === Access Handlers ===
function grantTraderLabAccess(visitor) {
  console.log(`[ACCESS GRANTED] ${visitor.id} → TraderLab™ + CPilot™`);
}

function assignGuidance(visitor) {
  console.log(`[GUIDANCE] ${visitor.id} → Supportive Guidance Modules`);
}

function assignGames(visitor) {
  console.log(`[GAMES] ${visitor.id} → Emotional Intelligence Pavilion`);
}

// === Stream Connector ===
function connectToQTStream(stream) {
  stream.on("visitorEvent", async (data) => {
    const visitor = new VisitorTrader(data.id, data.actions, data.statements, data.patterns);

    await assessIntention(visitor);
    routeUser(visitor);

    setInterval(async () => {
      await reevaluate(visitor);
    }, 5000);
  });
}

// === Example Mock Stream ===
class MockStream {
  constructor() {
    this.handlers = {};
  }
  on(event, handler) {
    this.handlers[event] = handler;
  }
  emit(event, data) {
    if (this.handlers[event]) this.handlers[event](data);
  }
}

const qtStream = new MockStream();
connectToQTStream(qtStream);

// Simulated visitor
qtStream.emit("visitorEvent", {
  id: "QT-Visitor-001",
  actions: ["trade_attempt", "research_click"],
  statements: ["I want to trade ethically"],
  patterns: ["calm", "consistent"],
});

// === Trader_Routing_Engine.js ===
// QT AI Visitor/Trader Access & Bubble Routing (with API scoring)

import axios from "axios"; // Use axios/fetch for API calls

class VisitorTrader {
  constructor(id, actions = [], statements = [], patterns = []) {
    this.id = id;
    this.actions = actions;
    this.statements = statements;
    this.patterns = patterns;
    this.intentionScore = null;
    this.accessLevel = null;
  }
}

// Thresholds (can be tuned dynamically by QT AI analytics)
const thresholds = {
  peace: 0.8,
  emotional: 0.75,
  genomP: 0.85
};

// === QT AI API Integration ===
// Replace with real QT AI endpoints
async function fetchScore(visitor, dimension) {
  try {
    const response = await axios.post(`https://qt-ai/api/score/${dimension}`, {
      id: visitor.id,
      actions: visitor.actions,
      statements: visitor.statements,
      patterns: visitor.patterns
    });
    return response.data.score; // Expect float between 0.0 - 1.0
  } catch (err) {
    console.error(`[ERROR] Failed to fetch ${dimension} score:`, err.message);
    return 0.0; // Safe fallback
  }
}

// === Step 1: Assess Intention ===
async function assessIntention(visitor) {
  const peaceScore = await fetchScore(visitor, "peace");
  const emotionalScore = await fetchScore(visitor, "emotional");
  const genomPScore = await fetchScore(visitor, "genomP");

  if (
    peaceScore >= thresholds.peace &&
    emotionalScore >= thresholds.emotional &&
    genomPScore >= thresholds.genomP
  ) {
    visitor.intentionScore = "Peaceful & Constructive";
  } else if (peaceScore < thresholds.peace && emotionalScore < thresholds.emotional) {
    visitor.intentionScore = "Confused/Disoriented";
  } else {
    visitor.intentionScore = "Resistant/Unstable";
  }

  return visitor.intentionScore;
}

// === Step 2: Route User ===
function routeUser(visitor) {
  switch (visitor.intentionScore) {
    case "Peaceful & Constructive":
      visitor.accessLevel = "TraderLab™ + CPilot™";
      grantTraderLabAccess(visitor);
      break;

    case "Confused/Disoriented":
      visitor.accessLevel = "Guidance Modules";
      assignGuidance(visitor);
      break;

    case "Resistant/Unstable":
      visitor.accessLevel = "Games Pavilion";
      assignGames(visitor);
      break;
  }
  return visitor.accessLevel;
}

// === Step 3: Re-Evaluation Loop ===
async function reevaluate(visitor) {
  await assessIntention(visitor);
  routeUser(visitor);
  return visitor.accessLevel;
}

// === QT AI Action Hooks ===
function grantTraderLabAccess(visitor) {
  console.log(`[ACCESS GRANTED] ${visitor.id} → TraderLab™ + CPilot™`);
}

function assignGuidance(visitor) {
  console.log(`[GUIDANCE] ${visitor.id} → Supportive Guidance Modules`);
}

function assignGames(visitor) {
  console.log(`[GAMES] ${visitor.id} → Emotional Intelligence Pavilion`);
}

// === QT AI Data Stream Connector ===
function connectToQTStream(stream) {
  stream.on("visitorEvent", async (data) => {
    const visitor = new VisitorTrader(data.id, data.actions, data.statements, data.patterns);

    await assessIntention(visitor);
    routeUser(visitor);

    // Continuous re-evaluation (loop with real data updates)
    setInterval(async () => {
      await reevaluate(visitor);
    }, 5000); // every 5s
  });
}

// === Example: Mock Stream for Testing ===
class MockStream {
  constructor() {
    this.handlers = {};
  }
  on(event, handler) {
    this.handlers[event] = handler;
  }
  emit(event, data) {
    if (this.handlers[event]) this.handlers[event](data);
  }
}

// Simulated visitor stream
const qtStream = new MockStream();
connectToQTStream(qtStream);

// Simulated event injection
qtStream.emit("visitorEvent", {
  id: "QT-Visitor-001",
  actions: ["trade_attempt", "research_click"],
  statements: ["I want to trade ethically"],
  patterns: ["calm", "consistent"]
});

// === Trader_Routing_Engine.js ===
// QT AI Visitor/Trader Access & Bubble Routing

class VisitorTrader {
  constructor(id, actions = [], statements = [], patterns = []) {
    this.id = id;
    this.actions = actions;
    this.statements = statements;
    this.patterns = patterns;
    this.intentionScore = null;
    this.accessLevel = null;
  }
}

// Thresholds (tuned by QT AI analytics layer)
const thresholds = {
  peace: 0.8,
  emotional: 0.75,
  genomP: 0.85
};

// === Scoring Functions (stubs, connect to QT AI data streams) ===
function evaluatePeace(visitor) {
  return Math.random(); // Replace with QT AI stream score
}

function evaluateEmotional(visitor) {
  return Math.random(); // Replace with QT AI stream score
}

function evaluateGenomP(visitor) {
  return Math.random(); // Replace with QT AI stream score
}

// === Step 1: Assess Intention ===
function assessIntention(visitor) {
  const peaceScore = evaluatePeace(visitor);
  const emotionalScore = evaluateEmotional(visitor);
  const genomPScore = evaluateGenomP(visitor);

  if (
    peaceScore >= thresholds.peace &&
    emotionalScore >= thresholds.emotional &&
    genomPScore >= thresholds.genomP
  ) {
    visitor.intentionScore = "Peaceful & Constructive";
  } else if (peaceScore < thresholds.peace && emotionalScore < thresholds.emotional) {
    visitor.intentionScore = "Confused/Disoriented";
  } else {
    visitor.intentionScore = "Resistant/Unstable";
  }

  return visitor.int

# === QT AI Real-Time Visitor/Trader Routing Engine ===
# Integrates the Access Module into live sessions

class QuantumTraderAI:
    def __init__(self):
        self.active_sessions = {}  # Track all active visitor/trader sessions

    def start_session(self, visitor_id, actions, statements, patterns):
        visitor = VisitorTrader(visitor_id, actions, statements, patterns)
        self.active_sessions[visitor_id] = visitor
        self.evaluate_and_route(visitor)
        return visitor

    def evaluate_and_route(self, visitor):
        # Step 1: Assess intention dynamically
        assess_intention(visitor)

        # Step 2: Route to appropriate bubble
        route_user(visitor)

        # Step 3: Continuous re-evaluation loop (quantum-informed)
        self.monitor_alignment(visitor)

    def monitor_alignment(self, visitor):
        # This simulates real-time continuous monitoring
        # Replace loop with async/event-driven quantum layer
        import time
        for _ in range(3):  # Example re-evaluations
            time.sleep(1)  # Replace with real-time event triggers
            reevaluate_user(visitor)
            print(f"[RE-EVALUATION] {visitor.id} → {visitor.access_level}")

    # Optional: Remove inactive or non-compliant visitors
    def prune_sessions(self):
        for vid, visitor in list(self.active_sessions.items()):
            if visitor.access_level not in ["TraderLab™ + CPilot™", "Guidance Modules", "Games Pavilion"]:
                del self.active_sessions[vid]

# === Example real-time session execution ===
qt_ai = QuantumTraderAI()
visitor1 = qt_ai.start_session(
    visitor_id="QT-Visitor-001",
    actions=["trade_attempt", "research_click"],
    statements=["I want to trade ethically"],
    patterns=["calm", "consistent"]
)
