#!/bin/bash
# pre-merge.sh - Automatic staging and pre-merge preparation for QT AI

# Set working directory (repo root)
REPO_DIR="$(pwd)"

# Optional: safety prompt
echo "⚡ Pre-merge automation starting..."
read -p "Are you sure you want to stage all changes? (y/n): " CONFIRM

if [[ "$CONFIRM" != "y" ]]; then
  echo "Aborted by user."
  exit 0
fi

# Detect new or modified files
echo "Scanning for new or modified files..."
NEW_FILES=$(git ls-files --others --exclude-standard)
MODIFIED_FILES=$(git diff --name-only)

# Stage new files
if [[ ! -z "$NEW_FILES" ]]; then
  echo "Staging new files..."
  git add $NEW_FILES
else
  echo "No new files detected."
fi

# Stage modified files
if [[ ! -z "$MODIFIED_FILES" ]]; then
  echo "Staging modified files..."
  git add $MODIFIED_FILES
else
  echo "No modified files detected."
fi

# Summary
echo "✅ Files staged:"
git status -s

echo "Pre-merge staging complete. Ready to commit."

#!/bin/bash
# pre-merge.sh - automatic staging, logging, self-healing & rollback for QT AI

# 0️⃣ Define required project structure
REQUIRED_DIRS=("src" "assets" "backups")
REQUIRED_FILES=("index.html" "server.js" "README.md" "TEST_LOG.md")

# 1️⃣ Safety confirmation
echo "⚠️ Pre-merge safety check"
read -p "Are you sure you want to stage and merge? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
    echo "❌ Merge aborted."
    exit 1
fi

# 2️⃣ Ensure backups folder exists
mkdir -p backups

# 3️⃣ Self-healing: restore missing folders
for DIR in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$DIR" ]; then
        echo "🛠 Creating missing folder: $DIR"
        mkdir -p "$DIR"
        echo "# Placeholder for $DIR" > "$DIR/.keep"
        git add "$DIR/.keep"
    fi
done

# 4️⃣ Self-healing: restore missing files (with backup)
for FILE in "${REQUIRED_FILES[@]}"; do
    if [ -f "$FILE" ]; then
        # Backup existing file before overwriting
        cp "$FILE" "backups/${FILE}_$(date +%Y%m%d_%H%M%S).bak"
    fi

    if [ ! -f "$FILE" ]; then
        echo "🛠 Restoring missing file: $FILE"
        echo "<!-- Auto-generated placeholder for $FILE -->" > "$FILE"
        git add "$FILE"
    fi
done

# 5️⃣ Auto-stage new and modified files
echo "🟢 Auto-staging files..."
git add src/* assets/* index.html server.js README.md TEST_LOG.md || true

# 6️⃣ Commit changes with timestamped message
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto-staged, healed repo (with rollback backup) at $TIMESTAMP" || echo "ℹ️ No changes to commit."

# 7️⃣ Update TEST_LOG.md
LOGFILE="TEST_LOG.md"
echo -e "\n[$TIMESTAMP] Auto-staged, healed structure, committed changes, backups saved." >> $LOGFILE

# 8️⃣ Success message
echo "✅ Pre-merge complete. Repo healed, backups saved, TEST_LOG.md updated."

#!/bin/bash
# pre-merge.sh - automatic staging, logging & self-healing for QT AI

# 0️⃣ Define required project structure
REQUIRED_DIRS=("src" "assets")
REQUIRED_FILES=("index.html" "server.js" "README.md" "TEST_LOG.md")

# 1️⃣ Safety confirmation
echo "⚠️ Pre-merge safety check"
read -p "Are you sure you want to stage and merge? [y/N] " CONFIRM
if [[ "$CONFIRM" != "y" ]]; then
    echo "❌ Merge aborted."
    exit 1
fi

# 2️⃣ Self-healing: restore missing folders
for DIR in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$DIR" ]; then
        echo "🛠 Creating missing folder: $DIR"
        mkdir -p "$DIR"
        echo "# Placeholder for $DIR" > "$DIR/.keep"
        git add "$DIR/.keep"
    fi
done

# 3️⃣ Self-healing: restore missing files
for FILE in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$FILE" ]; then
        echo "🛠 Restoring missing file: $FILE"
        echo "<!-- Auto-generated placeholder for $FILE -->" > "$FILE"
        git add "$FILE"
    fi
done

# 4️⃣ Auto-stage new and modified files
echo "🟢 Auto-staging files..."
git add src/* assets/* index.html server.js README.md TEST_LOG.md || true

# 5️⃣ Commit changes with timestamped message
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Auto-staged & healed repo at $TIMESTAMP" || echo "ℹ️ No changes to commit."

# 6️⃣ Update TEST_LOG.md
LOGFILE="TEST_LOG.md"
echo -e "\n[$TIMESTAMP] Auto-staged, healed structure, and committed changes." >> $LOGFILE

# 7️⃣ Success message
echo "✅ Pre-merge process complete. Repo structure healed & TEST_LOG.md updated."

chmod +x pre-merge.sh

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
