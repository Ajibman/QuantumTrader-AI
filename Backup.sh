#!/bin/bash
./localBackup.sh
# Auto-clean old backups (keep last 10)
BACKUPS_LIST=$(ls -1t "$BACKUP_DIR"/index_*.html 2>/dev/null)
BACKUP_COUNT=$(echo "$BACKUPS_LIST" | wc -l)

if [ "$BACKUP_COUNT" -gt 10 ]; then
  TO_DELETE=$(echo "$BACKUPS_LIST" | tail -n +11)
  echo "$TO_DELETE" | xargs rm -f
  echo "$(date '+%Y-%m-%d %H:%M:%S') - ♻️ Auto-clean executed, deleted:" >> "$LOG_FILE"
  echo "$TO_DELETE" >> "$LOG_FILE"

  # Local notification (Linux / Mac / Windows WSL)
  if command -v notify-send &> /dev/null; then
    notify-send "QT AI Backup" "Auto-clean executed. Deleted old backups."
  elif [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e 'display notification "Auto-clean executed. Deleted old backups." with title "QT AI Backup"'
  else
    echo "Auto-clean executed – deleted old backups." # fallback
  fi

  # Wait 5 seconds before sending email
  sleep 5

  # Email alert (replace with your address or configure mail service)
  echo -e "QT AI Backup Notice\n\nAuto-clean executed at $(date).\n\nDeleted:\n$TO_DELETE" \
  | mail -s "QT AI Backup Alert" you@example.com
fi
