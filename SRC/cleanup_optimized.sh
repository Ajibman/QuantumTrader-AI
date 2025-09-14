 #!/bin/bash
# repo2_cleanup_merge_folders.sh
# Purpose: Cleanup repo2, verify files/folders, remove duplicates, and merge duplicate folders

REPO_DIR="repo2"
BACKUP_DIR="$REPO_DIR/_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "🔍 Starting comprehensive repo2 audit, cleanup, and folder merge..."

# -----------------------------
# 1. Misplaced commit messages
# -----------------------------
KEYWORDS=("feat(" "chore(" "fix(" "docs(" "refactor(" "test(" "perf(" "style(")
for file in $(find "$REPO_DIR" -type f -name "*.sh" -o -name "*.py" -o -name "*.md"); do
    for kw in "${KEYWORDS[@]}"; do
        if grep -q "$kw" "$file"; then
            echo "⚠️ Commit-like message found inside $file"
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
# 4. Duplicate files detection
# -----------------------------
echo "🔍 Checking for duplicate files..."
declare -A file_hash_map
for file in $(find "$REPO_DIR" -type f); do
    hash=$(sha256sum "$file" | awk '{print $1}')
    if [[ -n "${file_hash_map[$hash]}" ]]; then
        echo "⚠️ Duplicate detected: $file AND ${file_hash_map[$hash]}"
        mv "$file" "$BACKUP_DIR/"
        echo "   → Moved duplicate to backup."
    else
        file_hash_map[$hash]="$file"
    fi
done

# -----------------------------
# 5. Duplicate folders detection & merge
# -----------------------------
echo "🔍 Checking for duplicate folders..."
for folder1 in $(find "$REPO_DIR" -mindepth 1 -type d); do
    for folder2 in $(find "$REPO_DIR" -mindepth 1 -type d); do
        [[ "$folder1" == "$folder2" ]] && continue
        # Compare folder contents using checksums
        sum1=$(find "$folder1" -type f -exec sha256sum {} + | sha256sum | awk '{print $1}')
        sum2=$(find "$folder2" -type f -exec sha256sum {} + | sha256sum | awk '{print $1}')
        if [[ "$sum1" == "$sum2" ]]; then
            echo "⚠️ Duplicate folder detected: $folder1 AND $folder2"
            # Merge contents of folder2 into folder1
            mv "$folder2"/* "$folder1/" 2>/dev/null
            rmdir "$folder2" 2>/dev/null
            echo "   → Merged $folder2 into $folder1"
        fi
    done
done

echo "✅ Comprehensive repo2 cleanup and merge completed. Check $BACKUP_DIR for backups."
