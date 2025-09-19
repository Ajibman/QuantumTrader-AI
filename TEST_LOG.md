#!/bin/bash
echo "🔍 Running pre-merge checks..."

# Human-readable tag for this step
STEP_TAG="Step 3 rollout attempt"

# Step 1: Backup snapshot
BACKUP_DIR="./backup"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SNAPSHOT_DIR="$BACKUP_DIR/snapshot_$TIMESTAMP"

mkdir -p "$SNAPSHOT_DIR"

# Copy critical project files
cp index.html "$SNAPSHOT_DIR/"
cp server.js "$SNAPSHOT_DIR/" 2>/dev/null
cp -r assets "$SNAPSHOT_DIR/" 2>/dev/null
cp TEST_LOG.md "$SNAPSHOT_DIR/" 2>/dev/null

echo "🗂 Snapshot created at $SNAPSHOT_DIR"

# Step 2: Append snapshot log to TEST_LOG.md
echo -e "\n---" >> TEST_LOG.md
echo "📌 [$STEP_TAG]" >> TEST_LOG.md
echo "📅 Snapshot taken on: $TIMESTAMP" >> TEST_LOG.md
echo "📂 Backup stored at: $SNAPSHOT_DIR" >> TEST_LOG.md

# Step 3: Run tests
./log-test.sh
if [ $? -eq 0 ]; then
  echo "✅ Tests passed. Proceeding with merge..."
  echo "✅ Tests passed ✅" >> TEST_LOG.md
  echo "🔀 Merged branch 'step4-start' into 'main'" >> TEST_LOG.md
  echo "---" >> TEST_LOG.md
  git checkout main
  git merge step4-start
  git push origin main
else
  echo "❌ Tests failed. Merge aborted."
  echo "❌ Tests failed ❌" >> TEST_LOG.md
  echo "---" >> TEST_LOG.md
  exit 1
fi

## [2025-09-19] Talking Drum Integration

- Added Talking Drum (🪘) and Drum (🥁) emojis to the center of the horizontal "Y" symbol.  
- Symbolism:  
  - 🪘 (Gangan) → Ancient Yoruba Talking Drum, now universalized as Quantum Signal of QT AI.  
  - 🥁 (Drum) → Language & Culture, paired with 🪘 for balance.  
- Status: Display confirmed at standard emoji size.
