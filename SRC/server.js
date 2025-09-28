```js
const child_process = require('child_process');
const version = child_process.execSync('git rev-parse --short HEAD').toString().trim();
console.log(`🧠 QT AI server.js running at commit: ${version}`);
```

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 7070;

const now = new Date();

// === 🗓️ Timeline Phases ===
const PHASES = {
  dormantUntil: new Date('2025-11-09T00:00:00Z'),
  phase1: new Date('2025-11-09T00:00:00Z'),   // Peace Mode
  phase2: new Date('2025-12-01T00:00:00Z'),   // Visitor Engine
  phase3: new Date('2026-01-01T00:00:00Z'),   // Quantum Signal
};

// === 💤 Dormant Until Launch ===
if (now < PHASES.dormantUntil) {
  console.log("🕊️ QuantumTrader-AI is dormant until November 09, 2025.");
  process.exit();
}

// === 🚀 Base Server Activation ===
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
