```js
const axios = require('axios');

const testPayload = {
  userId: "test-user-001",
  idType: "voter_card",
  gps: "enabled"
};

axios.post('http://localhost:7070/verify', testPayload)
  .then(res => {
    console.log("✅ Test Passed:", res.data);
  })
  .catch(err => {
    console.error("❌ Test Failed:", err.response?.data || err.message);
  });
```

---
