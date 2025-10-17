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

echo "🌍 QonexAI environment initialized successfully for Termux."
