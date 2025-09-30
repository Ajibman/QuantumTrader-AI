```js
const activationTimer = require('./activationTimer');
const moduleRegistry = require('./moduleRegistry');

const gateKeeper = () => {
  const currentTime = new Date();
  const activationTime = activationTimer.getActivationTime();

  if (currentTime < activationTime) {
    console.log('🛡️ GateKeeper: System locked. Awaiting activation time...');
    return false;
  }

  console.log('🛡️ GateKeeper: Access granted. System is now active.');
  Object.keys(moduleRegistry).forEach((mod) => {
    moduleRegistry[mod].status = 'active';
  });

  return true;
};

module.exports = gateKeeper;
```
