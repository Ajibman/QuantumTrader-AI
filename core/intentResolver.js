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

// ripo2/core/intentResolver.js

import { processIntent } from './pulseEngine.js';

export function resolveIntent(userInput) {
  // Parse basic intent structure
  const intent = {
    message: userInput,
    detectedIntent: detectIntent(userInput),
    timestamp: Date.now()
  };

  return processIntent(intent);
}

function detectIntent(input) {
  // Simple keyword-based detection (to be improved with NLP)
  if (input.toLowerCase().includes('data')) return 'dataRequest';
  if (input.toLowerCase().includes('help')) return 'supportRequest';
  return 'unknown';
}
```

// intentResolver.js

import { alignWithCosmos } from './cosmicAlignment.js';

export function resolveIntent(claimData) {
  if (!claimData || !claimData.message) {
    return {
      status: 'error',
      reason: 'No claim message provided.',
    };
  }

  const alignmentResult = alignWithCosmos(claimData);

  return {
    original: claimData,
    alignment: alignmentResult,
    timestamp: new Date().toISOString(),
  };
}
```

---
