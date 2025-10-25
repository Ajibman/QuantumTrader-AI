``js
const express = require('express');
const router = express.Router();

// Register Cooperative
router.post('/register', (req, res) => {
  const { name, region, purpose } = req.body;
  res.json({ message: `Cooperative 'name' registered to support:{purpose}.` });
});

// Fund a Vigilanté Unit
router.post('/support-vigilante', (req, res) => {
  const { coopName, unitName, amount } = req.body;
  // Simulated support logic
  res.json({
    message: `₦amount allocated from '{coopName}' to Vigilanté Unit '${unitName}'.`,
    status: 'Support Recorded',
  });
});

module.exports = router;
```
