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

#!/bin/bash
# ==============================================================
# Qonex↔QuantumTrader-AI Medusa™ Auto-Healing Sync Bridge (v2.1)
# --------------------------------------------------------------
# Author: Olagoke Ajibulu
# Purpose: Maintain parity between dual-repo instances.
# Features:
#   - Intelligent parity check (SHA1)
#   - Auto-retry & silent healing
#   - Self-loop daemon (optional)
# ==============================================================

set -e

QONEX_PATH="$HOME/QonexAI"
QT_PATH="$HOME/QuantumTrader-AI"
LOG_FILE="$HOME/.medusa_sync.log"
MAX_RETRIES=7
SLEEP_INTERVAL=15  # seconds between retries

timestamp() { date +"[%Y-%m-%d %H:%M:%S]"; }

log() { echo "$(timestamp) $1" >> "$LOG_FILE"; }

# 🧠 Compute Directory SHA1 Signature (excluding .git)
dir_hash() {
  find "$1" -type f ! -path "*/.git/*" -exec sha1sum {} + | sort | sha1sum | awk '{print $1}'
}

# 🌍 Medusa Parity Logic
hash_qonex=$(dir_hash "$QONEX_PATH")
hash_qt=$(dir_hash "$QT_PATH")

if [ "$hash_qonex" == "$hash_qt" ]; then
  log "🔸 Repositories already in sync. No action required."
  exit 0
fi

log "🧠 Parity mismatch detected — initiating Medusa™ Sync..."

attempt=1
while [ $attempt -le $MAX_RETRIES ]; do
  log "Attempt $attempt of $MAX_RETRIES..."

  # === Step 1: Mirror from QonexAI → QuantumTrader-AI ===
  rsync -av --delete --exclude='.git' "$QONEX_PATH/" "$QT_PATH/" >> "$LOG_FILE" 2>&1 || true

  # === Step 2: Commit & Push Changes ===
  cd "$QT_PATH" || exit
  git add . >> "$LOG_FILE" 2>&1
  git commit -m "🧩 Auto-sync via Medusa™ (attempt $attempt)" >> "$LOG_FILE" 2>&1 || true

  if git push origin main >> "$LOG_FILE" 2>&1; then
    log "✅ Sync successful on attempt $attempt."
    break
  else
    log "⚠️ Sync failed. Retrying in $SLEEP_INTERVAL seconds..."
    sleep $SLEEP_INTERVAL
    ((attempt++))
  fi
done

if [ $attempt -gt $MAX_RETRIES ]; then
  log "❌ Medusa™ exhausted retries. Manual check required."
else
  log "🌍 Repositories synchronized successfully."
fi

# 💤 Optional: Self-loop background healing mode
if [ "$1" == "--daemon" ]; then
  log "🕊️ Medusa™ entering continuous watch mode..."
  while true; do
    sleep 300
    bash "$0"
  done &
  disown
fi

chmod +x .git/hooks/post-commit
chmod +x scripts/qonex_sync.sh
