```js
// core/trade/traderLogic.js

const EventEmitter = require('events');
const tradeEmitter = new EventEmitter();

// Simulated trade close logic
function closeTrade(userId, tradeResult) {
  if (tradeResult.profit > 0) {
    tradeEmitter.emit('profitTaken', {
      userId,
      profit: tradeResult.profit,
      tradeId: tradeResult.tradeId,
      timestamp: Date.now()
    });
  }
}

module.exports = { closeTrade, tradeEmitter };
```
