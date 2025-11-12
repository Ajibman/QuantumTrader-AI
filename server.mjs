 // server.mjs
// QuantumTrader AI™ Node Server (Full PWA Build)
// Architect & Builder: Olagoke Ajibulu
// Updated: November 2025
// ---------------------------------------------------

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import express from "express";
const app = express();

app.use(express.static("docs")); // front end location

app.get("/handshake", (req, res) => {
  res.json({ message: "QuantumTrader-AI handshake successful." });
});

app.get("/paystack-placeholder", (req, res) => {
  res.send("<h2>Paystack placeholder active. Awaiting approval...</h2>");
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Security & performance middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(express.json());

// ✅ Serve static files (HTML, assets, etc.)
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html", "htm"],
    maxAge: "1y",
  })
);

// ✅ Cache control for static resources
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|json)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  }
  next();
});

// ---------------------------------------------------
// Handshake route — index.html ↔ index2.html sync
// ---------------------------------------------------
app.get("/handshake", (req, res) => {
  console.log("🔗 Handshake initiated between index.html and index2.html");
  res.json({
    status: "success",
    message: "QuantumTrader-AI™ handshake established successfully.",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------
// Activation Confirmation Endpoint
// ---------------------------------------------------
app.post("/activate", (req, res) => {
  const { userId } = req.body;
  console.log(`✅ Activation received for user: ${userId}`);
  res.json({
    success: true,
    userId,
    message: "Activation confirmed. TraderLab™ and Trading Floor™ unlocked.",
  });
});

// ---------------------------------------------------
// Paystack Placeholder Route
// ---------------------------------------------------
app.get("/paystack-status", (req, res) => {
  console.log("💳 Paystack placeholder route hit.");
  res.json({ status: "pending" }); // Change to "active" after approval
});

// ---------------------------------------------------
// QuantumTrader-AI™ Modules (Dynamic Route)
// ---------------------------------------------------
const modules = [
  "Module 01: Quantum Market Scanner™",
  "Module 02: Sentiment Wave Analyzer™",
  "Module 03: Liquidity Pulse Tracker™",
  "Module 04: Volatility Lens™",
  "Module 05: Trade Emotion Decoder™",
  "Module 06: PatternNet Engine™",
  "Module 07: Profit Quantumizer™",
  "Module 08: AI Broker Bridge™",
  "Module 09: GeoRisk Visualizer™",
  "Module 10: Global Peace Index Feed™",
  "Module 11: TraderLab™",
  "Module 12: Trading Floor™",
  "Module 13: CPilot™",
  "Module 14: Medusa™ (Auto-Regeneration Core)",
  "Module 15: CCLM²™ Ethics Supervisor"
];

app.get("/modules", (req, res) => {
  console.log("📊 Module list requested.");
  res.status(200).json({
    status: "ok",
    totalModules: modules.length,
    modules,
  });
});

// ---------------------------------------------------
// Core PWA Assets
// ---------------------------------------------------
app.get("/manifest.json", (req, res) => {
  res.type("application/manifest+json");
  res.sendFile(path.join(__dirname, "manifest.json"));
});

app.get("/service-worker.js", (req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, "service-worker.js"));
});

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.sendFile(path.join(__dirname, "sitemap.xml"));
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "robots.txt"));
});

// ---------------------------------------------------
// Health Check Endpoint
// ---------------------------------------------------
app.get("/status", (req, res) => {
  res.status(200).json({
    status: "ok",
    app: "QuantumTrader AI™",
    time: new Date(),
  });
});

// ---------------------------------------------------
// Fallback Routes
// ---------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/backend", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});

// ---------------------------------------------------
// 404 fallback
// ---------------------------------------------------
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ---------------------------------------------------
// Start Server
// ---------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader-AI™ server live on http://localhost:${PORT}`);
});
