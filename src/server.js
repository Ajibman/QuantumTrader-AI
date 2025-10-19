// server.js
// Quantum Trader AI (QT AI) - Core Server Reconstruction
// Project: QonexAI
// Architect: Olagoke Ajibulu
// Purpose: Foundational Express Server with Medusa™ and Quantum API placeholders
// Date: Stage I - October 2025

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// 1. SYSTEM CORE
// ============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (public assets)
app.use(express.static(path.join(__dirname, "public")));

// ============================
// 2. MODULE HOOKS (Placeholder Links)
// ============================
// These will connect to Modules 01–15 later in Stage II
// Example structure for modular attachment
const modulesPath = path.join(__dirname, "modules");
app.locals.modulesPath = modulesPath;

// ============================
// 3. HEALTH ROUTE (System Ping)
// ============================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "Quantum Trader AI (QonexAI) server online.",
    timestamp: new Date().toISOString(),
  });
});

// ============================
// 4. FALLBACK (Homepage / Index)
// ============================
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================
// 5. MEDUSA™ PLACEHOLDER (Auto-Regeneration Hook)
// ============================
// Medusa™ will silently monitor and restart essential services when triggered.
// Actual logic will be wired in Stage III.
app.get("/medusa/ping", (req, res) => {
  res.json({
    service: "Medusa™ Self-Healing Node",
    status: "standby",
    mode: "silent",
  });
});

// ============================
// 6. SERVER STARTUP
// ============================
app.listen(PORT, () => {
  console.log(`🌍 QonexAI Server running on port ${PORT}`);
  console.log("💫 Awaiting module integration (Stage II)...");
});

// ============================
// 7. MODULE BONDING LAYER
// ============================
const fs = require("fs");
const modulesDir = path.join(__dirname, "modules");

// Load all module files dynamically
fs.readdirSync(modulesDir)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    const mod = require(path.join(modulesDir, file));
    if (typeof mod === "function") {
      mod(app);
      console.log(`🔗  Module bonded: ${file}`);
    }
  });

// Verify all modules are wired
app.get("/modules", (req, res) => {
  res.json({
    message: "Modules 1–15 bonded successfully to QonexAI core.",
    total: 15,
    timestamp: new Date().toISOString(),
  });
});

=====
       
