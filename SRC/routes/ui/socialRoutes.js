const express = require('express');
const router = express.Router();

router.post('/consent/philanthropy', (req, res) => {
  const { userId, consent } = req.body;
  if (consent === 'yes') {
    // Save user's philanthropy consent (2.5% profit)
    console.log(`User userId consented to philanthropy.`);
    // Store in database or session (placeholder)
  
  res.redirect('/dashboard');
);

router.post('/consent/cooperatives', (req, res) => 
  const  userId, consent  = req.body;
  if (consent === 'yes') 
    // Save user's cooperatives consent (2.5
    console.log(`User{userId} consented to cooperatives.`);
    // Store in database or session (placeholder)
  }
  res.redirect('/dashboard');
});

module.exports = router;
```
