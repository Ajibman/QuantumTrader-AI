 import express from "express";
import cors from "cors";

import { Engine } from "./engine/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Root Endpoint
 */
app.get("/", (req, res) => {
  res.json({
    application: "QuantumTrader-AI",
    version: "0.1.0",
    status: "online",
    engine: "QONEXAI Core"
  });
});

/**
 * API Status
 */
app.get("/api/status", (req, res) => {
  res.json(
    Engine.status()
  );
});

app.get("/api/state", (req, res) => {
  res.json(
    Engine.getAppState()
  );
});

/**
 * Signal Endpoint
 */
app.get("/api/signal", (req, res) => {
  res.json(
    Engine.signal({
      source: "api"
    })
  );
});

/**
 * CPilot Endpoint
 */
app.get("/api/cpilot", (req, res) => {
  res.json(
    Engine.cpilot({
      source: "api"
    })
  );
});

/**
 * Simulation Endpoint
 */
app.get("/api/simulation", (req, res) => {
  res.json(
    Engine.simulation({
      source: "api"
    })
  );
});

/**
 * TraderLab Endpoint
 */
app.get("/api/traderlab", (req, res) => {
  res.json(
    Engine.traderlab({
      source: "api"
    })
  );
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `QuantumTrader-AI API running on port ${PORT}`
  );
});
