 // ======================================================
// META BRAIN — STAGE 19B API SERVER WITH QONEXAI™ CORE
// PRODUCTION BACKEND (REST + WebSocket + Blockchain Layer)
// ======================================================

import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { createRequire } from "module";

// Handle CommonJS dependencies seamlessly inside ES Modules
const require = createRequire(import.meta.url);

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
// QONEXAI™ CORE SPLIT ENGINE (HIGH-EFFICIENCY REWARDS)
// ======================================================

app.post('/api/v1/process-notch-reward', (req, res) => {
  try {
    const { traderId, notch, giftAmount } = req.body;

    // Strict boundary validation
    if (notch < 0 || notch > 21) {
      return res.status(400).json({ error: "Invalid notch window" });
    }

    const BigNumber = require('bignumber.io');
    const { QonexLedgerChain } = require('./qonexBlockchain');
    const BlockchainStorage = require('./blockchainStorage');
    const { sendWhatsAppAlert } = require('./whatsappNotifier');

    const qonexBlockchain = new QonexLedgerChain();

    // Calculate precision efficiency loss 99.9999%^n
    const baseEfficiency = new BigNumber('0.999999');
    const efficiencyFactor = baseEfficiency.pow(notch);
    const effectiveGift = new BigNumber(giftAmount).multipliedBy(efficiencyFactor);

    // Derive 90/10 Split Distributions
    const traderPayout = effectiveGift.multipliedBy(0.90).toFixed(8);
    const philanthropyPayout = effectiveGift.multipliedBy(0.10).toFixed(8);

    const transactionMetadata = {
      traderId: traderId,
      notchLevel: notch,
      advertiserGiftRaw: giftAmount,
      systemEfficiencyApplied: efficiencyFactor.toFixed(12),
      traderDistribution: traderPayout,
      philanthropyDistribution: philanthropyPayout,
      routingDetails: {
        destinationAccount: "0299134895",
        institution: "WEMA BANK NIGERIA",
        layer: "QonexAI Philanthropy Layer"
      }
    };

    // Mine, Append to Blockchain file, and Send WhatsApp Notification
    const committedBlock = qonexBlockchain.addTransactionBlock(transactionMetadata);
    BlockchainStorage.appendBlock(committedBlock);

    sendWhatsAppAlert(
      committedBlock.index, 
      committedBlock.hash, 
      transactionMetadata.philanthropyDistribution,
      transactionMetadata.traderId,
      transactionMetadata.notchLevel
    ).catch(err => console.error("Async WhatsApp failed:", err));

    return res.status(200).json({
      status: "SUCCESS_SEALED_ON_BLOCKCHAIN",
      blockIndex: committedBlock.index,
      blockHash: committedBlock.hash
    });

  } catch (err) {
    return res.status(500).json({ error: "INTERNAL_CORE_SHIELD_FAILURE", details: err.message });
  }
});

// ======================================================
// STANDALONE LEDGER SEARCH ROUTE (ADMIN DASHBOARD API)
// ======================================================

app.get('/api/v1/ledger/search', (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Missing search criteria parameter." });
    }

    const BlockchainStorage = require('./blockchainStorage');
    const chain = BlockchainStorage.loadLedger();
    
    const matchedBlock = chain.find(block => 
      block.index.toString() === query || 
      block.hash === query
    );

    if (!matchedBlock) {
      return res.status(404).json({ error: "No block found with matching signature parameters." });
    }

    return res.status(200).json(matchedBlock);

  } catch (error) {
    return res.status(500).json({ error: "LEDGER_SEARCH_ENGINE_FAILURE" });
  }
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

export default app;
  
