// server.js
const express = require('express');
const path = require('path');
const geoip = require('geoip-lite');
const app = express();
const PORT = process.env.PORT || 7070;

// Core modules
const { verifyUser } = require('./core/lab/verifyUser');
const { grantAccess } = require('./core/lab/accessGate');
const handleRegistration = require('./core/lab/registration');
const { trackAttempts, reportThreat } = require('./core/security/securityManager');
const { checkProximity } = require('./core/security/proximityMonitor');
const shutdownQonexAI = require('./core/security/shutdown');
const aiAssistRouter = require('./AI/userAssist');

// Middleware
app.use(express.json());
app.use('/assist', aiAssistRouter);

// Registration endpoint
app.post('/register', (req, res) => {
  const result = handleRegistration(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }

res.status (201).json({ message: "Registration successful." });
});
 
// Verification + Access endpoint
app.post('/verify', (req, res) => {
  const isVerified = verifyUser(req.body);

  if (!isVerified) {
    const blocked = trackAttempts(req);
    if (blocked) {
      reportThreat(req);
      return res.status(429).json({ error: "Verification failed multiple times. Authorities alerted." });
    }
    return res.status(401).json({ error: "Verification failed." });
  }

  // GPS/GNS Enforcement
  if (!req.headers['x-user-location']) {
    return res.status(403).json({ error: "GPS/GNS must be enabled to use QonexAI." });
  }

  // Proximity Check
  const userLocation = JSON.parse(req.headers['x-user-location']);
  const agentsNearby = [ /* define agent coordinates here */ ];
  const proximity = checkProximity(userLocation, agentsNearby);

  if (proximity.shutdown) {
    shutdownQonexAI();
    return res.status(403).json({ error: "Access denied: security agent proximity detected." });
  }

  // Grant Access
  const accessResult = grantAccess(req.body.user);
  if (!accessResult.allowed) {
    return res.status(403).json({ error: accessResult.reason });
  }

  res.status(200).json({ message: "Access granted to TraderLab™." });
});

// Root route
app.get('/', (req, res) => {

- *User registration & verification*
- *Access gating*
- *GPS/GNS enforcement*
- *Security checks (e.g. proximity detection)*
- *Sentinel & Assist modules*
- *CPilot™ placeholder (for final integration)*

// server.js
const express = require('express');
const path = require('path');
const geoip = require('geoip-lite');
const app = express();
const PORT = process.env.PORT || 7070;

// Core modules
const { verifyUser } = require('./core/lab/verifyUser');
const { grantAccess } = require('./core/lab/accessGate');
const handleRegistration = require('./core/lab/registration');
const { trackAttempts, reportThreat } = require('./core/security/securityManager');
const { checkProximity } = require('./core/security/proximityMonitor');
const shutdownQonexAI = require('./core/security/shutdown');
const aiAssistRouter = require('./AI/userAssist');

// Middleware
app.use(express.json());
app.use('/assist', aiAssistRouter);

// Registration endpoint
app.post('/register', (req, res) => {
  const result = handleRegistration(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }
[10/10, 11:26 AM] ChatGPT 1-800-242-8478: res.json({ message: "QuantumTrader-AI Server Online" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
