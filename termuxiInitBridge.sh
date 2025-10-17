#!/bin/bash
# termuxInitBridge.sh
# This script ensures Termux recognizes QonexAI (QuantumTrader-AI) structure properly.

echo "🚀 Initializing QonexAI structure for Termux..."

# Ensure we’re in the correct project directory
cd ~/QuantumTrader-AI || { echo "❌ Project folder not found in home directory"; exit 1; }

# Check and sync top-level folders
for dir in src core assets modules logs; do
  if [ -d "$dir" ]; then
    echo "✅ Found folder: $dir"
  else
    echo "⚠️ Missing folder: $dir — creating it now..."
    mkdir -p "$dir"
  fi
done

# Export key paths for use in Termux sessions
export QONEXAI_HOME="$HOME/QuantumTrader-AI"
export QONEXAI_SRC="$QONEXAI_HOME/src"
export NODE_PATH="$QONEXAI_SRC"

# Teach Termux to always start from server.js
if [ -f "$QONEXAI_SRC/server.js" ]; then
  echo "🔗 Linking server.js as QonexAI entry point..."
  node "$QONEXAI_SRC/server.js"
else
  echo "❌ server.js not found in src/. Please verify structure."
fi

echo "🌍 QonexAI environment initialized successfully for Termux." #!/bin/bash
# ==========================================================
# QuantumTrader-AI Termux Initialization Bridge
# Auto-Recovery System – handles “Happy Hums” interruptions
# ==========================================================
# Author: Olagoke Ajibulu ©2025
# Version: 1.0
# Purpose: Restore last working session automatically in Termux

# --- CONFIGURATION ----------------------------------------
PROJECT_ROOT="$HOME/QuantumTrader-AI"
RECOVERY_FILE="$PROJECT_ROOT/.recovery_point"
LOG_FILE="$PROJECT_ROOT/logs/termux_recovery.log"
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")

# --- CREATE LOG DIRECTORY IF MISSING ----------------------
mkdir -p "$PROJECT_ROOT/logs"

# --- AUTO-RECOVERY FUNCTION -------------------------------
auto_recover() {
  echo "[$TIMESTAMP] Checking for previous session..." | tee -a "$LOG_FILE"

  if [ -f "$RECOVERY_FILE" ]; then
    LAST_PATH=$(cat "$RECOVERY_FILE")
    if [ -d "$LAST_PATH" ]; then
      echo "[$TIMESTAMP] Restoring session to: $LAST_PATH" | tee -a "$LOG_FILE"
      cd "$LAST_PATH" || cd "$PROJECT_ROOT"
    else
      echo "[$TIMESTAMP] Recovery path invalid, returning to project root." | tee -a "$LOG_FILE"
      cd "$PROJECT_ROOT"
    fi
  else
    echo "[$TIMESTAMP] No previous session found. Starting fresh." | tee -a "$LOG_FILE"
    cd "$PROJECT_ROOT"
  fi
}

# --- SAVE CURRENT LOCATION (CALLED WHEN EXITING TERMUX) ---
save_recovery_point() {
  echo "$(pwd)" > "$RECOVERY_FILE"
  echo "[$TIMESTAMP] Saved recovery point: $(pwd)" | tee -a "$LOG_FILE"
}

# --- MAIN EXECUTION ---------------------------------------
auto_recover

# Optional: Start development server or other default process
# node src/server.js &
# echo "[$TIMESTAMP] QuantumTrader-AI initialized."

# --- TRAP SIGNALS FOR AUTO-SAVE ---------------------------
trap save_recovery_point EXIT SIGHUP SIGINT SIGTERM

# --- USER SHELL ACCESS ------------------------------------
echo "[$TIMESTAMP] You are now in QuantumTrader-AI environment."
echo "Use 'exit' or Ctrl+C to leave. Session auto-saves on exit."
bash

