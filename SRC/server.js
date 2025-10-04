 ```js
const child_process = require('child_process');
const version = child_process.execSync('git rev-parse --short HEAD').toString().trim();
console.log(`🧠 QT AI server.js running at commit: ${version}`);

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 7070;

const now = new Date();

// === 🗓️ Timeline Phases ===
const PHASES = {
  dormantUntil: new Date('2025-11-09T00:00:00Z'),
  phase1: new Date('2025-11-09T00:00:00Z'),
  phase2: new Date('2025-12-01T00:00:00Z'),
  phase3: new Date('2026-01-01T00:00:00Z'),
};

// === 🔓 TEMPORARY BYPASS FOR TESTING ===
// Comment out after testing
// if (now < PHASES.dormantUntil) {
//   console.log("🕊️ QuantumTrader-AI is dormant until November 09, 2025.");
//   process.exit();
// }

// === 🚀 Static Files and Middleware ===
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// === 📲 Claim Endpoint ===
app.post('/claim', (req, res) => {

const  phone  = req.body;
  if (!phone) 
    return res.status(400).json( message: 'Phone number is required.' );
  

  const claimsFile = path.join(__dirname, 'claims.json');
  let claims = [];

  if (fs.existsSync(claimsFile)) 
    claims = JSON.parse(fs.readFileSync(claimsFile, 'utf-8'));
  

  const alreadyClaimed = claims.find(cl => cl.phone === phone);
  if (alreadyClaimed) 
    return res.json( message: 'Data already claimed.' );
  

  const newClaim = 
    id: claims.length + 1,
    phone,
    claimDate: new Date().toISOString(),
    status: 'claimed',
    dataAllocatedMB: 500
  ;

  claims.push(newClaim);
  fs.writeFileSync(claimsFile, JSON.stringify(claims, null, 2));

  res.json( message: '500MB successfully claimed!' );
);

// === Start Server ===
app.listen(PORT, () => 
  console.log(`🚀 Server running on port{PORT}`);
});
```
