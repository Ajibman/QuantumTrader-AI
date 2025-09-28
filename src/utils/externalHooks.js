```js
// src/utils/externalHooks.js

export function fetchMockMarketData() {
  return {
    BTC: "26,300",
    EURUSD: "1.092",
    SP500: "4,500",
    Gold: "1,920",
    NASDAQ: "14,200",
  };
}

export function fetchSystemStatus() {
  return {
    scheduler: "Armed",
    modules: 15,
    ethics: "Enabled",
    launchDate: "Nov 09, 2025 (WA+1)",
  };
}
```

---
