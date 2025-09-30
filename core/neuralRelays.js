```js
const moduleRegistry = require('./moduleRegistry');

function transmitSignal(fromModule, toModule, data) {
  if (!moduleRegistry[fromModule] || !moduleRegistry[toModule]) {
    console.error('❌ Neural Relay Error: Module not found.');
    return false;
  }

  console.log(`🔁 NeuralRelay: Signal from fromModule to{toModule}:`, data);

  if (typeof moduleRegistry[toModule].receiveSignal === 'function') {
    moduleRegistry[toModule].receiveSignal(fromModule, data);
    return true;
  }

  console.warn(`⚠️ ${toModule} does not accept incoming signals.`);
  return false;
}

module.exports = { transmitSignal };
```
