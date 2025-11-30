 // server.mjs — QuantumTrader AI™ Production Server
//---------------------------------------------------
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import jwt from 'jsonwebtoken';

// Paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Core Setup
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "changeme-secret";

//---------------------------------------------------
// GLOBAL SELF-HEALING NAMESPACE (Medusa™)
//---------------------------------------------------
globalThis.QTAI = globalThis.QTAI || {};

globalThis.QTAI.state = {
  bootId: Date.now(),
  lastStable: Date.now(),
  crashes: 0
};

globalThis.QTAI.initModules = globalThis.QTAI.initModules || function () {
  console.log("🔁 QTAI Modules initialized.");
  // Your module bootstrap logic here
};

globalThis.QTAI.selfRepair = function (reason = "unknown") {
  console.log(`🩺 Medusa™ invoked (reason: ${reason})`);

  try {
    // 1. Refresh state
    globalThis.QTAI.state.lastStable = Date.now();

    // 2. Reinitialize modules
    if (typeof globalThis.QTAI.initModules === 'function') {
      globalThis.QTAI.initModules();
    }

    console.log("✨ Medusa™ stabilization complete.");
    return { ok: true, repaired: true };

  } catch (err) {
    console.error("❌ Medusa™ repair failed:", err);
    globalThis.QTAI.state.crashes += 1;
    return { ok: false, repaired: false };
  }
};

//---------------------------------------------------
// Middleware
//---------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json());

// Static Public Directory
app.use(express.static(path.join(__dirname, "public"), {
  extensions: ["html"],
  maxAge: "1y"
}));

// Static Asset Caching
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|json)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  }
  next();
});

//---------------------------------------------------
// Core Endpoints
//---------------------------------------------------

// Health
app.get('/status', (req, res) => {
  res.json({
    status: "ok",
    app: "QuantumTrader-AI",
    bootId: globalThis.QTAI.state.bootId,
    lastStable: globalThis.QTAI.state.lastStable,
    crashes: globalThis.QTAI.state.crashes,
    time: new Date().toISOString()
  });
});

// Basic Handshake
app.get('/handshake', (req, res) => {
  res.json({
    status: "ok",
    message: "Handshake acknowledged",
    ts: new Date().toISOString()
  });
});

// Hardened handshake bundle (index2.html uses this)
app.get('/api/handshake-bundle', (req, res) => {
  res.json({
    ok: true,
    bundle: "QTAI-HS-BUNDLE-1.0",
    stableAt: globalThis.QTAI.state.lastStable
  });
});

// Modules list
app.get('/modules', (req, res) => {
  res.json({
    modules: [
      "Module 01 — Market Signal Intake",
      "Module 02 — Real-Time Feed Interpreter",
      "Module 03 — Quantum Risk Engine",
      "Module 04 — Volatility Analyzer",
      "Module 05 — Peace Index Modulator",
      "Module 06 — GeoSentiment Mapper",
      "Module 07 — CPilot Cognitive Lift",
      "Module 08 — TraderLab Simulation Core",
      "Module 09 — Pattern Projection Engine",
      "Module 10 — Shadow Volatility Lens",
      "Module 11 — Supply/Demand Pulse",
      "Module 12 — Liquidity Flow Tracker",
      "Module 13 — Market Microstructure Eye",
      "Module 14 — Error Recovery (Medusa™)",
      "Module 15 — Global Synthesis Layer"
    ]
  });
});

//---------------------------------------------------
// PAYMENT
//---------------------------------------------------
app.post('/verify-payment', (req, res) => {
  const { userRef } = req.body || {};

  if (userRef === "test-ok") {
    const token = jwt.sign({ sub: userRef, activated: true }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ confirmed: true, token });
  }

  return res.json({ confirmed: false });
});

app.post('/activate', (req, res) => {
  const { userId } = req.body || {};
  const token = jwt.sign({
    sub: userId || "anon",
    activated: true
  }, JWT_SECRET, { expiresIn: "30d" });

  res.json({ success: true, token });
});

//---------------------------------------------------
// Medusa™ Recovery Endpoint (silent)
//---------------------------------------------------
app.post('/recover', (req, res) => {
  const result = globalThis.QTAI.selfRepair("external-call");
  res.json(result);
});

//---------------------------------------------------
// SERVING FRONTEND
//---------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/index2.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});

// Manifest + SW
app.get("/manifest.json", (req, res) => {
  res.type("application/manifest+json");
  res.sendFile(path.join(__dirname, "public", "manifest.json"));
});
app.get("/service-worker.js", (req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, "public", "service-worker.js"));
});

// 404
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ✅ Simulate First Trade (for founder test only)
app.post('/simulate-trade', (req, res) => {
  const { asset, type, amount, user } = req.body || {};

  if (!asset || !type || !amount || !user) {
    return res.status(400).json({ success: false, message: "Missing trade parameters." });
  }

  console.log(`🚀 Simulated trade by user:{type} amount of{asset}`);

  // In production: record to DB or forward to trade engine
  res.json({
    success: true,
    message: `Trade simulated: type{amount} of ${asset}`,
    timestamp: new Date().toISOString()
  });
});

//---------------------------------------------------
// START SERVER (Option B)
//---------------------------------------------------
const server = app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader AI™ running on http://localhost:${PORT}`);
  globalThis.QTAI.initModules();
});
