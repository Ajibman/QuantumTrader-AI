```js
// tests/contributionTest.js
const { handleTakeProfit } = require('../core/trading/TraderLogic');
require('../core/finance/contributionManager'); // Ensure listener is active

// Simulate profit-taking
handleTakeProfit('user123', 10000); // 10,000 profit
“`

Expected console output:

“`
Profit taken:10000 by user user123
500 allocated from user user123's profit
“`

(With `250` each to *philanthropy* and *cooperatives*.)

---
