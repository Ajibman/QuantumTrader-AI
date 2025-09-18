 #!/bin/bash
# restore.sh - Safely restore index.html from backup with confirmation & logging

BACKUP_DIR="./backup"
TARGET_FILE="index.html"
LOG_FILE="./restore.log"

if [ ! -f "$BACKUP_DIR/$TARGET_FILE" ]; then
  echo "❌ No backup found in $BACKUP_DIR/$TARGET_FILE"
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ❌ Restore failed: No backup found" >> "$LOG_FILE"
  exit 1
fi

echo "⚠️ This will overwrite $TARGET_FILE with the backup version."
read -p "Are you sure? (y/n): " confirm

if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
  cp "$BACKUP_DIR/$TARGET_FILE" "$TARGET_FILE"
  echo "✅ Restore completed."

  # Auto-commit & push
  git add "$TARGET_FILE"
  git commit -m "restore: restored index.html from backup"
  git push origin main

  echo "$(date '+%Y-%m-%d %H:%M:%S') - ✅ Restore executed successfully" >> "$LOG_FILE"
else
  echo "❌ Restore canceled."
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ⚠️ Restore canceled by user" >> "$LOG_FILE"
fi
