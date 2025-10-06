```js
// core/security/proximityMonitor.js
function checkProximity(userLocation, agentsList) {
  for (const agent of agentsList) {
    const distance = calculateDistance(userLocation, agent.location);
    if (distance <= 50) {
      return { shutdown: true, message: "Proximity breach detected." };
    }
  }
  return { shutdown: false };
}

// Placeholder: Haversine formula for distance (to be implemented)
function calculateDistance(loc1, loc2) {
  // TODO: Compute distance between two GPS coords
  return 0;
}

module.exports = { checkProximity };
```

*Integration into `server.js`:*

```js
const { checkProximity } = require('./core/security/proximityMonitor');
```

---
