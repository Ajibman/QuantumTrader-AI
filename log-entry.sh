#!/bin/bash
# log-entry.sh - Append a new entry to TEST_LOG.md

LOG_FILE="TEST_LOG.md"

# Prompt for title
echo "Enter entry title:"
read TITLE

# Prompt for step
echo "Enter step (e.g., Step 3 of Step 5):"
read STEP

# Prompt for notes
echo "Enter notes (end with CTRL+D):"
NOTES=$(</dev/stdin)

# Append to TEST_LOG.md
cat >> $LOG_FILE <<EOL

---

## Entry $(grep -c "## Entry" $LOG_FILE | awk '{print $1+1}')

\`\`\`yaml
date: $(date +"%Y-%m-%d")
step: "$STEP"
title: "$TITLE"
status: in-progress
\`\`\`

### Context  
(Describe context here)  

### Notes  
$NOTES  

### Next Actions  
1. (Add later if needed)  

EOL

echo "✅ New entry appended to $LOG_FILE"
