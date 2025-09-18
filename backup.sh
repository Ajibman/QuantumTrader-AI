 # Auto-clean old backups (keep last 10)
BACKUPS_LIST=$(ls -1t "$BACKUP_DIR"/index_*.html 2>/dev/null)
BACKUP_COUNT=$(echo "$BACKUPS_LIST" | wc -l)

if [ "$BACKUP_COUNT" -gt 10 ]; then
  TO_DELETE=$(echo "$BACKUPS_LIST" | tail -n +11)
  echo "$TO_DELETE" | xargs rm -f
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ♻️ Auto-clean executed, deleted:" >> "$LOG_FILE"
  echo "$TO_DELETE" >> "$LOG_FILE"

  # Send notification (placeholder)
  echo "QT AI Backup Notice: Auto-clean executed at $(date). Deleted: $TO_DELETE" | mail -s "QT AI Backup Alert" you@example.com
fi
