#!/bin/bash
# 🔁 Local Auto-Backup for QuantumTrader AI
# (c) Olagoke Ajibulu — QT AI / QonexAI Unified Build

BACKUP_DIR="./repo2/backup"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
COMMIT_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "no-commit")

# Ensure backup folder exists
mkdir -p $BACKUP_DIR

# Create a timestamped backup copy of src and server.js
tar -czf "$BACKUP_DIR/backup_$TIMESTAMP_$COMMIT_HASH.tar.gz" ./src ./server.js

# Optionally, track it in git (uncomment to commit automatically)
# git add $BACKUP_DIR
# git commit -m "Auto local backup: $TIMESTAMP ($COMMIT_HASH)"
# git push origin main

echo "✅ Local backup created at: $BACKUP_DIR/backup_$TIMESTAMP_$COMMIT_HASH.tar.gz"

chmod +x localBackup.sh
