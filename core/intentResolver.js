```js
// ripo2/core/intentResolver.js

import { pulseEngine } from './pulseEngine.js';
import { signalOrchestor } from './signalOrchestor.js';

export function resolveIntent(input, context = {}) {
  const intent = classifyIntent(input);

  switch (intent) {
    case 'query':
      return signalOrchestor(input, context);
    case 'action':
      return pulseEngine(input, context);
    case 'connect':
      return { status: 'initiating connection...' };
    default:
      return { status: 'Intent unclear', suggestion: 'Refine input' };
  }
}

function classifyIntent(text) {
  const lower = text.toLowerCase();
  if (lower.includes('how') || lower.includes('what')) return 'query';
  if (lower.includes('start') || lower.includes('run')) return 'action';
  if (lower.includes('connect') || lower.includes('join')) return 'connect';
  return 'unknown';
}
```

---
