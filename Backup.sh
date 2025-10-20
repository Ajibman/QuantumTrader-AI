 #!/data/data/com.termux/files/usr/bin/bash
# ========================================================
# QonexAI Local Backup Script
# (c) Olagoke Ajibulu — QuantumTrader AI / QonexAI
# ========================================================

set -e

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
SOURCE_DIR="$HOME/QonexAI/src"
BACKUP_DIR="$HOME/QonexAI/repo2/backup"
LOG_FILE="$HOME/QonexAI/repo2/logs/backup.log"

mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date)] 🔄 Starting local backup..." | tee -a "$LOG_FILE"

if [ -d "$SOURCE_DIR" ]; then
  tar -czf "$BACKUP_DIR/QonexAI_src_backup_$TIMESTAMP.tar.gz" -C "$SOURCE_DIR" .
  echo "[$(date)] ✅ Backup completed: QonexAI_src_backup_$TIMESTAMP.tar.gz" | tee -a "$LOG_FILE"
else
  echo "[$(date)] ❌ Error: Source directory not found ($SOURCE_DIR)" | tee -a "$LOG_FILE"
  exit 1
fi

# Optional: Git commit the backup (local only)
cd "$HOME/QonexAI"
git add repo2/backup/*.tar.gz repo2/logs/backup.log
git commit -m "🗃 Backup at $TIMESTAMP"
echo "[$(date)] 🪶 Backup committed locally to Git." | tee -a "$LOG_FILE"
