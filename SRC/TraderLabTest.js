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
````

const validUser = {
  userId: 'user001',
  voterCard: 'VCN90011234',
  email: 'valid@example.com',
  gpsEnabled: true
};

const validHeaders = {
  'Content-Type': 'application/json',
  'x-user-location': '6.5244,3.3792'
};

❌  Rejected Access (GPS OFF)

const gpsOffUser = {
  userId: 'user002',
  voterCard: 'VCN00000999',
  email: 'gpsfail@example.com',
  gpsEnabled: false
};

const noGPSHeaders = {
  'Content-Type': 'application/json'
};
```

🚫 Multiple Failed Verifications (Triggers Blocking + Threat Report)
You’ll need to simulate repeated invalid verifications. Call this 3 times:
```js
const invalidUser = {
  userId: 'user999',
  voterCard: 'INVALID',
  email: 'hacker@example.com',
  gpsEnabled: true
};

const spoofHeaders = {
  'Content-Type': 'application/json',
  'x-user-location': '0.0000,0.0000'
};
```


```js
const axios = require('axios');

const baseURL = 'http://localhost:7070/verify'; // Ensure your server is running

const testCases = [
  {
    name: '✅ Successful Access (Valid User + GPS)',
    data: {
      userId: 'user001',
      voterCard: 'VCN90011234',
      email: 'valid@example.com',
      gpsEnabled: true
    },
    headers: {
      'Content-Type': 'application/json',
      'x-user-location': '6.5244,3.3792'
    }
  },
  {
    name: '❌ Rejected Access (GPS OFF)',
    data: {
      userId: 'user002',
      voterCard: 'VCN00000999',
      email: 'gpsfail@example.com',
      gpsEnabled: false
    },
    headers: {
      'Content-Type': 'application/json'
      // Missing 'x-user-location' to simulate GPS off
    }
  },
  {
    name: '🚫 Multiple Failed Verifications (Trigger Block)',
    data: {
      userId: 'user999',
      voterCard: 'INVALID',
      email: 'hacker@example.com',
      gpsEnabled: true
    },
    headers: {
      'Content-Type': 'application/json',
      'x-user-location': '0.0000,0.0000'
    },
    repeat:
      
      // Attempt 3 times
  }
];

(async () => {
  for (const test of testCases) {
    console.log(`\n=== Running: ${test.name} ===`);

const repeatCount = test.repeat || 1;
    for (let i = 1; i <= repeatCount; i++) 
      try 
        const res = await axios.post(baseURL, test.data,  headers: test.headers );
        console.log(`Attempt{i}:`, res.data);
      } catch (err) {
        const msg = err.response?.data || err.message;
        console.log(`Attempt ${i}:`, msg);
      }
    }
  }
})();
```
