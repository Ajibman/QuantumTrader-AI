```js
const { monitorActivity } = require('./intelligenceCore');
const { respondToTrader } = require('./traderSupport');
const { triggerAlert } = require('./alertEngine');

function runCPilot(userData) {
  const status = monitorActivity(userData);
  if (status.alert) {
    triggerAlert(status.message);
  }
  respondToTrader(status.recommendation);
}

module.exports = { runCPilot };
```
