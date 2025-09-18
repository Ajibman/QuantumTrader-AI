 #!/bin/bash
# backup.sh - Backup index.html safely with logging & auto-clean

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

# Timestamp for unique backup names
TIMESTAMP=$(date '+%Y%m%d_%H%M%S')
BACKUP_FILE="$BACKUP_DIR/index_$TIMESTAMP.html"

# Backup process
cp "$SOURCE_FILE" "$BACKUP_FILE"
echo "✅ Backup completed: $BACKUP_FILE"

# Auto-commit & push
git add "$BACKUP_FILE"
git commit -m "backup: saved index.html as $BACKUP_FILE"
git push origin main

# Log the event
echo "$(date '+%Y-%m-%d %H:%M:%S') - ✅ Backup executed successfully -> $BACKUP_FILE" >> "$LOG_FILE"

# Auto-clean old backups (keep last 10)
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/index_*.html 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt 10 ]; then
  ls -1t "$BACKUP_DIR"/index_*.html | tail -n +11 | xargs rm -f
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ♻️ Auto-clean executed, kept last 10 backups" >> "$LOG_FILE"
fi
