#!/bin/bash
# log-test.sh — Add new test entry into TEST_LOG.md and auto-sync with GitHub

LOG_FILE="TEST_LOG.md"

# Ask user for test details
echo "=== New Test Entry ==="
read -p "Date/Time (default: now)? " datetime
datetime=${datetime:-$(date)}

read -p "Module Tested? " module
read -p "Input? " input
read -p "Expected Output? " expected
read -p "Actual Output? " actual
read -p "Status (Pass/Fail)? " status
read -p "Notes? " notes

# Append test entry
cat <<EOF >> $LOG_FILE

---

## Test Session $(date +%s)
- **Date/Time:** $datetime
- **Module Tested:** $module
- **Input:** $input
- **Expected Output:** $expected
- **Actual Output:** $actual
- **Status:** $status
- **Notes:** $notes
EOF

# Commit & push
git add $LOG_FILE
git commit -m "test: logged new session for $module ($status)"
git push origin main

echo "✅ Test logged and pushed to GitHub!"
