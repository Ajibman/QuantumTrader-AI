 #!/bin/bash
# backup.sh - Backup index.html safely with logging

SOURCE_FILE="index.html"
BACKUP_DIR="./backup"
LOG_FILE="./restore.log"

# Ensure backup folder exists
mkdir -p "$BACKUP_DIR"

# Check if index.html exists
if [ ! -f "$SOURCE_FILE" ]; then
  echo "❌ No $SOURCE_FILE found to backup."
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ❌ Backup failed: No $SOURCE_FILE found" >> "$LOG_FILE"
  exit 1
fi

# Backup process
cp "$SOURCE_FILE" "$BACKUP_DIR/$SOURCE_FILE"
echo "✅ Backup completed: $BACKUP_DIR/$SOURCE_FILE"

# Auto-commit & push
git add "$BACKUP_DIR/$SOURCE_FILE"
git commit -m "backup: saved index.html to backup folder"
git push origin main

# Log the event
echo "$(date '+%Y-%m-%d %H:%M:%S') - ✅ Backup executed successfully" >> "$LOG_FILE"
