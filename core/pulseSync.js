```js
const EventEmitter = require('events');
const pulseEmitter = new EventEmitter();

const pulseInterval = 10000; // 10 seconds pulse

const startPulse = () => {
  setInterval(() => {
    const timestamp = new Date().toISOString();
    pulseEmitter.emit('pulse', { timestamp });
    console.log(`💓 System Pulse @ ${timestamp}`);
  }, pulseInterval);
};

module.exports = {
  startPulse,
  pulseEmitter
};
```
