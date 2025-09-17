{
  "name": "qtai-admin-dashboard",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.4.0",
    "socket.io-client": "^4.8.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "recharts": "^2.6.0"
  },
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "tailwindcss": "^3.5.0",
    "vite": "^4.4.0"
  }
}

// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import { qtStream, receiveVisitorEvent, auditLogger, routeVisitor } from "./Trader_Routing_Engine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());

// Serve dashboard static build if present
const dashboardDist = path.join(__dirname, "dashboard", "dist");
if (fsExistsSync(dashboardDist)) {
  app.use("/dashboard", express.static(dashboardDist));
}

// helper: fs exists sync
function fsExistsSync(p) {
  try { return fs.statSync(p).isDirectory() || fs.statSync(p).isFile(); } catch (err) { return false; }
}

// Socket.IO: dashboard clients connect to receive live visitor events
io.on("connection", (socket) => {
  console.log("Dashboard connected:", socket.id);

  // send recent visitors from audit log (by reading last ASSESS_INTENTION entries)
  const all = auditLogger.query({});
  const recentVisitors = [];
  const seen = new Set();
  // gather latest intention/access by visitorId from log entries (walk reverse)
  for (let i = all.length - 1; i >= 0 && recentVisitors.length < 50; i--) {
    const e = all[i];
    if (!e.visitorId || seen.has(e.visitorId)) continue;
    seen.add(e.visitorId);
    // attempt to extract current status from entry
    let access = null;
    let intention = null;
    if (e.action === "ACCESS_GRANTED") access = e.details.destination;
    if (e.action === "ASSESS_INTENTION") intention = e.details.intention;
    recentVisitors.push({ id: e.visitorId, accessLevel: access || "N/A", intentionScore: intention || "N/A", lastSeen: e.timestamp });
  }
  socket.emit("initialVisitors", recentVisitors);
});

// Broadcast engine visitor events through socket.io
qtStream.on("visitorEvent", (visitor) => {
  io.emit("visitorEvent", visitor);
});

// API: receive visitor events (from front-end test, other services, or real stream)
app.post("/api/visitor", async (req, res) => {
  const data = req.body;
  try {
    const v = await receiveVisitorEvent(data);
    res.json({ status: "ok", visitor: { id: v.id, accessLevel: v.accessLevel, intentionScore: v.intentionScore } });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// API: export logs
app.get("/api/audit/export", (req, res) => {
  const logs = auditLogger.query({});
  res.json(logs);
});

// API: trigger re-evaluation for all distinct visitors found in audit log
app.post("/api/reevaluate/all", async (req, res) => {
  try {
    const logs = auditLogger.query({});
    // gather unique visitorIds
    const ids = Array.from(new Set(logs.map(e => e.visitorId).filter(Boolean)));
    for (const id of ids) {
      // pull latest scores from last ASSESS_INTENTION if present, else skip
      const lastAssess = logs.slice().reverse().find(e => e.visitorId === id && e.action === "ASSESS_INTENTION");
      if (lastAssess && lastAssess.details && lastAssess.details.scores) {
        const scores = lastAssess.details.scores;
        // scores: object with peaceIndex, emotionalIntelligence, integrityScore
        const v = { id, peaceIndex: scores.peaceIndex, emotionalIntelligence: scores.emotionalIntelligence, integrityScore: scores.integrityScore };
        await receiveVisitorEvent(v);
      }
    }
    res.json({ status: "ok", message: "Re-evaluation triggered for existing visitors." });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// CLI flags: --verify and --export
if (process.argv.includes("--verify")) {
  const v = auditLogger.verify();
  if (v.valid) {
    console.log(`[AUDIT] Ledger OK (${v.totalEntries} entries)`);
    process.exit(0);
  } else {
    console.error("[AUDIT] Verification FAILED:", v.problems);
    process.exit(1);
  }
}

if (process.argv.includes("--export")) {
  const idx = process.argv.indexOf("--export");
  const arg = process.argv[idx + 1];
  const filter = arg ? JSON.parse(arg) : {};
  const exported = auditLogger.query(filter);
  const outPath = path.join(__dirname, "audit_export.json");
  fs.writeFileSync(outPath, JSON.stringify(exported, null, 2));
  console.log(`[AUDIT] Exported ${exported.length} entries to ${outPath}`);
  process.exit(0);
}

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`QT AI backend running on port ${PORT}`);
});
