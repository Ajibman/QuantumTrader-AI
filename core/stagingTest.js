```js
// tests/stagingTest.js

const simulateGPSStatus = (isEnabled) => {
  console.log(`[GPS Test] GPS is isEnabled ? 'ENABLED ✅' : 'DISABLED ❌'`);
  if (!isEnabled) throw new Error('Access denied: GPS must be enabled.');
;

const simulateVerificationAttempts = (attempts) => 
  console.log(`[Verification Test] Attempting{attempts} logins...`);
  if (attempts >= 3) throw new Error('User blocked after 3 failed attempts.');
  console.log('Verification passed or attempts below limit.');
};

const simulatePokingAfterBlock = (pokingCount) => {
  if (pokingCount > 3) {
    console.log('🚨 Silent report triggered to security agency...');
  } else {
    console.log('🛡️ Monitoring suspicious behavior...');
  }
};

const simulateProximity = (distanceMeters) => {
  console.log(`[Proximity Test] Security agents are ${distanceMeters}m away.`);
  if (distanceMeters <= 50) {
    console.log('⚠️ QonexAI shutting down due to security risk.');
  } else {
    console.log('✅ Safe distance. System running normally.');
  }
};
```
// === Run Simulation ===
try {
  simulateGPSStatus(true);               // Simulate GPS on
  simulateVerificationAttempts(2);       // Under limit
         simulateVerificationAttempts(3);       // Triggers block
} catch (e) {
  console.error(e.message);
}

simulatePokingAfterBlock(4);             // Should trigger silent alert
simulateProximity(45);    
// Should trigger auto shutdown
