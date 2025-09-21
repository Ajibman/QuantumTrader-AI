#!/bin/bash
# log-entry.sh - Append entry to TEST_LOG.md with instant save, silent background push + reminders.log notify

LOG_FILE="TEST_LOG.md"
BACKUP_DIR="backups"
REMINDERS_FILE="reminders.log"

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Create a timestamped backup
cp $LOG_FILE $BACKUP_DIR/TEST_LOG_$(date +"%Y%m%d_%H%M%S").md

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

# Append to TEST_LOG.md immediately
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

echo "✅ Entry saved instantly to $LOG_FILE (backup created in $BACKUP_DIR/)"

# Silent Git auto-commit & push in the background
(
  git add $LOG_FILE >/dev/null 2>&1
  git commit -m "docs: add TEST_LOG entry #$NEW_NUM - $TITLE" >/dev/null 2>&1
  if git push >/dev/null 2>&1; then
    echo "$(date +"%Y-%m-%d %H:%M:%S") ✅ Auto-push success: TEST_LOG entry #$NEW_NUM - $TITLE" >> $REMINDERS_FILE
  else
    echo "$(date +"%Y-%m-%d %H:%M:%S") ❌ Auto-push failed: TEST_LOG entry #$NEW_NUM - $TITLE" >> $REMINDERS_FILE
  fi
) &

echo "🚀 Git commit/push running in background. Status will be logged in $REMINDERS_FILE."

#!/bin/bash
# log-entry.sh - Append entry to TEST_LOG.md with instant save, silent background push

LOG_FILE="TEST_LOG.md"
BACKUP_DIR="backups"

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Create a timestamped backup
cp $LOG_FILE $BACKUP_DIR/TEST_LOG_$(date +"%Y%m%d_%H%M%S").md

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

# Append to TEST_LOG.md immediately
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

echo "✅ Entry saved instantly to $LOG_FILE (backup created in $BACKUP_DIR/)"

# Silent Git auto-commit & push in the background
(
  git add $LOG_FILE >/dev/null 2>&1
  git commit -m "docs: add TEST_LOG entry #$NEW_NUM - $TITLE" >/dev/null 2>&1
  git push >/dev/null 2>&1
) &

echo "🚀 Git commit/push running in background (won’t block you)."

#!/bin/bash
# log-entry.sh - Append a new entry to TEST_LOG.md with silent auto-commit and backup

LOG_FILE="TEST_LOG.md"
BACKUP_DIR="backups"

# Ensure backup directory exists
mkdir -p $BACKUP_DIR

# Create a timestamped backup
cp $LOG_FILE $BACKUP_DIR/TEST_LOG_$(date +"%Y%m%d_%H%M%S").md

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

# Silent Git auto-commit & push
git add $LOG_FILE >/dev/null 2>&1
git commit -m "docs: add TEST_LOG entry #$NEW_NUM - $TITLE" >/dev/null 2>&1
git push >/dev/null 2>&1

echo "🚀 Entry committed and pushed silently. Backup saved in $BACKUP_DIR/"#!/bin/bash
# log-entry.sh - Append a new entry to TEST_LOG.md and auto-commit silently

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

# Auto commit and push (silent mode)
git add $LOG_FILE >/dev/null 2>&1
git commit -m "docs: add TEST_LOG entry #$NEW_NUM - $TITLE" >/dev/null 2>&1
git push >/dev/null 2>&1

echo "🚀 Entry committed and pushed silently."

./log-entry.sh

chmod +x log-entry.sh

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
