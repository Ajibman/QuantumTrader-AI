 // SRC/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (index.html, assets, etc.)
app.use(express.static(path.join(__dirname, "..", "public")));

// Visit tracking
app.get("/track-visit", (req, res) => {
  const statsPath = path.join(__dirname, "..", "visitor-stats.json");
  const logPath = path.join(__dirname, "..", "logs", "app.log");

  let stats = { visits: 0, lastVisit: null };

  if (fs.existsSync(statsPath)) {
    stats = JSON.parse(fs.readFileSync(statsPath, "utf-8"));
  }

  stats.visits += 1;
  stats.lastVisit = new Date().toISOString();

  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
  fs.appendFileSync(
    logPath,
    `${new Date().toISOString()} - Visit logged. Total: ${stats.visits}\n`
  );

  res.json(stats);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
