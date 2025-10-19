#!/bin/bash
# ==============================================================
# POST-COMMIT HOOK → Auto Sync for QonexAI ↔ QuantumTrader-AI
# Author: Olagoke Ajibulu
# Purpose: Automatically mirror repositories after every commit
# ==============================================================

# Define project root relative to this hook
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
SYNC_SCRIPT="$PROJECT_ROOT/scripts/qonex_sync.sh"

# Safety check
if [ ! -f "$SYNC_SCRIPT" ]; then
  echo "⚠️  Sync script not found at $SYNC_SCRIPT"
  echo "Please ensure qonex_sync.sh exists and is executable."
  exit 1
fi

# Run the sync bridge
echo "🔄 Running automatic Qonex↔QuantumTrader sync..."
bash "$SYNC_SCRIPT"

# Optional: notify via terminal or system log
if command -v notify-send &>/dev/null; then
  notify-send "Qonex↔QuantumTrader Sync Complete" "Repositories are now mirrored."
else
  echo "✅ Sync complete."
fi

chmod +x scripts/qonex_sync.sh
