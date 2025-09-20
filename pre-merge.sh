#!/bin/bash
# pre-merge.sh - Auto stage and log during merges

# Stage all changes
git add -A

# Append merge info to TEST_LOG.md
echo -e "\n[AutoMerge] $(date '+%Y-%m-%d %H:%M:%S') - Merge initiated" >> TEST_LOG.md

# Show staged changes (for sanity check)
git status --short

# Allow merge to continue
exit 0

#!/bin/bash
# pre-merge.sh
# Pre-merge helper to ensure essential files are staged automatically

set -e

echo "🔍 Running pre-merge checks..."

# Always include TEST_LOG.md in commits
if [ -f "TEST_LOG.md" ]; then
  git add TEST_LOG.md
  echo "✅ TEST_LOG.md staged."
else
  echo "⚠️ TEST_LOG.md not found, skipping."
fi

# Include server.js if exists
if [ -f "server.js" ]; then
  git add server.js
  echo "✅ server.js staged."
fi

# Include all assets if the folder exists
if [ -d "assets" ]; then
  git add assets/*
  echo "✅ assets staged."
fi

echo "Pre-merge checks complete. Ready for commit."
