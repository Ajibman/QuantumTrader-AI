#!/bin/bash
# repo2_cleanup_optimized.sh
# Purpose: Verify repo2 for misplaced commit messages, folder structure, misplaced files, duplicates, and safely merge

REPO_DIR="repo2"
BACKUP_DIR="$REPO_DIR/_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🔍 Starting comprehensive repo2 audit & cleanup..."

# -----------------------------
# 1. Misplaced commit messages
# -----------------------------
KEYWORDS=("feat(" "chore(" "fix(" "docs(" "refactor(" "test(" "perf(" "style(")
for file in $(find "$REPO_DIR" -type f -name "*.sh" -o -name "*.py" -o -name "*.md"); do
    for kw in "${KEYWORDS[@]}"; do
        if grep -q "$kw" "$file"; then
            echo "⚠️ Commit-like message found inside $file"
            # Optional: backup & remove
            cp "$file" "$BACKUP_DIR/"
            sed -i "/$kw/d" "$file"
            echo "   → Removed from $file and backed up."
        fi
    done
done

# -----------------------------
# 2. Folder structure check
# -----------------------------
DESIRED_FOLDERS=("scripts" "assets" "docs" "tests")
for folder in "${DESIRED_FOLDERS[@]}"; do
    if [ ! -d "$REPO_DIR/$folder" ]; then
        echo "⚠️ Missing folder: $folder → creating..."
        mkdir -p "$REPO_DIR/$folder"
    fi
done

# -----------------------------
# 3. Misplaced files check
# -----------------------------
for file in $(find "$REPO_DIR" -maxdepth 2 -type f); do
    case "$file" in
        *.sh)
            [[ "$file" != "$REPO_DIR/scripts/"* ]] && mv "$file" "$REPO_DIR/scripts/" && echo "✅ Moved $file to scripts/" ;;
        *.py)
            [[ "$file" != "$REPO_DIR/scripts/"* ]] && mv "$file" "$REPO_DIR/scripts/" && echo "✅ Moved $file to scripts/" ;;
        *.md)
            [[ "$file" != "$REPO_DIR/docs/"* ]] && mv "$file" "$REPO_DIR/docs/" && echo "✅ Moved $file to docs/" ;;
    esac
done

# -----------------------------
# 4. Duplicate files detection & merge
# -----------------------------
echo "🔍 Checking for duplicate files..."
declare -A file_hash_map
for file in $(find "$REPO_DIR" -type f); do
    hash=$(sha256sum "$file" | awk '{print $1}')
    if [[ -n "${file_hash_map[$hash]}" ]]; then
        echo "⚠️ Duplicate detected: $file AND ${file_hash_map[$hash]}"
        # Backup duplicate
        mv "$file" "$BACKUP_DIR/"
        echo "   → Moved duplicate to backup."
    else
        file_hash_map[$hash]="$file"
    fi
done

echo "✅ Comprehensive audit & cleanup completed. Check $BACKUP_DIR for backups."
