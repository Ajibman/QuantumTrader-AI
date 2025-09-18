 #!/bin/bash
# log-test.sh — Add new test entry into TEST_LOG.md with sequential Session IDs, preview, and auto-sync

LOG_FILE="TEST_LOG.md"

# Determine next session number
if [ -f "$LOG_FILE" ]; then
    session_num=$(grep -c "## Test Session" "$LOG_FILE")
    session_num=$((session_num + 1))
else
    session_num=1
fi

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

# Prepare test entry
entry=$(cat <<EOF

---

## Test Session $session_num
- **Date/Time:** $datetime
- **Module Tested:** $module
- **Input:** $input
- **Expected Output:** $expected
- **Actual Output:** $actual
- **Status:** $status
- **Notes:** $notes
EOF
)

# Preview
echo "=== Preview Test Entry ==="
echo "$entry"
echo "=========================="
read -p "Do you want to append and push this entry? (y/n) " confirm

if [[ "$confirm" =~ ^[Yy]$ ]]; then
    echo "$entry" >> $LOG_FILE
    git add $LOG_FILE
    git commit -m "test: logged new session $session_num for $module ($status)"
    git push origin main
    echo "✅ Test Session $session_num logged and pushed to GitHub!"
else
    echo "⚠️ Test entry canceled. Nothing was committed."
fi
