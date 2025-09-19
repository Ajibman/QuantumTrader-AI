#!/bin/bash
# log-test.sh
# Trigger a simulated visitor interaction and log the response

echo "Running visitor simulation test..."

# Send sample visitor data to backend
curl -X POST http://localhost:3000/api/visitor-event \
  -H "Content-Type: application/json" \
  -d '{"visitorId":"test-001","action":"clicked simulation","pattern":"explore"}' \
  | tee -a TEST_LOG.md

echo "" >> TEST_LOG.md
echo "---- End of Simulation Test ----" >> TEST_LOG.md
echo "" >> TEST_LOG.md

echo "Simulation test complete. Check TEST_LOG.md for output."
