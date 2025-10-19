#!/bin/bash
# ==============================================================
# Qonex↔QuantumTrader-AI Auto-Healing Sync Bridge
# --------------------------------------------------------------
# Architect: Olagoke Ajibulu
# Module: Medusa™ Auto-Heal Extension
# Purpose: Ensure continuous bi-directional repo parity
# ==============================================================

set -e

# 🔍 CONFIGURATION
QONEX_PATH="$HOME/QonexAI"
QT_PATH="$HOME/QuantumTrader-AI"
LOG_FILE="$HOME/.medusa_sync.log"
MAX_RETRIES=7
SLEEP_INTERVAL=15  # seconds between retries

timestamp() {
  date +"[%Y-%m-%d %H:%M:%S]"
}

echo "$(timestamp) 🧠 Medusa™ Sync Initiated..." >> "$LOG_FILE"

# 🌀 Auto-Heal Loop
attempt=1
while [ $attempt -le $MAX_RETRIES ]; do
  echo "$(timestamp) Attempt $attempt of $MAX_RETRIES..." >> "$LOG_FILE"

  # === Step 1: Sync QonexAI → QuantumTrader-AI ===
  rsync -av --delete --exclude='.git' "$QONEX_PATH/" "$QT_PATH/" >> "$LOG_FILE" 2>&1 || true

  # === Step 2: Commit and Push to GitHub ===
  cd "$QT_PATH" || exit
  git add .
  git commit -m "🧩 Auto-sync via Medusa™ (attempt $attempt)" >> "$LOG_FILE" 2>&1 || true

  if git push origin main >> "$LOG_FILE" 2>&1; then
    echo "$(timestamp) ✅ Sync successful on attempt $attempt." >> "$LOG_FILE"
    break
  else
    echo "$(timestamp) ⚠️ Sync failed. Retrying in $SLEEP_INTERVAL seconds..." >> "$LOG_FILE"
    sleep $SLEEP_INTERVAL
    ((attempt++))
  fi
done

if [ $attempt -gt $MAX_RETRIES ]; then
  echo "$(timestamp) ❌ Medusa™ exhausted retries. Manual check required." >> "$LOG_FILE"
else
  echo "$(timestamp) 🌍 Repositories synchronized successfully." >> "$LOG_FILE"
fi

# 💤 Optional: silent background healing (self-loop)
if [ "$1" == "--daemon" ]; then
  while true; do
    sleep 300
    bash "$0"
  done &
  disown
fi

chmod +x scripts/qonex_sync.sh
