#!/bin/bash
# log-entry.sh - Append a new entry to TEST_LOG.md and auto-commit

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

# Count existing entries
ENTRY_NUM=$(grep -c "## Entry" $LOG_FILE)
NEW_NUM=$((ENTRY_NUM + 1))

# Append to TEST_LOG.md
cat >> $LOG_FILE <<EOL

---

## Entry $NEW_NUM

\`\`\`yaml
date: $(date +"%Y-%m-%d %H:%M:%S")
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

# Auto commit and push
git add $LOG_FILE
git commit -m "docs: add TEST_LOG entry #$NEW_NUM - $TITLE"
git push

echo "🚀 Entry committed and pushed to remote."

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
