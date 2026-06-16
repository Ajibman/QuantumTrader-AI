// ======================================================
// META BRAIN — STAGE 19B API SERVER
// PRODUCTION BACKEND (REST + WebSocket + Deployment Layer)
// ======================================================

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

// CORE SYSTEM
import { metaBrain } from "./meta_brain.js";

// 19A DEPLOYMENT LAYER
import { MetaBrainDeploymentLayer } from "./deployment_layer.js";

// WRAPPED SYSTEM (IMPORTANT)
const deployedBrain = new MetaBrainDeploymentLayer(metaBrain);

// ======================================================
// APP INIT
// ======================================================

const app = express();
app.use(express.json({ limit: "1mb" }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "MetaBrain",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// ======================================================
// SINGLE SIGNAL EVALUATION
// ======================================================

app.post("/evaluate", (req, res) => {
  try {
    const signal = req.body;

    const result = deployedBrain.evaluate(signal);

    res.json({
      success: true,
      result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ======================================================
// BATCH SIGNAL PROCESSING
// ======================================================

app.post("/batch", (req, res) => {
  try {
    const signals = req.body.signals || [];

    const results = deployedBrain.batch(signals);

    res.json({
      success: true,
      count: results.length,
      results
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ======================================================
// SYSTEM SNAPSHOT (MONITORING)
// ======================================================

app.get("/snapshot", (req, res) => {
  try {
    res.json({
      success: true,
      snapshot: deployedBrain.snapshot()
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ======================================================
// METRICS (19A LAYER)
// ======================================================

app.get("/metrics", (req, res) => {
  res.json({
    success: true,
    metrics: deployedBrain.getMetrics()
  });
});

// ======================================================
// RESET METRICS (ADMIN USE)
// ======================================================

app.post("/metrics/reset", (req, res) => {
  deployedBrain.resetMetrics();

  res.json({
    success: true,
    message: "Metrics reset"
  });
});

// ======================================================
// LIVE STREAMING (WEBSOCKET)
// ======================================================

wss.on("connection", (ws) => {
  console.log("🔌 Client connected to MetaBrain stream");

  ws.send(JSON.stringify({
    type: "connection",
    status: "connected",
    message: "MetaBrain live stream active"
  }));

  ws.on("message", (msg) => {
    try {
      const signal = JSON.parse(msg.toString());

      const result = deployedBrain.evaluate(signal);

      ws.send(JSON.stringify({
        type: "evaluation",
        data: result
      }));

    } catch (err) {
      ws.send(JSON.stringify({
        type: "error",
        error: "INVALID_SIGNAL",
        message: err.message
      }));
    }
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});

// ======================================================
// GLOBAL ERROR HANDLING
// ======================================================

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);

  res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR"
  });
});

// ======================================================
// START SERVER
// ======================================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("==================================================");
  console.log("🧠 META BRAIN SYSTEM ONLINE");
  console.log("🚀 STAGE 19B API SERVER RUNNING");
  console.log(`🌐 Port: ${PORT}`);
  console.log("==================================================");
});
