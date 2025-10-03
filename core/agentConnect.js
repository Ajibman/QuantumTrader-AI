```js
// ripo2/core/agentConnect.js

import { syncBridge } from './syncBridge.js';
import { modules } from './moduleRegistry.js';

const connectedAgents = [];

export function connectAgent(agentId, context = {}) {
  const agent = {
    id: agentId,
    connectedAt: new Date(),
    context,
    status: 'active'
  };

  connectedAgents.push(agent);
  syncBridge(agentId, 'agent_connected');

  console.log(`🤝 Agent agentId connected.`);
  return agent;


export function listConnectedAgents() 
  return connectedAgents;


export function disconnectAgent(agentId) 
  const index = connectedAgents.findIndex(a => a.id === agentId);
  if (index !== -1) 
    connectedAgents[index].status = 'disconnected';
    syncBridge(agentId, 'agent_disconnected');
    console.log(`🔌 Agent{agentId} disconnected.`);
  }
}
```
