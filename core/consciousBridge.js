// consciousBridge.js

import { resolveIntent } from './intentResolver.js';

export function consciousBridge(claimInput) {
  const resolved = resolveIntent(claimInput);

  if (resolved.status === 'error') {
    return {
      bridge: 'incomplete',
      reason: resolved.reason,
    };
  }

  return {
    bridge: 'complete',
    status: 'aligned',
    payload: resolved,
    acknowledged: true,
  };
}
```
