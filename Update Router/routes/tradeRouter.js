```js
// routes/tradeRouter.js

const express = require('express');
const router = express.Router();
const { processTradeRequest } = require('../core/trader/traderLogic');

router.post('/trade', (req, res) => {
  const tradeData = req.body;
  const result = processTradeRequest(tradeData);

  if (!result.success) {
    return res.status(400).json({ error: result.reason });
  }

  res.status(200).json(result);
});

module.exports = router;
```
