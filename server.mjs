//server.js/
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const PAYMENT_SECRET = process.env.PAYMENT_SECRET || 'changeme';

// serve frontend
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

// Health status
app.get('/status', (req, res) => {
  res.json({ status: 'ok', app: 'QuantumTrader-AI', time: new Date().toISOString() });
});

// Basic handshake
app.get('/handshake', (req, res) => {
  res.json({ status: 'ok', message: 'Handshake acknowledged', ts: new Date().toISOString() });
});

// Provide modules list
app.get('/modules', (req, res) => {
  const modules = [
    "Module 01 — Market Signal Intake",
    "Module 02 — Real-Time Feed Interpreter",
    "Module 03 — Quantum Risk Engine",
    "Module 04 — Volatility Analyzer",
    "Module 05 — Peace Index Modulator",
    "Module 06 — GeoSentiment Mapper",
    "Module 07 — CPilot Cognitive Lift",
    "Module 08 — TraderLab Simulation Core",
    "Module 09 — Pattern Projection Engine",
    "Module 10 — Shadow Volatility Lens",
    "Module 11 — Supply/Demand Pulse",
    "Module 12 — Liquidity Flow Tracker",
    "Module 13 — Market Microstructure Eye",
    "Module 14 — Error Recovery (Medusa™)",
    "Module 15 — Global Synthesis Layer"
  ];
  res.json({ modules });
});

// Payment verify endpoint (placeholder)
// In production connect to Paystack/ALAT/Flutterwave APIs with server-side secret and verify webhook
app.post('/verify-payment', (req, res) => {
  // For now: if client posts {userRef:'test'} return confirmed false
  // Implement your provider verification here
  const { userRef } = req.body || {};
  // Example: simulate confirmation if userRef === 'test-ok'
  if (userRef === 'test-ok') {
    // issue token for short-lived access
    const token = jwt.sign({ sub: userRef, activated: true }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ confirmed: true, token });
  }
  return res.json({ confirmed: false });
});

// Optional quick endpoint to check activation from server (for front-end fallback)
app.get('/payment-status', (req, res) => {
  // Implement real lookup (DB or payment provider)
  res.json({ activated: false });
});

// Medusa recover (silent auto-repair)
app.post('/recover', (req, res) => {
  // Here you can trigger scripts to restart services, clear caches, etc.
  console.log('Medusa™ recover invoked by coordinator');
  // Simulate success
  res.json({ ok: true });
});

// Activate (front-end posts user info after payment)
app.post('/activate', (req, res) => {
  const { userId } = req.body || {};
  // Validate, store activation in DB, etc.
  const token = jwt.sign({ sub: userId || 'anon', activated: true }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ success: true, token });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  
// ✅ Secure HTTP headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

// ✅ Enable compression
app.use(compression());

// ✅ Serve static files
app.use(express.static(__dirname, {
  extensions: ['html', 'htm'],
  maxAge: '1y'
}));

// ✅ Cache headers
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|json)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  next();
});

// ✅ Main route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Subpage
app.get("/public/index2.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index2.html"));
});

// ✅ Manifest & Service Worker
app.get("/manifest.json", (req, res) => {
  res.type("application/manifest+json");
  res.sendFile(path.join(__dirname, "manifest.json"));
});

app.get("/service-worker.js", (req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, "service-worker.js"));
});

// ✅ Start server
app.listen(PORT, () => {
console.log(`QuantumTrader AI Server running on port{PORT}`);
});

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
