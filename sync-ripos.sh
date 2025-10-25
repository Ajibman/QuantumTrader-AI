#!/bin/bash
# ================================================================
# QuantumTrader-AI ↔ QonexAI Sync Automation
# Author: Olagoke Ajibulu
# Purpose: Automatically sync both repositories bi-directionally
# ================================================================
ppppp
QT_REPO="$HOME/QuantumTrader-AI"
QX_REPO="$HOME/QonexAI"
SYNC_LOG="$HOME/sync-repos.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] === Starting Bi-Directional Sync ===" | tee -a "$SYNC_LOG"

# Ensure both repos exist
[ ! -d "$QT_REPO/.git" ] && echo "❌ Missing $QT_REPO/.git" && exit 1
[ ! -d "$QX_REPO/.git" ] && echo "❌ Missing $QX_REPO/.git" && exit 1

# Function to update a repo and fetch remote
update_repo() {
  REPO_PATH="$1"
  REPO_NAME=$(basename "$REPO_PATH")
  cd "$REPO_PATH" || exit 1
  echo "[$TIMESTAMP] Updating $REPO_NAME..." | tee -a "$SYNC_LOG"
  git fetch origin main
  git pull origin main --rebase
}

# Function to copy changes from source → destination
sync_direction() {
  SRC="$1"
  DST="$2"
  echo "[$TIMESTAMP] Syncing $(basename "$SRC") → $(basename "$DST")..." | tee -a "$SYNC_LOG"
  rsync -av --exclude='.git/' --delete "$SRC/" "$DST/"
  cd "$DST" || exit 1
  git add .
  git commit -m "Auto-sync from $(basename "$SRC") → $(basename "$DST") at $TIMESTAMP" 2>/dev/null || true
  git push origin main
}

# Step 1: Pull latest from both
update_repo "$QT_REPO"
update_repo "$QX_REPO"

# Step 2: Sync A → B
sync_direction "$QT_REPO" "$QX_REPO"

# Step 3: Sync B → A (to reflect any changes back)
sync_direction "$QX_REPO" "$QT_REPO"

echo "[$TIMESTAMP] ✅ Bidirectional sync complete!" | tee -a "$SYNC_LOG"

chmod +x sync-repos-bidirectional.sh
