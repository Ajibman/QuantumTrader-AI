//server.js/

// QuantumTrader AI™ Node Server (Full PWA Build)
// Architect & Builder: Olagoke Ajibulu
// Updated: November 2025

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression"; // for performance
import helmet from "helmet"; // for security headers

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Security middleware (recommended for PWA)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// ✅ Compression for faster delivery
app.use(compression());

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

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader AI™ server live on http://localhost:${PORT}`);
});
