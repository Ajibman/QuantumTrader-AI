#!/bin/bash
# pre-merge.sh
# Pre-merge helper with automatic TEST_LOG.md recording

set -e

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOGFILE="TEST_LOG.md"

echo "🔍 Running pre-merge checks at $TIMESTAMP..."

log() {
  echo "[$TIMESTAMP] $1" >> "$LOGFILE"
}

# Always include TEST_LOG.md in commits
if [ -f "$LOGFILE" ]; then
  git add "$LOGFILE"
  log "TEST_LOG.md staged."
else
  echo "⚠️ $LOGFILE not found, skipping."
fi

# Include server.js if exists
if [ -f "server.js" ]; then
  git add server.js
  log "server.js staged."
fi

# Include all assets if the folder exists
if [ -d "assets" ]; then
  git add assets/*
  log "All assets staged."
fi

log "Pre-merge checks complete. Ready for commit."
echo "✅ Pre-merge checks logged in $LOGFILE."

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
