#!/bin/bash
# (c) Olagoke Ajibulu — QuantumTrader AI / QonexAI Unified Sync Script
# Smart local sync between QuantumTrader-AI core and QonexAI clone

# Define paths
QT_AI="./src/core"
QONEX_AI="./QonexAI/src/core"

# Create directories if missing
mkdir -p "$QONEX_AI"

# Timestamp
echo "🕓 $(date): Starting bidirectional sync between QuantumTrader-AI ↔ QonexAI"

# Sync QuantumTrader-AI → QonexAI
rsync -av --update --exclude='.git' "$QT_AI/" "$QONEX_AI/"

# Sync QonexAI → QuantumTrader-AI
rsync -av --update --exclude='.git' "$QONEX_AI/" "$QT_AI/"

echo "✅ Sync completed successfully at $(date)"

chmod +x sync-qonexai.sh

crontab -e

*/15 * * * * cd /path/to/QuantumTrader-AI && ./sync-qonexai.sh >> sync.log 2>&1

