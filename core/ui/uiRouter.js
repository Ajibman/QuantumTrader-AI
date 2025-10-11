```js
const express = require('express');
const router = express.Router();

// Home Page
router.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to TraderLab™ UI" });
});

// Dashboard
router.get('/dashboard', (req, res) => {
  res.status(200).json({ message: "Trader Dashboard loaded" });
});

// Account Summary
router.get('/account', (req, res) => {
  res.status(200).json({ message: "Account Summary" });
});

module.exports = router;
```
