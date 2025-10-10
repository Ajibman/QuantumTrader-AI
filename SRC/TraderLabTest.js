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

// TraderLabTest.js

const axios = require('axios');

const testUser = {
  userId: 'user123',
  voterCard: 'VCN12345678', // sample added ID method
  email: 'testuser@example.com',
  gpsEnabled: true // simulate GPS/GNS
};

// Function to simulate user location header
const headers = {
  'Content-Type': 'application/json',
  'x-user-location': '6.5244,3.3792' // sample: Lagos GPS coords
};

async function runTest() {
  try {
    const response = await axios.post('http://localhost:7070/verify', testUser, { headers });
    console.log('✅ Access Result:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('❌ Access Denied:', error.response.data);
    } else {
      console.log('🚫 Connection Error:', error.message);
    }
  }
}

runTest();
``
