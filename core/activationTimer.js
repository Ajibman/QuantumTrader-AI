```js
const systemIdentity = {
  name: "QuantumTrader-AI",
  origin: "Ekiti, Nigeria",
  poweredBy: "OpenAI",
  type: "Quantum-origin Neural Exchange System AI"
};

export default systemIdentity;
```

const launchTimestamp = new Date("2025-11-09T00:00:00Z").getTime();

export function isActivated() {
  const now = Date.now();
  return now >= launchTimestamp;
}
```
