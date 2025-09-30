```js
// core/metaLedger.js

const metaLedger = {
  logs: [],

  record(eventType, data) {
    const timestamp = new Date().toISOString();
    this.logs.push({ timestamp, eventType, data });
    console.log(`[metaLedger] eventType @{timestamp}`, data);
  },

  getHistory(limit = 100) {
    return this.logs.slice(-limit);
  },

  clear() {
    this.logs = [];
    console.log("[metaLedger] Ledger cleared");
  }
};

module.exports = metaLedger;
```

---
