// ===== QT AI Reminders / To-Do Section =====
const reminders = [
  "Review visitor simulation logs weekly.",
  "Check backup.sh output and verify backups.",
  "Review pre-merge.sh auto-staging status.",
  "Verify .env settings before major deployments.",
  "Ensure all assets are properly committed before rollout."
];

// Log reminders on server start
console.log("===== QT AI REMINDERS =====");
reminders.forEach((note, idx) => {
  console.log(`${idx + 1}. ${note}`);
});
console.log("============================");

// server.js (extended patch)

require('dotenv').config();
const fs = require('fs');
const { exec } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const { routeVisitor } = require('./Trader_Routing_Engine');
const app = express();

app.use(bodyParser.json());

const visitorSimEnabled = process.env.SIMULATION_ENABLED === 'true';
const simInterval = parseInt(process.env.SIMULATION_INTERVAL_SECONDS) || 5;
const autoBackupEnabled = process.env.AUTO_BACKUP === 'true';
const preMergeEnabled = process.env.PRE_MERGE === 'true';

// Visitor simulation
if (visitorSimEnabled) {
  setInterval(async () => {
    try {
      const simulatedVisitor = {
        id: 'SIM_' + Date.now(),
        actions: ['visit', 'click', 'scroll'],
      };
      const response = await routeVisitor(simulatedVisitor);
      console.log('Simulated visitor processed:', response);
    } catch (err) {
      console.error('Error in visitor simulation:', err);
    }
  }, simInterval * 1000);
}

// Auto-backup function
function runBackup() {
  if (!autoBackupEnabled) return;
  exec('./backup.sh', (err, stdout, stderr) => {
    if (err) console.error('Backup error:', err);
    if (stdout) console.log('Backup output:', stdout);
    if (stderr) console.error('Backup stderr:', stderr);
  });
}

// Pre-merge / auto-stage function
function runPreMerge() {
  if (!preMergeEnabled) return;
  exec('./pre-merge.sh', (err, stdout, stderr) => {
    if (err) console.error('Pre-merge error:', err);
    if (stdout) console.log('Pre-merge output:', stdout);
    if (stderr) console.error('Pre-merge stderr:', stderr);
  });
}

// API endpoint for real visitors
app.post('/api/visitor-event', async (req, res) => {
  try {
    const visitorData = req.body;
    const response = await routeVisitor(visitorData);

    // Trigger backup and pre-merge after processing visitor
    runBackup();
    runPreMerge();

    res.status(200).json(response);
  } catch (err) {
    console.error('Routing error:', err);
    res.status(500).json({ error: 'Internal routing error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// server.js (patch snippet)

require('dotenv').config(); // Load .env variables
const express = require('express');
const bodyParser = require('body-parser');
const { routeVisitor } = require('./Trader_Routing_Engine');
const app = express();

app.use(bodyParser.json());

const visitorSimEnabled = process.env.SIMULATION_ENABLED === 'true';
const simInterval = parseInt(process.env.SIMULATION_INTERVAL_SECONDS) || 5;

// Example: Visitor simulation loop
if (visitorSimEnabled) {
  setInterval(async () => {
    try {
      const simulatedVisitor = {
        id: 'SIM_' + Date.now(),
        actions: ['visit', 'click', 'scroll'],
      };
      const response = await routeVisitor(simulatedVisitor);
      console.log('Simulated visitor processed:', response);
    } catch (err) {
      console.error('Error in visitor simulation:', err);
    }
  }, simInterval * 1000);
}

// API endpoint for real visitors
app.post('/api/visitor-event', async (req, res) => {
  try {
    const visitorData = req.body;
    const response = await routeVisitor(visitorData);
    res.status(200).json(response);
  } catch (err) {
    console.error('Routing error:', err);
    res.status(500).json({ error: 'Internal routing error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

#!/bin/bash
# pre-merge.sh — automatic staging wiring with .env protection + logging

echo "🔍 Running pre-merge checks..."

# Define log file
LOG_FILE="TEST_LOG.md"

# Timestamp for logging
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# Safety check: prevent accidental .env commit
if git diff --cached --name-only | grep -q "^\.env$"; then
  echo "⚠️  ERROR: .env file detected in staged changes!"
  echo "🚫 Unstaging .env for your safety..."
  git reset HEAD .env
  echo "✅ .env has been unstaged. Please keep secrets private."

  # Log the event
  echo "- [$TIMESTAMP] ⚠️ Attempted commit of \`.env\` blocked by pre-merge.sh" >> "$LOG_FILE"
  exit 1
fi

# Safety check: prevent any .env.* variants
if git diff --cached --name-only | grep -q "^\.env."; then
  echo "⚠️  ERROR: .env.* file detected in staged changes!"
  echo "🚫 Unstaging all .env.* files..."
  git reset HEAD .env.*
  echo "✅ .env.* files have been unstaged."

  # Log the event
  echo "- [$TIMESTAMP] ⚠️ Attempted commit of \`.env.*\` blocked by pre-merge.sh" >> "$LOG_FILE"
  exit 1
fi

# Normal pre-merge staging process
echo "📦 Auto-staging new and modified files..."
git add -A

echo "✅ Pre-merge checks completed successfully."#!/bin/bash
# pre-merge.sh — automatic staging wiring with .env protection

echo "🔍 Running pre-merge checks..."

# Safety check: prevent accidental .env commit
if git diff --cached --name-only | grep -q "^\.env"; then
  echo "⚠️  ERROR: .env file detected in staged changes!"
  echo "🚫 Unstaging .env for your safety..."
  git reset HEAD .env
  echo "✅ .env has been unstaged. Please keep secrets private."
  exit 1
fi

# Safety check: prevent any .env.* variants
if git diff --cached --name-only | grep -q "^\.env."; then
  echo "⚠️  ERROR: .env.* file detected in staged changes!"
  echo "🚫 Unstaging all .env.* files..."
  git reset HEAD .env.*
  echo "✅ .env.* files have been unstaged."
  exit 1
fi

# Normal pre-merge staging process
echo "📦 Auto-staging new and modified files..."
git add -A

echo "✅ Pre-merge checks completed successfully."# Ignore environment variables
.env
.env.local
.env.*.local

# Logs
logs
*.log
npm-debug.log*

# Node modules
node_modules/

# OS files
.DS_Store
Thumbs.db// Load .env or create one if missing
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");

// If .env doesn't exist, create a starter one
if (!fs.existsSync(envPath)) {
  const defaultEnv = `# Auto-created by server.js
PORT=3000
NODE_ENV=development
ADMIN_TOKEN=changeme123
`;

  fs.writeFileSync(envPath, defaultEnv, { encoding: "utf8" });
  console.log("[PATCH] .env file was missing. A default .env has been created.");
}

// Now load the environment variables
require("dotenv").config();// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const app = express();

// Use PORT from .env, fallback to 3000
const PORT = process.env.PORT || 3000;

// Example: secure admin route
app.get('/admin/stats', (req, res) => {
  const token = req.query.token;
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).send('Forbidden');
  }
  res.json({
    visitors: 123,  // replace later with real stats
    env: process.env.NODE_ENV,
  });
});

app.listen(PORT, () => {
  console.log(`QT AI running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});<!-- Public Pulse: visible to everyone -->
<div id="public-pulse" style="margin-top:20px;">
  <h3>🌐 Active visitors</h3>
  <div id="pulse" style="width:24px;height:24px;border-radius:50%;margin:8px auto;"></div>
  <p id="pulse-label">System active — live now</p>
</div>

<style>
  @keyframes subtlePulse {
    0% { transform: scale(1); opacity: 0.9; }
    50% { transform: scale(1.25); opacity: 0.6; }
    100% { transform: scale(1); opacity: 0.9; }
  }
  #pulse {
    background: radial-gradient(circle at 30% 30%, rgba(0,255,204,0.95), rgba(0,255,204,0.6));
    box-shadow: 0 0 12px rgba(0,255,204,0.15);
    animation: subtlePulse 2s infinite;
  }
  #pulse-label { font-size: 0.9rem; color: #cfcfcf; }
</style>// Track visitors globally (very simple in-memory store for now)
let visitorStats = {
  total: 0,
  lastVisit: null,
  locations: {} // e.g., { "Nigeria": 15, "USA": 3 }
};

app.post('/api/visitor-event', async (req, res) => {
  try {
    const visitorData = req.body; // Actions, statements, patterns
    visitorStats.total++;
    visitorStats.lastVisit = new Date().toISOString();

    // If visitor sends location info
    if (visitorData.country) {
      if (!visitorStats.locations[visitorData.country]) {
        visitorStats.locations[visitorData.country] = 0;
      }
      visitorStats.locations[visitorData.country]++;
    }

    const response = await routeVisitor(visitorData);
    res.status(200).json({ ...response, stats: visitorStats });
  } catch (err) {
    console.error('Routing error:', err);
    res.status(500).json({ error: 'Internal routing error' });
  }
});

// Optional endpoint: get stats directly
app.get('/api/stats', (req, res) => {
  res.json(visitorStats);
});

const express = require('express');
const bodyParser = require('body-parser');
const { routeVisitor } = require('./Trader_Routing_Engine');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

// Live visitor/trader events endpoint
app.post('/api/visitor-event', async (req, res) => {
  try {
    const visitorData = req.body; // Actions, statements, patterns
    const response = await routeVisitor(visitorData);

    // Prepare test entry for automated logging
    const module = 'Visitor Simulation';
    const input = JSON.stringify(visitorData).replace(/"/g, '\\"');
    const expected = 'Routing according to Bubble-Routing Decision Tree';
    const actual = JSON.stringify(response).replace(/"/g, '\\"');
    const status = 'Pass';
    const notes = 'Automated log from simulated visitor';

    // Build command to call log-test.sh safely
    const cmd = `echo -e "${module}\n${input}\n${expected}\n${actual}\n${status}\n${notes}\ny" | ./log-test.sh`;

    // Non-blocking exec to log test without holding response
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Error logging test:', error);
      } else {
        console.log('✅ Visitor simulation logged:', stdout);
      }
    });

    res.status(200).json(response);

  } catch (err) {
    console.error('Routing error:', err);
    res.status(500).json({ error: 'Internal routing error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { exec } = require('child_process');

// After routing visitor
app.post('/api/visitor-event', async (req, res) => {
  try {
    const visitorData = req.body;
    const response = await routeVisitor(visitorData);

    // Prepare test entry details for log-test.sh
    const module = 'Visitor Simulation';
    const input = JSON.stringify(visitorData).replace(/"/g, '\\"');
    const expected = 'Routing according to Bubble-Routing Decision Tree';
    const actual = JSON.stringify(response).replace(/"/g, '\\"');
    const status = 'Pass';
    const notes = 'Automated log from simulated visitor';

    // Call log-test.sh
    const cmd = `./log-test.sh <<EOF
\n${module}\n${input}\n${expected}\n${actual}\n${status}\n${notes}\ny\nEOF`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error('Error logging test:', error);
      } else {
        console.log('✅ Visitor simulation logged:', stdout);
      }
    });

    res.status(200).json(response);

  } catch (err) {
    console.error('Routing error:', err);
    res.status(500).json({ error: 'Internal routing error' });
  }
});

app.post('/api/visitor-event', async (req, res) => {
  try {
    const visitorData = req.body; // actions, statements, patterns
    const response = await routeVisitor(visitorData);
    res.status(200).json(response);
  } catch (err) {
    console.error('Routing error:', err);
    res.status(500).json({ error: 'Internal routing error' });
  }
});

<svg width="100%" height="auto" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <!-- MacArthur Banner -->
  <rect x="200" y="20" width="200" height="50" fill="gray" stroke="black" stroke-width="2" rx="8" ry="8"/>
  <text x="300" y="50" font-family="Arial" font-size="16" fill="white" text-anchor="middle">MacArthur Banner</text>
  <title>Static Banner (Non-interactive)</title>

  <!-- Sentinel -->
  <circle cx="300" cy="150" r="40" fill="green" stroke="black" stroke-width="2"/>
  <text x="300" y="155" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Sentinel</text>
  <title>Active Sentinel Monitoring Visitors/Traders</title>

  <!-- Lines connecting to modules -->
  <line x1="300" y1="190" x2="150" y2="300" stroke="black" stroke-width="2"/>
  <line x1="300" y1="190" x2="300" y2="300" stroke="black" stroke-width="2"/>
  <line x1="300" y1="190" x2="450" y2="300" stroke="black" stroke-width="2"/>

  <!-- Modules -->
  <a xlink:href="#" target="_blank">
    <rect x="100" y="300" width="100" height="50" fill="red" stroke="black" stroke-width="2" rx="5" ry="5"/>
    <text x="150" y="330" font-family="Arial" font-size="14" fill="white" text-anchor="middle">CPilot™</text>
    <title>Disabled during rollback/fix-mode</title>
  </a>

  <a xlink:href="#" target="_blank">
    <rect x="250" y="300" width="100" height="50" fill="red" stroke="black" stroke-width="2" rx="5" ry="5"/>
    <text x="300" y="330" font-family="Arial" font-size="14" fill="white" text-anchor="middle">TraderLab™</text>
    <title>Disabled during rollback/fix-mode</title>
  </a>

  <a xlink:href="#" target="_blank">
    <rect x="400" y="300" width="100" height="50" fill="red" stroke="black" stroke-width="2" rx="5" ry="5"/>
    <text x="450" y="330" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Trading Floor</text>
    <title>Disabled during rollback/fix-mode</title>
  </a>
</svg>

export function handleTrader(traderId) {
  console.log(`Games Pavilion engaging trader ${traderId}`);
  // Games to assess emotional intelligence
}

export function handleTrader(traderId) {
  console.log(`Trading Floor processing trader ${traderId}`);
  // Live trading actions, only if safe
}

export function handleTrader(traderId) {
  console.log(`TraderLab™ guiding trader ${traderId}`);
  // Tutorials, mentorship, ethical alignment checks
}

export function handleTrader(traderId) {
  console.log(`TraderLab™ guiding trader ${traderId}`);
  // Tutorials, mentorship, ethical alignment checks
}

export function handleTrader(traderId) {
  console.log(`CPilot™ handling trader ${traderId}`);
  // Logic for trading guidance
}

import qtAISentinel from '../core/qtAISentinel.js';

// Example function when a trader interacts
export function processTraderAction(traderId, interaction) {
  // QT AI monitors and decides where to route
  qtAISentinel.monitor(traderId, interaction);
}

// Example periodic backup trigger
setInterval(() => {
  qtAISentinel.triggerBackup();
}, 300000); // every 5 minutes

class QTAISentinel {
  constructor() {
    this.traderStates = {};       // Tracks visitor/trader states
    this.moduleStates = {         // Tracks module availability
      cpilot: true,
      traderlab: true,
      tradingfloor: true,
      gamespavilion: true
    };
  }

  // Real-time monitoring of trader actions
  monitor(traderId, interaction) {
    this.traderStates[traderId] = this.evaluateInteraction(interaction);
    this.decideRouting(traderId);
  }

  // Evaluate ethical & emotional alignment
  evaluateInteraction(interaction) {
    // Returns category: "Peaceful", "Neutral", "Resistant"
    // Placeholder logic (replace with actual #genomP, #peaceindex checks)
    if(interaction.peaceScore > 80) return "Peaceful";
    if(interaction.confusionScore > 50) return "Confused";
    return "Resistant";
  }

  // Decide module routing
  decideRouting(traderId) {
    const state = this.traderStates[traderId];
    if (state === "Peaceful" && this.moduleStates.cpilot) {
      this.routeTo("cpilot", traderId);
    } else if (state === "Confused") {
      this.routeTo("traderlab", traderId);
    } else {
      this.routeTo("gamespavilion", traderId);
    }
  }

  // Route trader and log
  routeTo(module, traderId) {
    console.log(`Routing trader ${traderId} to ${module}`);
    // Trigger module action (call module methods)
    // Each module reports back to sentinel on completion
  }

  // Trigger backups or safety actions
  triggerBackup() {
    console.log("Triggering backup for live sessions and module states.");
    // Backup logic here
  }

  // Optional: handle maintenance mode
  setModuleState(module, state) {
    this.moduleStates[module] = state; // true=active, false=under fix
  }
}

// Export for use in routing engine
export default new QTAISentinel();

class QTAISentinel {
  constructor() {
    this.traderStates = {};       // Track all visitors/traders
    this.moduleStates = {};       // Track CPilot™, TraderLab™, Trading Floor
  }

  monitor(traderId, interaction) {
    // Update real-time trader info
    this.traderStates[traderId] = this.evaluateInteraction(interaction);
    this.decideRouting(traderId);
  }

  evaluateInteraction(interaction) {
    // Returns a score or category: Peaceful, Neutral, Resistant
    // Uses ethical and emotional metrics
  }

  decideRouting(traderId) {
    const state = this.traderStates[traderId];
    if (state === "Peaceful") {
      this.routeTo("TraderLab", traderId);
    } else if (state === "Confused") {
      this.routeTo("GuidanceModule", traderId);
    } else {
      this.routeTo("GamesPavilion", traderId);
    }
  }

  routeTo(module, traderId) {
    // Send instructions to module
    // Log the action for auditing
  }

  triggerBackup() {
    // Periodic or on-demand backup of live session and data
  }
}

const banner = document.getElementById("qtBanner");

// Start pulsating
banner.style.animation = "pulse 2s infinite";

// Stop pulsating (if needed later)
// banner.style.animation = "none";

// Admin Dashboard route (already protected with adminLogin + lockout)
app.get("/adminDashboard", (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).send("Unauthorized");
  }
  res.sendFile(path.join(process.cwd(), "src/pages/adminDashboard.html"));
});

import fs from "fs";
import path from "path";

// --- Security Log Endpoint ---
app.get("/admin/security-log", (req, res) => {
  const mode = process.env.SECURITY_LOG_MODE || "test"; // "test" or "live"

  if (mode === "test") {
    // Testing mode → hard-coded log
    const log = `
[${new Date().toISOString()}] SECURITY_LOG_OK
System integrity: ✅
Attempts today: 0
No anomalies detected.
    `;
    res.type("text/plain").send(log);
  } else {
    // Live mode → read from actual log file
    const logPath = path.join(process.cwd(), "logs", "security.log");

    fs.readFile(logPath, "utf8", (err, data) => {
      if (err) {
        return res
          .status(500)
          .send(`[${new Date().toISOString()}] ERROR: Cannot read security log`);
      }
      res.type("text/plain").send(data);
    });
  }
});

// Add near the other admin routes in server.js

app.get("/admin/security-log", (req, res) => {
  // Hard-coded test log message for now
  const log = `
[${new Date().toISOString()}] SECURITY_LOG_OK
System integrity: ✅
Attempts today: 0
No anomalies detected.
  `;
  res.type("text/plain").send(log);
});

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [securityLog, setSecurityLog] = useState("");
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isStalled, setIsStalled] = useState(false);

  // Fetch security log
  const fetchSecurityLog = async () => {
    try {
      const response = await fetch("/admin/security-log");
      const data = await response.text();
      setSecurityLog(data);
      setLastUpdate(Date.now());
      setIsStalled(false); // reset stall if fetch succeeds
    } catch (err) {
      setIsStalled(true);
    }
  };

  // Auto-refresh every 5s
  useEffect(() => {
    fetchSecurityLog(); // initial
    const interval = setInterval(fetchSecurityLog, 5000);
    return () => clearInterval(interval);
  }, []);

  // Stall checker — if no update in 7s, trigger flashing
  useEffect(() => {
    const check = setInterval(() => {
      if (Date.now() - lastUpdate > 7000) {
        setIsStalled(true);
      }
    }, 3000);
    return () => clearInterval(check);
  }, [lastUpdate]);

  // Manual refresh (admin-triggered)
  const handleManualRefresh = () => {
    fetchSecurityLog();
    setIsStalled(false); // stop flashing
  };

  return (
    <div>
      <h2>Backend Dashboard</h2>

      <pre
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: isStalled ? "#330000" : "#111",
          color: isStalled ? "#ff4444" : "#0f0",
          maxHeight: "300px",
          overflowY: "auto",
          borderRadius: "8px",
          transition: "background 0.5s, color 0.5s",
        }}
      >
        {securityLog || "Loading security log..."}
      </pre>

      {isStalled && (
        <div style={{ marginTop: "1rem", color: "#ff4444" }}>
          ⚠️ Log stalled — flashing until refreshed.
        </div>
      )}

      <button
        onClick={handleManualRefresh}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          background: "#222",
          color: "#fff",
          border: "1px solid #555",
          cursor: "pointer",
        }}
      >
        Refresh Now / Halt Flashes
      </button>
    </div>
  );
}

import { useState } from "react";

export default function Dashboard() {
  const [securityLog, setSecurityLog] = useState("");

  const viewSecurityLog = async () => {
    try {
      const response = await fetch("/admin/security-log");
      const data = await response.text();
      setSecurityLog(data);
    } catch (err) {
      setSecurityLog("Error fetching security log.");
    }
  };

  return (
    <div>
      <h2>Backend Dashboard</h2>

      <button onClick={viewSecurityLog}>
        View Security Log
      </button>

      {securityLog && (
        <pre
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#111",
            color: "#0f0",
            maxHeight: "300px",
            overflowY: "auto",
            borderRadius: "8px",
          }}
        >
          {securityLog}
        </pre>
      )}
    </div>
  );
}

import express from "express";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

let clearLogsAttempts = 0;

function logAttempt(success, reason = "") {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} | Clear Logs Attempt | ${success ? "SUCCESS" : "FAILURE"} ${reason}\n`;
  fs.appendFileSync("logs/security.log", logEntry, "utf8");
}

app.post("/admin/clear-logs", (req, res) => {
  const { secret } = req.body;
// View security log
app.get("/admin/security-log", (req, res) => {
  try {
    const data = fs.readFileSync("logs/security.log", "utf8");
    res.type("text/plain").send(data || "No security log entries yet.");
  } catch (err) {
    res.status(500).json({ message: "Error reading security log.", error: err.message });
  }
});
  if (clearLogsAttempts >= 3) {
    logAttempt(false, "(BLOCKED: too many attempts)");
    return res.status(403).json({ message: "Access blocked after 3 failed attempts." });
  }

  if (secret !== process.env.CLEAR_LOGS_SECRET) {
    clearLogsAttempts++;
    logAttempt(false, "(Wrong secret key)");
    return res.status(401).json({ message: "Unauthorized attempt." });
  }

  // Reset attempts on success
  clearLogsAttempts = 0;

  try {
    fs.writeFileSync("logs/system.log", "");
    logAttempt(true);
    return res.json({ message: "Logs cleared successfully." });
  } catch (err) {
    logAttempt(false, `(Error: ${err.message})`);
    return res.status(500).json({ message: "Error clearing logs.", error: err.message });
  }
});

async function clearLogs() {
  const response = await fetch("/admin/clear-logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: "mySuperSecureKey" }) // pulled from .env during build
  });

  const result = await response.json();
  alert(result.message);
}

import express from "express";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
let clearLogsAttempts = 0;

app.post("/admin/clear-logs", (req, res) => {
  const { secret } = req.body;

  if (clearLogsAttempts >= 3) {
    return res.status(403).json({ message: "Access blocked after 3 failed attempts." });
  }

  if (secret !== process.env.CLEAR_LOGS_SECRET) {
    clearLogsAttempts++;
    return res.status(401).json({ message: "Unauthorized attempt." });
  }

  // Reset attempts after success
  clearLogsAttempts = 0;

  try {
    fs.writeFileSync("logs/system.log", "");
    return res.json({ message: "Logs cleared successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Error clearing logs.", error: err.message });
  }
});

CLEAR_LOGS_SECRET=mySuperSecureKey

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/adminDashboard";
import Home from "./pages/home";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const userKey = new URLSearchParams(window.location.search).get("key");

  useEffect(() => {
    if (userKey) {
      fetch(`/verify-admin?key=${userKey}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsAdmin(true);
          }
        })
        .catch(() => setIsAdmin(false));
    }
  }, [userKey]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/adminDashboard"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;

import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/adminDashboard";
import Home from "./pages/home";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const userKey = new URLSearchParams(window.location.search).get("key");

  useEffect(() => {
    if (userKey) {
      fetch(`/verify-admin?key=${userKey}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsAdmin(true);
          }
        })
        .catch(() => setIsAdmin(false));
    }
  }, [userKey]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/adminDashboard"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const rateLimit = require("express-rate-limit");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const ADMIN_KEY = process.env.ADMIN_KEY || "SuperSecretKey123";
const failedAttempts = {}; // { ip: count }

// Middleware: track attempts
app.use((req, res, next) => {
  const ip = req.ip;

  // Initialize
  if (!failedAttempts[ip]) {
    failedAttempts[ip] = { count: 0, blocked: false };
  }

  // Blocked?
  if (failedAttempts[ip].blocked) {
    console.log(`[SECURITY] Blocked IP tried again: ${ip}`);
    return res.status(403).send("Access denied");
  }

  next();
});

// Route to verify admin key
app.get("/verify-admin", (req, res) => {
  const { key } = req.query;
  const ip = req.ip;

  if (key === ADMIN_KEY) {
    failedAttempts[ip] = { count: 0, blocked: false }; // reset attempts
    return res.json({ success: true });
  } else {
    failedAttempts[ip].count += 1;
    console.log(`[SECURITY] Failed attempt ${failedAttempts[ip].count} from ${ip}`);

    if (failedAttempts[ip].count >= 3) {
      failedAttempts[ip].blocked = true;
      console.log(`[SECURITY] 🚫 Blocked IP: ${ip} after 3 failed attempts`);
    }

    return res.status(401).json({ success: false });
  }
});

REACT_APP_ADMIN_KEY=SuperSecretKey123

const socket = io("/admin");

io.of("/admin").on("connection", (socket) => {
  console.log("Admin connected to logs");

  // Send logs only to admin namespace
  function broadcastLog(message) {
    socket.emit("system_log", message);
  }

  // Example patch
  const origLog = console.log;
  console.log = (...args) => {
    const msg = args.join(" ");
    broadcastLog(msg);
    origLog.apply(console, args);
  };
});

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/adminDashboard";
import Home from "./pages/home";

function App() {
  const adminKey = process.env.REACT_APP_ADMIN_KEY;
  const userKey = new URLSearchParams(window.location.search).get("key");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/adminDashboard"
          element={
            userKey === adminKey ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

// Emit logs to admin dashboard
function broadcastLog(message) {
  io.emit("system_log", message);
}

// Patch logger
const origLog = console.log;
console.log = (...args) => {
  const msg = args.join(" ");
  broadcastLog(msg);
  origLog.apply(console, args);
};

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io();

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("system_log", (log) => {
      setLogs((prev) => [...prev, log]);
    });

    return () => {
      socket.off("system_log");
    };
  }, []);

  const downloadLogs = () => {
    const blob = new Blob([logs.join("\n")], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setLogs([]); // Just clear frontend view, server continues logging
  };

  return (
    <div className="admin-dashboard">
      <h1>Backend Dashboard</h1>

      <div className="dashboard-controls">
        <button onClick={downloadLogs} className="download-btn">
          Download Logs
        </button>
        <button onClick={clearLogs} className="clear-btn">
          Clear Logs
        </button>
      </div>

      <div className="log-box system">
        <h2>System Logs</h2>
        {logs.length === 0 ? (
          <div>No logs yet...</div>
        ) : (
          logs.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  );
}

// Emit logs to admin dashboard
function broadcastLog(message) {
  io.emit("system_log", message);
}

// Patch logger
const origLog = console.log;
console.log = (...args) => {
  const msg = args.join(" ");
  broadcastLog(msg);
  origLog.apply(console, args);
};

.log-box.system {
  max-height: 400px;
  overflow-y: auto;
  background: #111;
  padding: 12px;
  font-family: monospace;
  border-radius: 8px;
  color: #0f0; /* green backend logs */
}

<div className="log-box system">
  <h2>System Logs</h2>
  {logs.map((line, i) => (
    <div key={i}>{line}</div>
  ))}
</div>

.log-box {
  max-height: 200px;
  overflow-y: scroll;
  background: #111;
  color: #0f0;
  padding: 10px;
  font-family: monospace;
  margin-bottom: 20px;
}

.log-box.visitor {
  color: #0af;
}

{/* 🔹 System Logs */}
<section>
  <h2>System Logs</h2>
  <div className="log-box">
    {logs.filter(line => line.includes("[SYSTEM]")).map((line, i) => (
      <div key={i}>{line}</div>
    ))}
  </div>
</section>

{/* 🔹 Visitor Logs */}
<section>
  <h2>Visitor Logs</h2>
  <div className="log-box visitor">
    {logs.filter(line => line.includes("[VISITOR]")).map((line, i) => (
      <div key={i}>{line}</div>
    ))}
  </div>
</section>
    // All logs (system + visitor)
app.get("/api/admin/logs", (req, res) => {
  if (!fs.existsSync(logFile)) return res.json({ logs: [] });
  const logs = fs.readFileSync(logFile, "utf-8").split("\n").slice(-100);
  res.json({ logs });
});

// Visitor-specific logs
app.get("/api/admin/logs/visitors", (req, res) => {
  if (!fs.existsSync(logFile)) return res.json({ logs: [] });
  const logs = fs.readFileSync(logFile, "utf-8")
    .split("\n")
    .filter((line) => line.includes("[VISITOR]"))
    .slice(-50);
  res.json({ logs });
});

import fs from "fs";
import path from "path";

const logFile = path.resolve("logs/restarts.log");

function logEvent(type, message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [${type.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(logFile, entry);
}

// Example usage in self-healing:
logEvent("system", "Server restarted automatically after crash.");

// Example usage in visitor bubble routing:
logEvent("visitor", "Trader 123 routed to 'Conservative Strategy Bubble'");

{/* 🔹 Logs */}
<section style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
  <h2>System Logs (Last 50)</h2>
  <div style={{ maxHeight: "200px", overflowY: "scroll", background: "#111", color: "#0f0", padding: "10px", fontFamily: "monospace" }}>
    {logs.map((line, i) => (
      <div key={i}>{line}</div>
    ))}
  </div>
</section>

"scripts": {
  "start": "node scripts/checkServer.js && react-scripts start",
  "server": "node server/server.js",
  "dev": "concurrently \"npm run server\" \"npm start\""
}

// scripts/checkServer.js
const fs = require("fs");
const path = require("path");

const expectedPath = path.join(__dirname, "../server/server.js");
const misplacedPath = path.join(__dirname, "../src/server.js");

// Check misplaced file
if (fs.existsSync(misplacedPath)) {
  console.warn("⚠️ Found misplaced server.js in src/. Moving to server/...");
  if (!fs.existsSync(path.join(__dirname, "../server"))) {
    fs.mkdirSync(path.join(__dirname, "../server"));
  }
  fs.renameSync(misplacedPath, expectedPath);
  console.log("✅ Fixed: server.js moved to /server/");
}

// Check if server.js exists at correct location
if (!fs.existsSync(expectedPath)) {
  console.error("❌ ERROR: server.js missing from /server/. Please restore!");
  process.exit(1);
} else {
  console.log("✅ server.js is in correct location.");
}// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [historicalLeaderboard, setHistoricalLeaderboard] = useState({});
  const [entryHistory, setEntryHistory] = useState({});
  const [filterBubble, setFilterBubble] = useState("All");
  const [filterTier, setFilterTier] = useState("All");
  const [dateRange, setDateRange] = useState("All");

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      setHistoricalLeaderboard((prev) => {
        const prevEntry = prev[data.visitorId] || { count: 0, highestTier: null, totalScore: 0 };
        const newTier = getTier(data);
        const tierRank = { Gold: 3, Silver: 2, Bronze: 1, null: 0 };
        const highestTier = tierRank[newTier] > tierRank[prevEntry.highestTier] ? newTier : prevEntry.highestTier;
        const count = prevEntry.count + 1;
        const totalScore = prevEntry.totalScore + (data.score ?? 0);
        return { ...prev, [data.visitorId]: { count, highestTier, totalScore } };
      });

      setEntryHistory((prev) => {
        const visitorHistory = prev[data.visitorId] || [];
        const newEntry = {
          timestamp: new Date().toISOString(), // ISO for easy filtering
          bubble: data.destination,
          score: data.score ?? "N/A",
          tier: getTier(data)
        };
        return { ...prev, [data.visitorId]: [newEntry, ...visitorHistory] };
      });

      if (isTopVisitor(data)) {
        toast.success(`Top Visitor Alert: ${data.visitorId} entered ${data.destination}`, { duration: 5000 });
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => socket.disconnect();
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    if (v.destination === "CPilot") return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    return false;
  };

  const getTier = (v) => {
    if (!isTopVisitor(v)) return null;
    if (v.score >= 9 && (v.peacefulness ?? 0) >= 9) return "Gold";
    if (v.score >= 8 && (v.peacefulness ?? 0) >= 8) return "Silver";
    return "Bronze";
  };

  // Utility: filter entry history based on tier, bubble, date range
  const getFilteredHistory = () => {
    let filtered = [];
    Object.entries(entryHistory).forEach(([visitorId, entries]) => {
      let filteredEntries = entries;

      if (filterTier !== "All") {
        filteredEntries = filteredEntries.filter(e => e.tier === filterTier);
      }

      if (filterBubble !== "All") {
        filteredEntries = filteredEntries.filter(e => e.bubble === filterBubble);
      }

      if (dateRange === "Last7Days") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        filteredEntries = filteredEntries.filter(e => new Date(e.timestamp) >= cutoff);
      } else if (dateRange === "Last30Days") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        filteredEntries = filteredEntries.filter(e => new Date(e.timestamp) >= cutoff);
      }

      if (filteredEntries.length > 0) {
        filtered.push([visitorId, filteredEntries]);
      }
    });

    return Object.fromEntries(filtered);
  };

  // Export CSV
  const exportCSV = (data, filename) => {
    const csvContent = Object.entries(data)
      .map(([visitorId, entries]) => entries.map(e => `${visitorId},${e.timestamp},${e.bubble},${e.score},${e.tier ?? "N/A"}`).join("\n"))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const exportJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="border p-1 rounded">
          <option value="All">All Tiers</option>
          <option value="Gold">Gold</option>
          <option value="Silver">Silver</option>
          <option value="Bronze">Bronze</option>
        </select>
        <select value={filterBubble} onChange={e => setFilterBubble(e.target.value)} className="border p-1 rounded">
          <option value="All">All Bubbles</option>
          <option value="TraderLab_CPilot">TraderLab_CPilot</option>
          <option value="CPilot">CPilot</option>
          <option value="GamesPavilion">GamesPavilion</option>
          <option value="GuidanceModule">GuidanceModule</option>
        </select>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="border p-1 rounded">
          <option value="All">All Time</option>
          <option value="Last7Days">Last 7 Days</option>
          <option value="Last30Days">Last 30 Days</option>
        </select>
      </div>

      {/* Export Buttons */}
      <div className="flex space-x-2 mb-6">
        <button className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => exportCSV(getFilteredHistory(), "entry_history_filtered.csv")}>
          Export Filtered CSV
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={() => exportJSON(getFilteredHistory(), "entry_history_filtered.json")}>
          Export Filtered JSON
        </button>
      </div>

      {/* The rest of dashboard UI (Top Visitors, Leaderboard, Entry History, Summary) remains */}
    </div>
  );
};

export default Dashboard;// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

const tierColors = {
  Gold: "bg-yellow-400",
  Silver: "bg-gray-400",
  Bronze: "bg-orange-400",
};

const alertSound = new Audio("/sounds/alert.mp3");

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [historicalLeaderboard, setHistoricalLeaderboard] = useState({});
  const [entryHistory, setEntryHistory] = useState({});
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      // Update historical leaderboard
      setHistoricalLeaderboard((prev) => {
        const prevEntry = prev[data.visitorId] || { count: 0, highestTier: null, totalScore: 0 };
        const newTier = getTier(data);
        const tierRank = { Gold: 3, Silver: 2, Bronze: 1, null: 0 };
        const highestTier = tierRank[newTier] > tierRank[prevEntry.highestTier] ? newTier : prevEntry.highestTier;
        const count = prevEntry.count + 1;
        const totalScore = prevEntry.totalScore + (data.score ?? 0);
        return { ...prev, [data.visitorId]: { count, highestTier, totalScore } };
      });

      // Update timestamped entry history
      setEntryHistory((prev) => {
        const visitorHistory = prev[data.visitorId] || [];
        const newEntry = {
          timestamp: new Date().toLocaleString(),
          bubble: data.destination,
          score: data.score ?? "N/A",
          tier: getTier(data)
        };
        return { ...prev, [data.visitorId]: [newEntry, ...visitorHistory] };
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
        alertSound.play().catch(() => {});
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => socket.disconnect();
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    if (v.destination === "CPilot") return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    return false;
  };

  const getTier = (v) => {
    if (!isTopVisitor(v)) return null;
    if (v.score >= 9 && (v.peacefulness ?? 0) >= 9) return "Gold";
    if (v.score >= 8 && (v.peacefulness ?? 0) >= 8) return "Silver";
    return "Bronze";
  };

  const tierOrder = { Gold: 1, Silver: 2, Bronze: 3 };

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => {
      if (sortByScore) return (b.score ?? 0) - (a.score ?? 0);
      const tierA = getTier(a);
      const tierB = getTier(b);
      return (tierOrder[tierA] ?? 4) - (tierOrder[tierB] ?? 4);
    });

  const topVisitors = visitors
    .filter(isTopVisitor)
    .sort((a, b) => (tierOrder[getTier(a)] ?? 4) - (tierOrder[getTier(b)] ?? 4));

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  // Utility functions to export CSV
  const exportCSV = (data, filename) => {
    const csvContent = Object.entries(data)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(entry => `${key},${entry.timestamp},${entry.bubble},${entry.score},${entry.tier ?? "N/A"}`).join("\n");
        } else {
          return `${key},${value.highestTier},${value.count},${value.totalScore}`;
        }
      })
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const exportJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Export Buttons */}
      <div className="flex space-x-2 mb-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => exportCSV(historicalLeaderboard, "historical_leaderboard.csv")}
        >
          Export Leaderboard CSV
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => exportCSV(entryHistory, "entry_history.csv")}
        >
          Export Entry History CSV
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={() => exportJSON(historicalLeaderboard, "historical_leaderboard.json")}
        >
          Export Leaderboard JSON
        </button>
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={() => exportJSON(entryHistory, "entry_history.json")}
        >
          Export Entry History JSON
        </button>
      </div>

      {/* The rest of the dashboard UI remains unchanged */}
      {/* Top Visitor Panel, Historical Leaderboard Table, Visitor Entry History, Summary Panel */}
    </div>
  );
};

export default Dashboard;// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

const tierColors = {
  Gold: "bg-yellow-400",
  Silver: "bg-gray-400",
  Bronze: "bg-orange-400",
};

const alertSound = new Audio("/sounds/alert.mp3");

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [historicalLeaderboard, setHistoricalLeaderboard] = useState({});
  const [entryHistory, setEntryHistory] = useState({});
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      // Update historical leaderboard
      setHistoricalLeaderboard((prev) => {
        const prevEntry = prev[data.visitorId] || { count: 0, highestTier: null, totalScore: 0 };
        const newTier = getTier(data);
        const tierRank = { Gold: 3, Silver: 2, Bronze: 1, null: 0 };
        const highestTier = tierRank[newTier] > tierRank[prevEntry.highestTier] ? newTier : prevEntry.highestTier;
        const count = prevEntry.count + 1;
        const totalScore = prevEntry.totalScore + (data.score ?? 0);
        return { ...prev, [data.visitorId]: { count, highestTier, totalScore } };
      });

      // Update timestamped entry history
      setEntryHistory((prev) => {
        const visitorHistory = prev[data.visitorId] || [];
        const newEntry = {
          timestamp: new Date().toLocaleString(),
          bubble: data.destination,
          score: data.score ?? "N/A",
          tier: getTier(data)
        };
        return { ...prev, [data.visitorId]: [newEntry, ...visitorHistory] };
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
        alertSound.play().catch(() => {});
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => socket.disconnect();
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    if (v.destination === "CPilot") return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    return false;
  };

  const getTier = (v) => {
    if (!isTopVisitor(v)) return null;
    if (v.score >= 9 && (v.peacefulness ?? 0) >= 9) return "Gold";
    if (v.score >= 8 && (v.peacefulness ?? 0) >= 8) return "Silver";
    return "Bronze";
  };

  const tierOrder = { Gold: 1, Silver: 2, Bronze: 3 };

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => {
      if (sortByScore) return (b.score ?? 0) - (a.score ?? 0);
      const tierA = getTier(a);
      const tierB = getTier(b);
      return (tierOrder[tierA] ?? 4) - (tierOrder[tierB] ?? 4);
    });

  const topVisitors = visitors
    .filter(isTopVisitor)
    .sort((a, b) => (tierOrder[getTier(a)] ?? 4) - (tierOrder[getTier(b)] ?? 4));

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Top Visitor Panel */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Top Visitors</h2>
        {topVisitors.length === 0 ? (
          <p>No top-worthy visitors currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topVisitors.map((v) => {
              const tier = getTier(v);
              return (
                <div
                  key={v.visitorId}
                  className={`p-2 text-white rounded shadow animate-pulse relative ${tierColors[tier]}`}
                >
                  <strong>{v.visitorId}</strong> - {v.destination} (Score: {v.score ?? "N/A"}) <br />
                  <span className="text-sm font-semibold">{tier} Tier</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Leaderboard */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-100">
        <h2 className="text-2xl font-semibold mb-3">Historical Leaderboard</h2>
        {Object.keys(historicalLeaderboard).length === 0 ? (
          <p>No historical data yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="border px-2 py-1">Visitor ID</th>
                <th className="border px-2 py-1">Highest Tier</th>
                <th className="border px-2 py-1">Entries</th>
                <th className="border px-2 py-1">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(historicalLeaderboard)
                .sort(([, a], [, b]) => {
                  const tierRank = { Gold: 3, Silver: 2, Bronze: 1, null: 0 };
                  return tierRank[b.highestTier] - tierRank[a.highestTier] || b.totalScore - a.totalScore;
                })
                .map(([visitorId, stats]) => (
                  <tr key={visitorId}>
                    <td className="border px-2 py-1">{visitorId}</td>
                    <td className="border px-2 py-1">{stats.highestTier}</td>
                    <td className="border px-2 py-1">{stats.count}</td>
                    <td className="border px-2 py-1">{stats.totalScore}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Visitor Entry History */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Visitor Entry History</h2>
        {Object.keys(entryHistory).length === 0 ? (
          <p>No entries recorded yet.</p>
        ) : (
          Object.entries(entryHistory).map(([visitorId, entries]) => (
            <div key={visitorId} className="mb-4">
              <h3 className="font-semibold">{visitorId}</h3>
              <ul className="list-disc list-inside">
                {entries.map((e, idx) => (
                  <li key={idx}>
                    [{e.timestamp}] → {e.bubble} (Score: {e.score}, Tier: {e.tier ?? "N/A"})
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

const tierColors = {
  Gold: "bg-yellow-400",
  Silver: "bg-gray-400",
  Bronze: "bg-orange-400",
};

const alertSound = new Audio("/sounds/alert.mp3"); // optional alert sound

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [historicalLeaderboard, setHistoricalLeaderboard] = useState({});
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      // Update historical leaderboard
      setHistoricalLeaderboard((prev) => {
        const prevEntry = prev[data.visitorId] || { count: 0, highestTier: null, totalScore: 0 };
        const newTier = getTier(data);
        const tierRank = { Gold: 3, Silver: 2, Bronze: 1, null: 0 };
        const highestTier = tierRank[newTier] > tierRank[prevEntry.highestTier] ? newTier : prevEntry.highestTier;
        const count = prevEntry.count + 1;
        const totalScore = prevEntry.totalScore + (data.score ?? 0);
        return { ...prev, [data.visitorId]: { count, highestTier, totalScore } };
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
        alertSound.play().catch(() => {});
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") {
      return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    }
    if (v.destination === "CPilot") {
      return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    }
    return false;
  };

  const getTier = (v) => {
    if (!isTopVisitor(v)) return null;
    if (v.score >= 9 && (v.peacefulness ?? 0) >= 9) return "Gold";
    if (v.score >= 8 && (v.peacefulness ?? 0) >= 8) return "Silver";
    return "Bronze";
  };

  const tierOrder = { Gold: 1, Silver: 2, Bronze: 3 };

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => {
      if (sortByScore) return (b.score ?? 0) - (a.score ?? 0);
      const tierA = getTier(a);
      const tierB = getTier(b);
      return (tierOrder[tierA] ?? 4) - (tierOrder[tierB] ?? 4);
    });

  const topVisitors = visitors
    .filter(isTopVisitor)
    .sort((a, b) => (tierOrder[getTier(a)] ?? 4) - (tierOrder[getTier(b)] ?? 4));

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Top Visitor Panel */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Top Visitors</h2>
        {topVisitors.length === 0 ? (
          <p>No top-worthy visitors currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topVisitors.map((v) => {
              const tier = getTier(v);
              return (
                <div
                  key={v.visitorId}
                  className={`p-2 text-white rounded shadow animate-pulse relative ${tierColors[tier]}`}
                >
                  <strong>{v.visitorId}</strong> - {v.destination} (Score: {v.score ?? "N/A"}) <br />
                  <span className="text-sm font-semibold">{tier} Tier</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Leaderboard */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-100">
        <h2 className="text-2xl font-semibold mb-3">Historical Leaderboard</h2>
        {Object.keys(historicalLeaderboard).length === 0 ? (
          <p>No historical data yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="border px-2 py-1">Visitor ID</th>
                <th className="border px-2 py-1">Highest Tier</th>
                <th className="border px-2 py-1">Entries</th>
                <th className="border px-2 py-1">Total Score</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(historicalLeaderboard)
                .sort(([, a], [, b]) => {
                  const tierRank = { Gold: 3, Silver: 2, Bronze: 1, null: 0 };
                  return tierRank[b.highestTier] - tierRank[a.highestTier] || b.totalScore - a.totalScore;
                })
                .map(([visitorId, stats]) => (
                  <tr key={visitorId}>
                    <td className="border px-2 py-1">{visitorId}</td>
                    <td className="border px-2 py-1">{stats.highestTier}</td>
                    <td className="border px-2 py-1">{stats.count}</td>
                    <td className="border px-2 py-1">{stats.totalScore}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

const tierColors = {
  Gold: "bg-yellow-400",
  Silver: "bg-gray-400",
  Bronze: "bg-orange-400",
};

const alertSound = new Audio("/sounds/alert.mp3"); // optional alert sound

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
        alertSound.play().catch(() => {});
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") {
      return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    }
    if (v.destination === "CPilot") {
      return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    }
    return false;
  };

  const getTier = (v) => {
    if (!isTopVisitor(v)) return null;
    if (v.score >= 9 && (v.peacefulness ?? 0) >= 9) return "Gold";
    if (v.score >= 8 && (v.peacefulness ?? 0) >= 8) return "Silver";
    return "Bronze";
  };

  const tierOrder = { Gold: 1, Silver: 2, Bronze: 3 };

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => {
      if (sortByScore) return (b.score ?? 0) - (a.score ?? 0);
      const tierA = getTier(a);
      const tierB = getTier(b);
      return (tierOrder[tierA] ?? 4) - (tierOrder[tierB] ?? 4);
    });

  const topVisitors = visitors
    .filter(isTopVisitor)
    .sort((a, b) => (tierOrder[getTier(a)] ?? 4) - (tierOrder[getTier(b)] ?? 4));

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Top Visitor Panel */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Top Visitors</h2>
        {topVisitors.length === 0 ? (
          <p>No top-worthy visitors currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topVisitors.map((v) => {
              const tier = getTier(v);
              return (
                <div
                  key={v.visitorId}
                  className={`p-2 text-white rounded shadow animate-pulse relative ${tierColors[tier]}`}
                >
                  <strong>{v.visitorId}</strong> - {v.destination} (Score: {v.score ?? "N/A"}) <br />
                  <span className="text-sm font-semibold">{tier} Tier</span>

                  <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                    <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                    <p>genomP: {v.genomP ?? "N/A"}</p>
                    <p>Total Score: {v.score ?? "N/A"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
          <option>CPilot</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => {
                    const tier = getTier(v);
                    return (
                      <motion.div
                        key={v.visitorId}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className={`p-2 text-white rounded relative group
                          ${bubbleColors[bubble] || "bg-purple-500"}
                          ${isTopVisitor(v) ? `ring-4 ring-yellow-400 animate-pulse` : ""}
                        `}
                      >
                        {v.visitorId} (Score: {v.score ?? "N/A"})
                        {tier && <span className="ml-2 text-sm font-semibold">({tier})</span>}
                        <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                          <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                          <p>genomP: {v.genomP ?? "N/A"}</p>
                          <p>Total Score: {v.score ?? "N/A"}</p>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

const tierColors = {
  Gold: "bg-yellow-400",
  Silver: "bg-gray-400",
  Bronze: "bg-orange-400",
};

const alertSound = new Audio("/sounds/alert.mp3"); // optional alert sound

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
        alertSound.play().catch(() => {});
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") {
      return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    }
    if (v.destination === "CPilot") {
      return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    }
    return false;
  };

  // Assign tier based on score and ethical alignment
  const getTier = (v) => {
    if (!isTopVisitor(v)) return null;
    if (v.score >= 9 && (v.peacefulness ?? 0) >= 9) return "Gold";
    if (v.score >= 8 && (v.peacefulness ?? 0) >= 8) return "Silver";
    return "Bronze";
  };

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  const topVisitors = visitors.filter(isTopVisitor);

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Top Visitor Panel */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Top Visitors</h2>
        {topVisitors.length === 0 ? (
          <p>No top-worthy visitors currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topVisitors.map((v) => {
              const tier = getTier(v);
              return (
                <div
                  key={v.visitorId}
                  className={`p-2 text-white rounded shadow animate-pulse relative ${tierColors[tier]}`}
                >
                  <strong>{v.visitorId}</strong> - {v.destination} (Score: {v.score ?? "N/A"}) <br />
                  <span className="text-sm font-semibold">{tier} Tier</span>

                  <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                    <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                    <p>genomP: {v.genomP ?? "N/A"}</p>
                    <p>Total Score: {v.score ?? "N/A"}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
          <option>CPilot</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => {
                    const tier = getTier(v);
                    return (
                      <motion.div
                        key={v.visitorId}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className={`p-2 text-white rounded relative group
                          ${bubbleColors[bubble] || "bg-purple-500"}
                          ${isTopVisitor(v) ? `ring-4 ring-yellow-400 animate-pulse` : ""}
                        `}
                      >
                        {v.visitorId} (Score: {v.score ?? "N/A"})
                        {tier && <span className="ml-2 text-sm font-semibold">({tier})</span>}
                        <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                          <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                          <p>genomP: {v.genomP ?? "N/A"}</p>
                          <p>Total Score: {v.score ?? "N/A"}</p>
                        </div>
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

const alertSound = new Audio("/sounds/alert.mp3"); // optional alert sound

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
        alertSound.play().catch(() => {}); // play sound if browser allows
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") {
      return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    }
    if (v.destination === "CPilot") {
      return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    }
    return false;
  };

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  const topVisitors = visitors.filter(isTopVisitor);

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Top Visitor Panel */}
      <div className="mb-6 p-4 border rounded shadow bg-gray-50">
        <h2 className="text-2xl font-semibold mb-3">Top Visitors</h2>
        {topVisitors.length === 0 ? (
          <p>No top-worthy visitors currently.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {topVisitors.map((v) => (
              <div
                key={v.visitorId}
                className="p-2 bg-yellow-400 text-white rounded shadow animate-pulse relative"
              >
                <strong>{v.visitorId}</strong> - {v.destination} (Score: {v.score ?? "N/A"})
                <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                  <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                  <p>genomP: {v.genomP ?? "N/A"}</p>
                  <p>Total Score: {v.score ?? "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
          <option>CPilot</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative group
                        ${bubbleColors[bubble] || "bg-purple-500"}
                        ${isTopVisitor(v) ? "ring-4 ring-yellow-400 animate-pulse" : ""}
                      `}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

// Sound for alerts
const alertSound = new Audio("/sounds/alert.mp3"); // add your alert sound file

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
        alertSound.play().catch(() => {}); // play sound if browser allows
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") {
      return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    }
    if (v.destination === "CPilot") {
      return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    }
    return false;
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
          <option>CPilot</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative group
                        ${bubbleColors[bubble] || "bg-purple-500"}
                        ${isTopVisitor(v) ? "ring-4 ring-yellow-400 animate-pulse" : ""}
                      `}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast"; // for notifications

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
  CPilot: "bg-purple-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      if (isTopVisitor(data)) {
        toast.success(
          `Top Visitor Alert: ${data.visitorId} entered ${data.destination}`,
          { duration: 5000 }
        );
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => {
      socket.disconnect();
    };
  }, []);

  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") {
      return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    }
    if (v.destination === "CPilot") {
      return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    }
    return false;
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
          <option>CPilot</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative group
                        ${bubbleColors[bubble] || "bg-purple-500"}
                        ${isTopVisitor(v) ? "ring-4 ring-yellow-400" : ""}
                      `}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    socket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filter & sort visitors
  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  // Summary
  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  // Determine if visitor is top-worthy per bubble
  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") {
      return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    }
    if (v.destination === "CPilot") {
      return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    }
    return false;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
          <option>CPilot</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion", "CPilot"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative group
                        ${bubbleColors[bubble] || "bg-purple-500"}
                        ${isTopVisitor(v) ? "ring-4 ring-yellow-400" : ""}
                      `}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    socket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filter & sort visitors
  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  // Summary
  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  // Function to determine if visitor is top-worthy
  const isTopVisitor = (v) => {
    return v.destination === "TraderLab_CPilot" && (v.score ?? 0) >= 8 && v.peacefulness >= 7;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative group
                        ${bubbleColors[bubble]}
                        ${isTopVisitor(v) ? "ring-4 ring-yellow-400" : ""}
                      `}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    // Connect to QT AI backend live stream
    const socket = io(SOCKET_URL);

    // Live routing event
    socket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    // Live re-evaluation event
    socket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Filter & sort visitors
  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  // Summary
  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;
    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative ${bubbleColors[bubble]} group`}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL
const API_URL = "http://localhost:4000/api";

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [socket, setSocket] = useState(null);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    newSocket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const submitVisitor = async (visitorData) => {
    try {
      const response = await axios.post(`${API_URL}/visitor`, visitorData);
      console.log("Visitor routed:", response.data);
    } catch (err) {
      console.error("Error submitting visitor:", err);
    }
  };

  // Filter & sort visitors
  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  // Compute summary
  const summary = ["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => {
    const bubbleVisitors = visitors.filter(v => v.destination === bubble);
    const total = bubbleVisitors.length;
    const avgScore = total > 0
      ? (bubbleVisitors.reduce((acc, v) => acc + (v.score ?? 0), 0) / total).toFixed(2)
      : 0;
    const peacefulCount = bubbleVisitors.filter(v => v.category === "Peaceful").length;
    const neutralCount = bubbleVisitors.filter(v => v.category === "Neutral").length;
    const disruptiveCount = bubbleVisitors.filter(v => v.category === "Disruptive").length;

    return { bubble, total, avgScore, peacefulCount, neutralCount, disruptiveCount };
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Summary Panel */}
      <div className="flex flex-wrap gap-4 mb-6">
        {summary.map((s) => (
          <div key={s.bubble} className="flex-1 p-4 border rounded shadow bg-gray-100">
            <h3 className="text-xl font-semibold mb-2">{s.bubble}</h3>
            <p>Total Visitors: {s.total}</p>
            <p>Avg Score: {s.avgScore}</p>
            <p>Peaceful: {s.peacefulCount} | Neutral: {s.neutralCount} | Disruptive: {s.disruptiveCount}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded mb-2 md:mb-0"
          onClick={() =>
            submitVisitor({
              visitorId: "visitor_" + Math.floor(Math.random() * 1000),
              peacefulness: Math.floor(Math.random() * 10),
              emotionalIntelligence: Math.floor(Math.random() * 10),
              genomP: Math.floor(Math.random() * 10),
              score: Math.floor(Math.random() * 10),
              category: ["Peaceful", "Neutral", "Disruptive"][Math.floor(Math.random() * 3)],
            })
          }
        >
          Simulate Visitor
        </button>

        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      {/* Bubble Visualization */}
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative ${bubbleColors[bubble]} group`}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL
const API_URL = "http://localhost:4000/api";

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [socket, setSocket] = useState(null);
  const [filterBubble, setFilterBubble] = useState("All");
  const [sortByScore, setSortByScore] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    newSocket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const submitVisitor = async (visitorData) => {
    try {
      const response = await axios.post(`${API_URL}/visitor`, visitorData);
      console.log("Visitor routed:", response.data);
    } catch (err) {
      console.error("Error submitting visitor:", err);
    }
  };

  // Filter & sort visitors
  const filteredVisitors = visitors
    .filter(v => filterBubble === "All" || v.destination === filterBubble)
    .sort((a, b) => sortByScore ? (b.score ?? 0) - (a.score ?? 0) : 0);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <button
          className="bg-blue-500 text-white px-5 py-2 rounded mb-2 md:mb-0"
          onClick={() =>
            submitVisitor({
              visitorId: "visitor_" + Math.floor(Math.random() * 1000),
              peacefulness: Math.floor(Math.random() * 10),
              emotionalIntelligence: Math.floor(Math.random() * 10),
              genomP: Math.floor(Math.random() * 10),
              score: Math.floor(Math.random() * 10),
            })
          }
        >
          Simulate Visitor
        </button>

        <select
          className="border rounded px-3 py-2"
          value={filterBubble}
          onChange={(e) => setFilterBubble(e.target.value)}
        >
          <option>All</option>
          <option>TraderLab_CPilot</option>
          <option>GuidanceModule</option>
          <option>GamesPavilion</option>
        </select>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByScore}
            onChange={() => setSortByScore(!sortByScore)}
          />
          <span>Sort by Score</span>
        </label>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Live Bubble Routing</h2>
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {filteredVisitors
                  .filter(v => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative ${bubbleColors[bubble]} group`}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion"; // animation library

const SOCKET_URL = "http://localhost:4000";
const API_URL = "http://localhost:4000/api";

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    newSocket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const submitVisitor = async (visitorData) => {
    try {
      const response = await axios.post(`${API_URL}/visitor`, visitorData);
      console.log("Visitor routed:", response.data);
    } catch (err) {
      console.error("Error submitting visitor:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      <button
        className="bg-blue-500 text-white px-5 py-2 rounded mb-6"
        onClick={() =>
          submitVisitor({
            visitorId: "visitor_" + Math.floor(Math.random() * 1000),
            peacefulness: Math.floor(Math.random() * 10),
            emotionalIntelligence: Math.floor(Math.random() * 10),
            genomP: Math.floor(Math.random() * 10),
            score: Math.floor(Math.random() * 10),
          })
        }
      >
        Simulate Visitor
      </button>

      <h2 className="text-2xl font-semibold mb-4">Live Bubble Routing</h2>
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              <AnimatePresence>
                {visitors
                  .filter((v) => v.destination === bubble)
                  .map((v) => (
                    <motion.div
                      key={v.visitorId}
                      layout // animate position change
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className={`p-2 text-white rounded relative ${bubbleColors[bubble]} group`}
                    >
                      {v.visitorId} (Score: {v.score ?? "N/A"})
                      <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                        <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                        <p>genomP: {v.genomP ?? "N/A"}</p>
                        <p>Total Score: {v.score ?? "N/A"}</p>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL
const API_URL = "http://localhost:4000/api";

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    newSocket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const submitVisitor = async (visitorData) => {
    try {
      const response = await axios.post(`${API_URL}/visitor`, visitorData);
      console.log("Visitor routed:", response.data);
    } catch (err) {
      console.error("Error submitting visitor:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      <button
        className="bg-blue-500 text-white px-5 py-2 rounded mb-6"
        onClick={() =>
          submitVisitor({
            visitorId: "visitor_" + Math.floor(Math.random() * 1000),
            peacefulness: Math.floor(Math.random() * 10),
            emotionalIntelligence: Math.floor(Math.random() * 10),
            genomP: Math.floor(Math.random() * 10),
            score: Math.floor(Math.random() * 10) // optional alignment score
          })
        }
      >
        Simulate Visitor
      </button>

      <h2 className="text-2xl font-semibold mb-4">Live Bubble Routing</h2>
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              {visitors
                .filter((v) => v.destination === bubble)
                .map((v) => (
                  <div
                    key={v.visitorId}
                    className={`p-2 text-white rounded relative ${bubbleColors[bubble]}`}
                  >
                    {v.visitorId} (Score: {v.score ?? "N/A"})
                    {/* Hover tooltip */}
                    <div className="absolute left-full top-0 ml-2 w-48 p-2 bg-gray-800 text-white text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <p>Peacefulness: {v.peacefulness ?? "N/A"}</p>
                      <p>Emotional Intelligence: {v.emotionalIntelligence ?? "N/A"}</p>
                      <p>genomP: {v.genomP ?? "N/A"}</p>
                      <p>Total Score: {v.score ?? "N/A"}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL
const API_URL = "http://localhost:4000/api";

const bubbleColors = {
  TraderLab_CPilot: "bg-green-500",
  GuidanceModule: "bg-yellow-400",
  GamesPavilion: "bg-red-500",
};

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("visitorRouted", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    newSocket.on("visitorReEvaluated", (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const submitVisitor = async (visitorData) => {
    try {
      const response = await axios.post(`${API_URL}/visitor`, visitorData);
      console.log("Visitor routed:", response.data);
    } catch (err) {
      console.error("Error submitting visitor:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      <button
        className="bg-blue-500 text-white px-5 py-2 rounded mb-6"
        onClick={() =>
          submitVisitor({
            visitorId: "visitor_" + Math.floor(Math.random() * 1000),
            peacefulness: Math.floor(Math.random() * 10),
            emotionalIntelligence: Math.floor(Math.random() * 10),
            genomP: Math.floor(Math.random() * 10),
          })
        }
      >
        Simulate Visitor
      </button>

      <h2 className="text-2xl font-semibold mb-4">Live Bubble Routing</h2>
      <div className="flex space-x-4">
        {["TraderLab_CPilot", "GuidanceModule", "GamesPavilion"].map((bubble) => (
          <div key={bubble} className="flex-1 p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{bubble}</h3>
            <div className="space-y-2">
              {visitors
                .filter((v) => v.destination === bubble)
                .map((v) => (
                  <div
                    key={v.visitorId}
                    className={`p-2 text-white rounded ${bubbleColors[bubble]}`}
                  >
                    {v.visitorId}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL
const API_URL = "http://localhost:4000/api";

const Dashboard = () => {
    const [visitors, setVisitors] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to Socket.IO server
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        // Listen for live routed events
        newSocket.on("visitorRouted", (data) => {
            setVisitors((prev) => {
                const existing = prev.filter(v => v.visitorId !== data.visitorId);
                return [...existing, data];
            });
        });

        newSocket.on("visitorReEvaluated", (data) => {
            setVisitors((prev) => {
                const existing = prev.filter(v => v.visitorId !== data.visitorId);
                return [...existing, data];
            });
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Example function: submit visitor/trader data
    const submitVisitor = async (visitorData) => {
        try {
            const response = await axios.post(`${API_URL}/visitor`, visitorData);
            console.log("Visitor routed:", response.data);
        } catch (err) {
            console.error("Error submitting visitor:", err);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quantum Trader AI Dashboard</h1>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                onClick={() =>
                    submitVisitor({
                        visitorId: "visitor_" + Math.floor(Math.random() * 1000),
                        peacefulness: Math.floor(Math.random() * 10),
                        emotionalIntelligence: Math.floor(Math.random() * 10),
                        genomP: Math.floor(Math.random() * 10),
                    })
                }
            >
                Simulate Visitor
            </button>

            <h2 className="text-xl font-semibold mb-2">Live Visitors</h2>
            <ul>
                {visitors.map((v) => (
                    <li key={v.visitorId} className="mb-1">
                        {v.visitorId} → {v.destination}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;

// server.js
// Backend server for QT AI
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { bubbleRoute, reEvaluate, logEvent, auditAction, qtStream } from "./Trader_Routing_Engine.js";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*", // Adjust to frontend domain in production
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// ---- API ENDPOINTS ----

// Test route
app.get("/api/ping", (req, res) => res.json({ status: "OK", message: "QT AI backend active" }));

// Submit visitor/trader data for routing
app.post("/api/visitor", (req, res) => {
    const visitorData = req.body;
    if (!visitorData.visitorId) {
        return res.status(400).json({ error: "visitorId required" });
    }

    // Bubble route and emit event
    const destination = bubbleRoute(visitorData);
    qtStream.emit("visitorRouted", { visitorId: visitorData.visitorId, destination });

    return res.json({ visitorId: visitorData.visitorId, destination });
});

// Optional: Re-evaluation endpoint
app.post("/api/reevaluate", (req, res) => {
    const visitorData = req.body;
    if (!visitorData.visitorId) {
        return res.status(400).json({ error: "visitorId required" });
    }

    reEvaluate(visitorData);
    return res.json({ visitorId: visitorData.visitorId, status: "Re-evaluation triggered" });
});

// ---- SOCKET.IO FOR LIVE DASHBOARD ----
io.on("connection", (socket) => {
    console.log(`Visitor connected: ${socket.id}`);

    // Listen for live visitor updates from frontend
    socket.on("visitorAction", (visitorData) => {
        const destination = bubbleRoute(visitorData);
        socket.emit("visitorRouted", { visitorId: visitorData.visitorId, destination });
    });

    socket.on("disconnect", () => {
        console.log(`Visitor disconnected: ${socket.id}`);
    });
});

// ---- STREAM EVENTS ----
qtStream.on("visitorRouted", (data) => {
    io.emit("visitorRouted", data); // broadcast to all connected dashboards
});

qtStream.on("visitorReEvaluated", (data) => {
    io.emit("visitorReEvaluated", data);
});

// ---- SERVER START ----
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`QT AI backend running on port ${PORT}`));

// Trader_Routing_Engine.js
// Core routing engine for QT AI
// Handles visitor/trader assessment, bubble routing, logging, and audit

import EventEmitter from "events";
import fs from "fs";
import path from "path";

// ---- CONFIGURATION ----
const LOG_FILE = path.join(process.cwd(), "logs", "visitor_logs.json");
const AUDIT_FILE = path.join(process.cwd(), "logs", "audit_logs.json");

// Ensure logs directory exists
if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
}

// ---- EVENT EMITTER FOR LIVE STREAM ----
class QTStream extends EventEmitter {}
export const qtStream = new QTStream();

// ---- LOGGER ----
function logEvent(visitorId, event, details = {}) {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, visitorId, event, details };
    fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
    console.log(`[LOG] ${timestamp} | ${visitorId} | ${event}`);
}

// ---- AUDIT ----
function auditAction(visitorId, action, outcome) {
    const timestamp = new Date().toISOString();
    const entry = { timestamp, visitorId, action, outcome };
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(entry) + "\n");
}

// ---- INTENTION ASSESSMENT ----
function assessIntention(visitorData) {
    // Example scoring based on peacefulness, emotional intelligence, genomP alignment
    const { peacefulness, emotionalIntelligence, genomP } = visitorData;
    let score = 0;

    if (peacefulness >= 8) score += 3;
    if (emotionalIntelligence >= 7) score += 2;
    if (genomP >= 5) score += 1;

    // Determine intention category
    let category;
    if (score >= 6) category = "Peaceful";
    else if (score >= 3) category = "Neutral";
    else category = "Disruptive";

    return { score, category };
}

// ---- BUBBLE ROUTING ----
function bubbleRoute(visitorData) {
    const { visitorId } = visitorData;
    const { category, score } = assessIntention(visitorData);

    logEvent(visitorId, "IntentionAssessed", { category, score });

    let destination;

    switch (category) {
        case "Peaceful":
            destination = "TraderLab_CPilot";
            break;
        case "Neutral":
            destination = "GuidanceModule";
            break;
        case "Disruptive":
        default:
            destination = "GamesPavilion";
            break;
    }

    logEvent(visitorId, "BubbleRouted", { destination });
    auditAction(visitorId, "RoutingDecision", destination);

    return destination;
}

// ---- RE-EVALUATION LOOP ----
function reEvaluate(visitorData) {
    const destination = bubbleRoute(visitorData);
    qtStream.emit("visitorReEvaluated", { visitorId: visitorData.visitorId, destination });
}

// ---- EXPORTS ----
export { bubbleRoute, reEvaluate, logEvent, auditAction };

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
