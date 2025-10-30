/**
 * QuantumTrader-AI Server
 * Created by Olagoke Ajibulu
 * ----------------------------------------------
 * This file serves as the main entry point for QuantumTrader AI.
 * It initializes the Express server, configures routes, and
 * prepares the environment for both public and AI module access.
 */

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Default route (homepage)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Health check route
app.get("/status", (req, res) => {
  res.json({
    status: "QuantumTrader-AI operational",
    creator: "Olagoke Ajibulu",
    timestamp: new Date().toISOString(),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader-AI running on port ${PORT}`);
});
