#!/bin/bash
# ♻️ QonexAI Local Restore Utility
# (c) Olagoke Ajibulu — QuantumTrader AI / QonexAI Unified Build

BACKUP_DIR="./repo2/backup"

echo "🧠 QonexAI Restore System"
echo "========================="
echo "Available backups:"
echo

# List all available backup archives
ls -1t $BACKUP_DIR/backup_*.tar.gz 2>/dev/null

if [ $? -ne 0 ]; then
  echo "⚠️ No backups found in $BACKUP_DIR."
  exit 1
fi

echo
read -p "Enter the exact name of the backup file to restore (without path): " BACKUP_FILE

BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

if [ ! -f "$BACKUP_PATH" ]; then
  echo "❌ Backup file not found: $BACKUP_PATH"
  exit 1
fi

echo
echo "🚧 Restoring backup from: $BACKUP_FILE"
sleep 2

# Extract files safely
tar -xzf "$BACKUP_PATH" -C ./
echo "✅ Restore completed successfully."

echo
read -p "Would you like to start QonexAI now? (y/n): " RUN_NOW
if [[ $RUN_NOW =~ ^[Yy]$ ]]; then
  echo "🚀 Launching QonexAI..."
  node ./src/server.js
else
  echo "✅ QonexAI restore process finished."
fi

chmod +x restoreBackup.sh
