```js
// core/cpilot/flightManager.js
const { runMarketScan } = require('../missions/marketScan');
const { sendHelpPrompt } = require('../missions/helpPrompt');

function dispatchFlightPlan(user, request) {
  switch (request.type) {
    case "MARKET_SCAN":
      return runMarketScan(user, request.payload);

    case "HELP":
      return sendHelpPrompt(user);

    default:
      return { status: "ignored", message: "Unknown flight type." };
  }
}

module.exports = { dispatchFlightPlan };
```
