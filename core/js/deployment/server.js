 // ======================================================
// META BRAIN — STAGE 31 PRODUCTION SERVER
// FULL SYSTEM: CORE + SAFETY + EXECUTION BINDING
// ======================================================

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

// CORE ENGINE
import { metaBrain, capitalControl } from "../meta_brain.js";

// SYSTEM LAYERS (SAFE IMPORTS)
import { ComplianceAuditLayer } from "../compliance_audit_layer.js";
import { SelfOptimizationEngine } from "../self_optimization_engine.js";
import { InstitutionalDashboardLayer } from "../institutional_dashboard_layer.js";
import { MultiRegionFailoverLayer } from "../multi_region_failover_layer.js";

// STAGE 31 — EXECUTION SYSTEM
import { ExecutionRouter } from "../execution/execution_router.js";
import { OrderManager } from "../execution/order_manager.js";
import { ExecutionQueue } from "../execution/execution_queue.js";

// ======================================================
// APP INIT
// ======================================================

const app = express();
app.use(express.json({ limit: "1mb" }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ======================================================
// SAFE INIT STATE
// ======================================================

let dashboard = null;
let compliance = null;
let optimizer = null;
let failover = null;

let executionRouter = null;
let orderManager = null;
let executionQueue = null;

let systemReady = false;

// ======================================================
// INIT LAYERS (BOOTSTRAP)
// ======================================================

function initLayers() {
  try {
    // -------------------------
    // STAGE 30 CORE LAYERS
    // -------------------------

    compliance = new ComplianceAuditLayer();

    optimizer = new SelfOptimizationEngine({
      learning: metaBrain.learning,
      complianceLayer: compliance
    });

    failover = new MultiRegionFailoverLayer();

    dashboard = new InstitutionalDashboardLayer({
      metaBrain,
      capitalControl,
      complianceLayer: compliance,
      optimizationEngine: optimizer,
      failoverLayer: failover,
      executionCluster: null
    });

    // -------------------------
    // STAGE 31 EXECUTION LAYERS
    // -------------------------

    executionRouter = new ExecutionRouter({
      mode: process.env.EXECUTION_MODE || "paper"
    });

    orderManager = new OrderManager();

    executionQueue = new ExecutionQueue(
      executionRouter,
      orderManager
    );

    systemReady = true;
  } catch (err) {
    console.error("🔥 SYSTEM BOOT FAILURE:", err);
    systemReady = false;
    throw err;
  }
}

// ======================================================
// EXECUTION BINDING FUNCTION (CRITICAL)
// ======================================================

function submitExecution(intent) {
  if (!executionQueue) return;

  executionQueue.push(intent);
}

// ======================================================
// HEALTH CHECK
// ======================================================

app.get("/health", (_, res) => {
  res.json({
    status: systemReady ? "OK" : "BOOTING",
    stage: 31,
    meta: dashboard?.getSummary?.() || null,
    executionMode: executionRouter?.mode || null,
    timestamp: Date.now()
  });
});

// ======================================================
// CORE EVALUATION + EXECUTION BINDING
// ======================================================

app.post("/evaluate", (req, res) => {
  try {
    const signal = req.body;

    const result = metaBrain.evaluate(signal);

    // -------------------------
    // COMPLIANCE LOGGING
    // -------------------------
    compliance.record({
      signal,
      decision: result,
      execution: result.execution,
      meta: result.meta
    });

    // -------------------------
    // EXECUTION BINDING (STAGE 31)
    // -------------------------
    if (result.execution && result.execution.status !== "BLOCKED") {
      submitExecution(result.execution);
    }

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
// BATCH SIGNALS
// ======================================================

app.post("/batch", (req, res) => {
  try {
    const signals = req.body.signals || [];

    const results = signals.map(s => {
      const r = metaBrain.evaluate(s);

      if (r.execution && r.execution.status !== "BLOCKED") {
        submitExecution(r.execution);
      }

      return r;
    });

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
// SYSTEM SNAPSHOT
// ======================================================

app.get("/snapshot", (_, res) => {
  res.json({
    success: true,
    snapshot: dashboard?.getSystemOverview?.()
  });
});

// ======================================================
// METRICS
// ======================================================

app.get("/metrics", (_, res) => {
  res.json({
    success: true,
    metrics: compliance?.generateReport?.()
  });
});

// ======================================================
// OPTIMIZATION (STAGE 28 HOOK)
// ======================================================

app.post("/optimize", (_, res) => {
  const result = optimizer?.runOptimization?.();
  res.json({ success: true, result });
});

// ======================================================
// LIVE DASHBOARD FEED
// ======================================================

app.get("/live", (_, res) => {
  res.json(dashboard?.getLiveFeed?.());
});

// ======================================================
// ORDER STATUS (NEW STAGE 31 ENDPOINT)
// ======================================================

app.get("/orders", (_, res) => {
  res.json({
    success: true,
    orders: orderManager?.getAll?.() || []
  });
});

// ======================================================
// WEBSOCKET STREAM (REALTIME)
// ======================================================

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({
    type: "connected",
    stage: 31,
    executionMode: executionRouter?.mode || null
  }));

  ws.on("message", (msg) => {
    try {
      const signal = JSON.parse(msg.toString());

      const result = metaBrain.evaluate(signal);

      if (result.execution && result.execution.status !== "BLOCKED") {
        submitExecution(result.execution);
      }

      ws.send(JSON.stringify({
        type: "result",
        data: result
      }));

    } catch (err) {
      ws.send(JSON.stringify({
        type: "error",
        message: err.message
      }));
    }
  });
});

// ======================================================
// SERVER START
// ======================================================

const PORT = process.env.PORT || 3000;

export function createServer() {
  try {
    initLayers();

    server.listen(PORT, () => {
      console.log("====================================");
      console.log("🧠 META BRAIN SYSTEM ONLINE");
      console.log("🚀 STAGE 31 ACTIVE (EXECUTION BINDING)");
      console.log(`🌐 PORT: ${PORT}`);
      console.log(`⚙️ MODE: ${executionRouter.mode}`);
      console.log("====================================");
    });

  } catch (err) {
    console.error("BOOT FAILURE:", err);
    process.exit(1);
  }
      }
