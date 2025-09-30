```js
const moduleRegistry = require('./moduleRegistry');

function pulseMonitor() {
  const report = [];

  Object.entries(moduleRegistry).forEach(([name, mod]) => {
    const status = mod.status || 'unknown';
    report.push({ module: name, status });
  });

  console.log('📡 Pulse Monitor Report:', report);
  return report;
}

module.exports = pulseMonitor;
```
