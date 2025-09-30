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

```js
import systemIdentity from "./identity.js";
import { isActivated } from "./activationTimer.js";

if (isActivated()) {
  console.log(`✅ systemIdentity.name is now ACTIVE.`);
 else 
  console.log(`⏳{systemIdentity.name} is dormant. Awaiting activation...`);
}
```

---

