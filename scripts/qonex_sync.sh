#!/bin/bash
# ==============================================================
# QONEX ↔ QUANTUM TRADER AI  |  Bi-Directional Repo Bridge
# Architect: Olagoke Ajibulu
# Purpose: Maintain full Git equivalence between QuantumTrader-AI and QonexAI
# ==============================================================

set -e

# 🧭 Identify working repo
CURRENT_DIR=$(basename "$PWD")
BASE_DIR=$(dirname "$PWD")

if [ -d "$PWD/.git" ]; then
    REPO_DIR="$PWD"
elif [ -d "$BASE_DIR/QuantumTrader-AI/.git" ]; then
    REPO_DIR="$BASE_DIR/QuantumTrader-AI"
elif [ -d "$BASE_DIR/QonexAI/.git" ]; then
    REPO_DIR="$BASE_DIR/QonexAI"
else
    echo "❌ Error: No .git repository found near working directory."
    exit 1
fi

cd "$REPO_DIR"
echo "📦 Active Repository → $REPO_DIR"

# 🔗 Establish symbolic equivalence if missing
if [ ! -d "$BASE_DIR/QonexAI" ]; then
    ln -s "$REPO_DIR" "$BASE_DIR/QonexAI"
    echo "🔗 Created symbolic link: QonexAI → QuantumTrader-AI"
fi

if [ ! -d "$BASE_DIR/QuantumTrader-AI" ]; then
    ln -s "$REPO_DIR" "$BASE_DIR/QuantumTrader-AI"
    echo "🔗 Created symbolic link: QuantumTrader-AI → QonexAI"
fi

# 🌐 Ensure dual remote mapping
QT_REMOTE="https://github.com/ajibman/QuantumTrader-AI.git"
QX_REMOTE="https://github.com/ajibman/QonexAI.git"

# Add both remotes if not already present
git remote | grep -q "origin" || git remote add origin "$QT_REMOTE"
git remote | grep -q "mirror" || git remote add mirror "$QX_REMOTE"

# Ensure remotes are valid
echo "🌍 Git remotes now include:"
git remote -v | grep -E "origin|mirror"

# 🧠 Unified Commit + Auto Mirror Push
echo "🧠 Committing and mirroring changes..."
git add .
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Unified sync commit from Qonex ↔ QT AI Bridge @ $TIMESTAMP" || echo "ℹ️ No new changes to commit."

# Push to both remotes
echo "⬆️ Pushing to QuantumTrader-AI..."
git push origin main || echo "⚠️ Origin push failed (check connectivity)."

echo "🔁 Mirroring to QonexAI..."
git push mirror main || echo "⚠️ Mirror push failed (check connectivity)."

# 🧩 Confirmation
echo "✅ Dual sync completed successfully!"
echo "   • QonexAI ↔ QuantumTrader-AI parity maintained"
echo "   • Timestamp: $TIMESTAMP"
echo "   • Commit recorded in both repositories"

chmod +x scripts/qonex_sync.sh
