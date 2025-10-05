 ```js
import systemIdentity from "./identity.js";
import { isActivated, timeUntilActivation } from "./activationTimer.js";

function displayStatus() {
  console.log(`🔍 System: systemIdentity.name`);
  console.log(`🌍 Origin:{systemIdentity.origin}`);
  console.log(`⚡ Powered by: systemIdentity.poweredBy`);
  console.log(`🧠 Type:{systemIdentity.type}`);
  console.log(`🕊 Motto: ${systemIdentity.slogan}`);
  console.log("— — — — —");

  if (isActivated()) {
    console.log(`✅ System is ACTIVE.`);
  } else {
    const msLeft = timeUntilActivation();

const moduleRegistry = require('./moduleRegistry');

const statusMonitor = () => {
  const statuses = Object.keys(moduleRegistry).map((mod) => {
    return {
      module: mod,
      status: moduleRegistry[mod]?.status || 'unknown',
      timestamp: new Date().toISOString()
    };
  });

  console.log('🩺 System Status Report:', statuses);
  return statuses;
};

module.exports = statusMonitor;
```
