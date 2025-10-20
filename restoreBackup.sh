 #!/data/data/com.termux/files/usr/bin/bash
# ========================================================
# QonexAI Local Restore Script
# (c) Olagoke Ajibulu — QuantumTrader AI / QonexAI
# ========================================================

set -e

BACKUP_DIR="$HOME/QonexAI/repo2/backup"
RESTORE_DIR="$HOME/QonexAI/src"
LOG_FILE="$HOME/QonexAI/repo2/logs/backup.log"

mkdir -p "$RESTORE_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/QonexAI_src_backup_*.tar.gz 2>/dev/null | head -n 1)

if [ -z "$LATEST_BACKUP" ]; then
  echo "[$(date)] ❌ No backup file found in $BACKUP_DIR." | tee -a "$LOG_FILE"
  exit 1
fi

echo "[$(date)] 🔁 Restoring from backup: $(basename "$LATEST_BACKUP")" | tee -a "$LOG_FILE"
tar -xzf "$LATEST_BACKUP" -C "$RESTORE_DIR"
echo "[$(date)] ✅ Restore completed successfully." | tee -a "$LOG_FILE"
