`js
const express = require('express');
const router = express.Router();

// Register a Vigilanté Unit
router.post('/register', (req, res) => 
  const  unitName, region, contactPerson  = req.body;
  res.json( message: `Vigilanté '{unitName}' registered in region.` );
);

// Receive Funding Notification
router.post('/receive-support', (req, res) => 
  const  unitName, coopName, amount  = req.body;
  res.json(
    message: `Vigilanté '{unitName}' received ₦amount from '{coopName}'.`,
    acknowledged: true,
  });
});

module.exports = router;
```
