 // server.mjs
// QuantumTrader AI - Hardened server.mjs
// Author: Generated for Olagoke Ajibulu
// Notes: Serve static files from ./public and provide handshake/payment endpoints.

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ----- Configuration (use .env or Render env vars) -----
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';
const PAYMENT_SECRET = process.env.PAYMENT_SECRET || 'replace_payment_secret';

// ----- Middleware -----
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ----- Static files: Serve from ./public -----
const PUBLIC_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  console.warn('Warning: public directory not found at', PUBLIC_DIR);
}
app.use(express.static(PUBLIC_DIR, { extensions: ['html'], maxAge: '1y' }));

// ----- Cache-control for static assets -----
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|json|webp)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});

// ----- Health & status -----
app.get('/status', (req, res) => {
  res.json({ status: 'ok', app: 'QuantumTrader-AI', time: new Date().toISOString() });
});

// ----- Handshake -----
app.get('/handshake', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Handshake acknowledged',
    ts: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// ----- Modules list (for UI to render module names) -----
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

// ----- Payment status (simple server-side check placeholder) -----
app.get('/payment-status', (req, res) => {
  // TODO: Replace with DB lookup or real payment provider verification
  res.json({ activated: false });
});

// ----- Verify payment (placeholder) -----
// Frontend posts { userRef } and server verifies with provider.
// For now: if userRef === 'test-ok' return confirmed true + token.
app.post('/verify-payment', (req, res) => {
  const { userRef } = req.body || {};
  if (userRef === 'test-ok') {
    const token = jwt.sign({ sub: userRef, activated: true }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ confirmed: true, token });
  }
  // default: not confirmed
  return res.json({ confirmed: false });
});

// ----- Activate endpoint -----
// After a verified payment webhook, your backend should call this or you can implement DB persistence.
// Here we return a short-lived JWT to the client.
app.post('/activate', (req, res) => {
  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId required' });
  }
  const token = jwt.sign({ sub: userId, activated: true }, JWT_SECRET, { expiresIn: '30d' });
  // TODO: persist activation state to DB for robust server-side checks
  return res.json({ success: true, token });
});

// ----- Medusa™ auto-recovery hook (silent) -----
// This endpoint should be protected in production (e.g., by a shared secret)
app.post('/recover', (req, res) => {
  console.log('Medusa™ recovery invoked by coordinator');
  // TODO: add recovery steps: restart jobs, refresh caches, run diagnostics
  return res.json({ ok: true, invokedAt: new Date().toISOString() });
});

// ----- Fallback for manifest & service worker if they exist in public -----
app.get('/manifest.json', (req, res) => {
  const p = path.join(PUBLIC_DIR, 'manifest.json');
  if (fs.existsSync(p)) return res.sendFile(p);
  return res.status(404).send('manifest.json not found');
});

app.get('/service-worker.js', (req, res) => {
  const p = path.join(PUBLIC_DIR, 'service-worker.js');
  if (fs.existsSync(p)) {
    res.type('application/javascript');
    return res.sendFile(p);
  }
  return res.status(404).send('service-worker.js not found');
});

// ----- Fallback routes: main index & index2 -----
app.get('/index2.html', (req, res) => {
  const p = path.join(PUBLIC_DIR, 'index2.html');
  if (fs.existsSync(p)) return res.sendFile(p);
  return res.status(404).send('index2.html not found');
});

// Serve index.html as root
app.get('/', (req, res) => {
  const p = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(p)) return res.sendFile(p);
  return res.status(404).send('index.html not found');
});

// ----- Robots & sitemap (if present) -----
app.get('/robots.txt', (req, res) => {
  const p = path.join(PUBLIC_DIR, 'robots.txt');
  if (fs.existsSync(p)) return res.sendFile(p);
  res.type('text/plain').send('User-agent: *\nDisallow:');
});
app.get('/sitemap.xml', (req, res) => {
  const p = path.join(PUBLIC_DIR, 'sitemap.xml');
  if (fs.existsSync(p)) return res.sendFile(p);
  res.status(404).send('sitemap.xml not found');
});

// ----- 404 fallback -----
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// ----- Start single server -----
app.listen(PORT, () => {
  console.log(`✅ QuantumTrader-AI server listening on port ${PORT}`);
});
