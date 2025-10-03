```js
// ripo2/core/diagnostics.js

import { modules } from './moduleRegistry.js';
import { lastSignal } from './signalOrchestor.js';
import { lastPulse } from './pulseEngine.js';

export function runDiagnostics() {
  console.log('🔍 Running QonexAI Diagnostics...');

  // Check module registry
  Object.entries(modules).forEach(([id, mod]) => {
    console.log(`🧩 Module: id | Active:{mod.active}`);
  });

  // Check signal and pulse consistency
  if (lastSignal && lastPulse) {
    console.log('📶 Last Signal:', lastSignal);
    console.log('💓 Last Pulse:', lastPulse);
  } else {
    console.warn('⚠️ Missing signal or pulse data. System may not be fully initialized.');
  }

  console.log('✅ Diagnostics completed.');
}
```

> Optional: Export `runDiagnostics()` in `systemLinker.js` for periodic checks or manual trigger.

---
