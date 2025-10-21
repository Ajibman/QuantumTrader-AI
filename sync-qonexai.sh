 #!/bin/bash
# ===========================================================
#  QonexAI <-> QuantumTrader-AI Bidirectional Sync Script
#  Author: Olagoke Ajibulu
#  Purpose: Keep both repositories in sync automatically
#  Triggered by GitHub Actions every 30 minutes or on demand
# ===========================================================

set -e  # stop on error
set -u  # treat unset vars as errors

# Repo setup
MAIN_REPO="https://github.com/ajibman/QuantumTrader-AI.git"
CHILD_REPO="https://github.com/ajibman/QonexAI.git"

# Temporary workspace
WORKDIR=$(mktemp -d)
echo "🔧 Created temp workspace at $WORKDIR"

# Clone both repositories
echo "⬇️ Cloning QuantumTrader-AI..."
git clone --quiet "$MAIN_REPO" "$WORKDIR/QuantumTrader-AI"
echo "⬇️ Cloning QonexAI..."
git clone --quiet "$CHILD_REPO" "$WORKDIR/QonexAI"

# Navigate to main repo
cd "$WORKDIR/QuantumTrader-AI"

# Sync from QuantumTrader-AI → QonexAI
echo "🔁 Syncing changes from QuantumTrader-AI → QonexAI..."
rsync -av --exclude='.git' "$WORKDIR/QuantumTrader-AI/" "$WORKDIR/QonexAI/"

# Commit & push to QonexAI if changes exist
cd "$WORKDIR/QonexAI"
if [ -n "$(git status --porcelain)" ]; then
  git config user.name "github-actions[bot]"
  git config user.email "github-actions[bot]@users.noreply.github.com"
  git add .
  git commit -m "🔄 Auto-sync from QuantumTrader-AI → QonexAI [$(date '+%Y-%m-%d %H:%M:%S')]"
  git push "https://${GH_TOKEN}@github.com/ajibman/QonexAI.git" main
  echo "✅ QonexAI updated successfully!"
else
  echo "⚪ No new changes detected to sync."
fi

# Cleanup
rm -rf "$WORKDIR"
echo "🧹 Workspace cleaned. Sync completed."
