```js
const fs = require('fs');
const path = require('path');

const CLAIMS_FILE = path.join(__dirname, 'data', 'claims.json');

function handleClaim(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { phone } = req.body;

  if (!phone || typeof phone !== 'string') {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  const newClaim = {
    id: Date.now(),
    phone,
    claimDate: new Date().toISOString(),
    status: 'pending',
    dataAllocatedMB: 500
  };

  fs.readFile(CLAIMS_FILE, 'utf8', (err, data) => {
    let claims = [];
    if (!err && data) {
      try {
        claims = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing claims.json:', parseErr);
      }
    }

    claims.push(newClaim);

    fs.writeFile(CLAIMS_FILE, JSON.stringify(claims, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Error saving claim:', writeErr);

return res.status(500).json({ error: 'Could not save claim' });
      }

      res.status(200).json({ message: 'Claim submitted successfully', claim: newClaim });
    });
  });
}

module.exports = handleClaim;
```
