 #!/bin/bash
# restore.sh - Safely restore index.html from backup with confirmation

BACKUP_DIR="./backup"
TARGET_FILE="index.html"

if [ ! -f "$BACKUP_DIR/$TARGET_FILE" ]; then
  echo "❌ No backup found in $BACKUP_DIR/$TARGET_FILE"
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
else
  echo "❌ Restore canceled."
fi
