#!/bin/bash
# QuantumTrader AI — Local Backup Script
# (c) Olagoke Ajibulu — QonexAI / QT AI Unified Build

# === CONFIGURATION ===
REPO_PATH="$HOME/QonexAI"
BACKUP_PATH="$HOME/QonexAI/repo2/backup"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

# === PREPARE BACKUP FOLDER ===
mkdir -p "$BACKUP_PATH"

# === ARCHIVE CORE FILES ===
tar -czf "$BACKUP_PATH/QT_AI_Backup_$TIMESTAMP.tar.gz" \
    -C "$REPO_PATH" \
    src/server.js \
    src/core \
    public \
    modules \
    package.json \
    package-lock.json

# === LOG OUTPUT ===
echo "🧠 Local backup created at: $BACKUP_PATH/QT_AI_Backup_$TIMESTAMP.tar.gz"
echo "✅ Backup complete — ready for recovery if needed."
