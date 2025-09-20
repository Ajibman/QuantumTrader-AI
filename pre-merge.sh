#!/bin/bash
# pre-merge.sh - automatic staging & logging for QT AI

# 1️⃣ Safety confirmation
echo "⚠️ Pre-merge safety check"
read -p "Are you sure you want to stage and merge? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
    echo "Merge aborted."
    exit 1
fi

# 2️⃣ Auto-stage new and modified files
echo "🟢 Auto-staging files..."
git add src/* assets/* index.html server.js || true

# 3️⃣ Commit changes with timestamped message
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto-staged changes at $TIMESTAMP" || echo "No changes to commit."

# 4️⃣ Update TEST_LOG.md
LOGFILE="TEST_LOG.md"
echo -e "\n[$TIMESTAMP] Auto-staged and committed changes." >> $LOGFILE

# 5️⃣ Success message
echo "✅ Pre-merge process complete. TEST_LOG.md updated."

chmod +x pre-merge.sh

#!/bin/bash
# pre-merge.sh - Backup, log, test, and merge script

echo "🔍 Running pre-merge checks..."

# Step 1: Backup snapshot
BACKUP_DIR="./backup"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
SNAPSHOT_DIR="$BACKUP_DIR/snapshot_$TIMESTAMP"

mkdir -p "$SNAPSHOT_DIR"

# Copy main files into snapshot
cp index.html "$SNAPSHOT_DIR/"
cp server.js "$SNAPSHOT_DIR/" 2>/dev/null
cp -r assets "$SNAPSHOT_DIR/" 2>/dev/null
cp TEST_LOG.md "$SNAPSHOT_DIR/" 2>/dev/null

echo "🗂 Snapshot created at $SNAPSHOT_DIR"

# Step 2: Update log
echo -e "\n---" >> TEST_LOG.md
echo "📅 Snapshot: $TIMESTAMP" >> TEST_LOG.md
echo "📂 Backup at: $SNAPSHOT_DIR" >> TEST_LOG.md

# Step 3: Run tests
./log-test.sh
if [ $? -eq 0 ]; then
  echo "✅ Tests passed. Ready to merge..."
  echo "✅ Tests passed ✅" >> TEST_LOG.md
else
  echo "❌ Tests failed. Merge aborted."
  echo "❌ Tests failed ❌" >> TEST_LOG.md
  exit 1
fi
