 //server.js/

// QuantumTrader AI™ Node Server (Full PWA Build)
// Architect & Builder: Olagoke Ajibulu
// Updated: November 2025
// ---------------------------------------------------
// ---------------------------------------------------
// ---------------------------------------------------

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("docs"));

// Handshake route
app.get("/handshake", (req, res) => {
  res.json({ message: "QuantumTrader-AI™ handshake acknowledged ✅" });
});

// Paystack placeholder route
app.get("/paystack-status", (req, res) => {
// Default placeholder — will update after Paystack approval
  res.json({ status: "pending" });
});

app.listen(PORT, () => {
  console.log(`✅ QuantumTrader-AI™ server running on port ${PORT}`);
});
=====
// Resolve current directory (since __dirname is not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (assets, html, css, etc.)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// --- Handshake Route --------------------------------
app.get("/handshake", (req, res) => {
  console.log("🔗 Handshake initiated between index.html and index2.html");
  res.json({
    status: "success",
    message: "QuantumTrader-AI™ handshake established successfully.",
    timestamp: new Date().toISOString()
  });
});

// --- Activation Confirmation Endpoint ---------------
app.post("/activate", (req, res) => {
  const { userId } = req.body;
  console.log(`✅ Activation received for user: ${userId}`);
  
  // Placeholder logic — extend for Paystack/WEMA ALAT verification
  res.json({
    success: true,
    userId,
    message: "Activation confirmed. TraderLab™ and Trading Floor™ unlocked."
  });
});

// --- Route to Backend (index2.html) -----------------
app.get("/backend", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});

// --- Default Route (Frontend) -----------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start Server -----------------------------------
app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader-AI server.mjs running on http://localhost:${PORT}`);
});

// --- Handshake endpoint ---
app.post('/handshake', (req, res) => {
  console.log('Handshake request received');
  res.json({ status: 'ok' });
});

// Serve static files from 'public' folder
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// ✅ Security middleware (recommended for PWA)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// ✅ Compression for faster delivery
app.use(compression());

// ✅ Parse JSON bodies for POST requests (handshake + module activation)
app.use(express.json());

// ✅ Static assets (CSS, JS, images, etc.)
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  maxAge: '1y'
}));

// ✅ Cache-control header for static resources
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|json)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});

// ✅ Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Public subpage route
app.get("/public/index2.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});

// ✅ Manifest file
app.get("/manifest.json", (req, res) => {
  res.type("application/manifest+json");
  res.sendFile(path.join(__dirname, "manifest.json"));
});

// ✅ Service worker
app.get("/service-worker.js", (req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, "service-worker.js"));
});

// ✅ Sitemap
app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.sendFile(path.join(__dirname, "sitemap.xml"));
});

// ✅ Robots.txt
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "robots.txt"));
});

// ✅ Health-check endpoint
app.get("/status", (req, res) => {
  res.status(200).json({ status: "ok", app: "QuantumTrader AI™", time: new Date() });
});

// --------------------
// Handshake endpoint
// --------------------
app.post("/handshake", (req, res) => {
  console.log("Handshake received from frontend");
  res.json({ status: "success", message: "Handshake established" });
});

// --------------------
// Module activation endpoint
// --------------------
app.post("/activate-module/:id", (req, res) => {
  const moduleId = req.params.id;
  console.log(`Module ${moduleId} activation request received`);

  // Add any module-specific logic here if needed
  res.json({ status: "success", module: moduleId, message: `Module ${moduleId} activated` });
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader AI™ server live on http://localhost:${PORT}`);
});
