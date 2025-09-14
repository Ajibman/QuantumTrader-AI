#!/bin/bash
# repo2_cleanup_report.sh
# Purpose: Audit, cleanup, merge, and generate report for repo2

REPO_DIR="repo2"
BACKUP_DIR="$REPO_DIR/_backup_$(date +%Y%m%d_%H%M%S)"
REPORT_FILE="$REPO_DIR/docs/repo2_audit_report_$(date +%Y%m%d_%H%M%S).md"
mkdir -p "$BACKUP_DIR"
mkdir -p "$REPO_DIR/docs"

echo "# Repo2 Audit Report" > "$REPORT_FILE"
echo "Audit performed at $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

echo "🔍 Starting repo2 audit & cleanup..."

# -----------------------------
# 1. Misplaced commit messages
# -----------------------------
echo "## Misplaced Commit Messages" >> "$REPORT_FILE"
KEYWORDS=("feat(" "chore(" "fix(" "docs(" "refactor(" "test(" "perf(" "style(")
for file in $(find "$REPO_DIR" -type f -name "*.sh" -o -name "*.py" -o -name "*.md"); do
    for kw in "${KEYWORDS[@]}"; do
        if grep -q "$kw" "$file"; then
            echo "⚠️ $file contains commit-like message '$kw'" | tee -a "$REPORT_FILE"
            cp "$file" "$BACKUP_DIR/"
            sed -i "/$kw/d" "$file"
            echo "   → Removed from $file and backed up" >> "$REPORT_FILE"
        fi
    done
done
echo "" >> "$REPORT_FILE"

# -----------------------------
# 2. Folder structure
# -----------------------------
echo "## Folder Structure Check" >> "$REPORT_FILE"
DESIRED_FOLDERS=("scripts" "assets" "docs" "tests")
for folder in "${DESIRED_FOLDERS[@]}"; do
    if [ ! -d "$REPO_DIR/$folder" ]; then
        echo "⚠️ Missing folder: $folder → creating..." | tee -a "$REPORT_FILE"
        mkdir -p "$REPO_DIR/$folder"
    else
        echo "✅ Folder exists: $folder" >> "$REPORT_FILE"
    fi
done
echo "" >> "$REPORT_FILE"

# -----------------------------
# 3. Misplaced files
# -----------------------------
echo "## Misplaced Files" >> "$REPORT_FILE"
for file in $(find "$REPO_DIR" -maxdepth 2 -type f); do
    case "$file" in
        *.sh)
            [[ "$file" != "$REPO_DIR/scripts/"* ]] && mv "$file" "$REPO_DIR/scripts/" && echo "✅ Moved $file to scripts/" | tee -a "$REPORT_FILE" ;;
        *.py)
            [[ "$file" != "$REPO_DIR/scripts/"* ]] && mv "$file" "$REPO_DIR/scripts/" && echo "✅ Moved $file to scripts/" | tee -a "$REPORT_FILE" ;;
        *.md)
            [[ "$file" != "$REPO_DIR/docs/"* ]] && mv "$file" "$REPO_DIR/docs/" && echo "✅ Moved $file to docs/" | tee -a "$REPORT_FILE" ;;
    esac
done
echo "" >> "$REPORT_FILE"

# -----------------------------
# 4. Duplicate files
# -----------------------------
echo "## Duplicate Files" >> "$REPORT_FILE"
declare -A file_hash_map
for file in $(find "$REPO_DIR" -type f); do
    hash=$(sha256sum "$file" | awk '{print $1}')
    if [[ -n "${file_hash_map[$hash]}" ]]; then
        echo "⚠️ Duplicate detected: $file AND ${file_hash_map[$hash]}" | tee -a "$REPORT_FILE"
        mv "$file" "$BACKUP_DIR/"
        echo "   → Moved duplicate to backup" >> "$REPORT_FILE"
    else
        file_hash_map[$hash]="$file"
    fi
done
echo "" >> "$REPORT_FILE"

# -----------------------------
# 5. Duplicate folders merge
# -----------------------------
echo "## Duplicate Folders Merge" >> "$REPORT_FILE"
for folder1 in $(find "$REPO_DIR" -mindepth 1 -type d); do
    for folder2 in $(find "$REPO_DIR" -mindepth 1 -type d); do
        [[ "$folder1" == "$folder2" ]] && continue
        sum1=$(find "$folder1" -type f -exec sha256sum {} + | sha256sum | awk '{print $1}')
        sum2=$(find "$folder2" -type f -exec sha256sum {} + | sha256sum | awk '{print $1}')
        if [[ "$sum1" == "$sum2" ]]; then
            echo "⚠️ Duplicate folder detected: $folder1 AND $folder2" | tee -a "$REPORT_FILE"
            mv "$folder2"/* "$folder1/" 2>/dev/null
            rmdir "$folder2" 2>/dev/null
            echo "   → Merged $folder2 into $folder1" >> "$REPORT_FILE"
        fi
    done
done
echo "" >> "$REPORT_FILE"

# -----------------------------
# 6. Finish
# -----------------------------
echo "✅ Repo2 audit, cleanup, and merge completed." | tee -a "$REPORT_FILE"
echo "" | tee -a "$REPORT_FILE"
echo "📌 Backup folder: $BACKUP_DIR" | tee -a "$REPORT_FILE"
echo "📌 Detailed audit report generated at: $REPORT_FILE" | tee -a "$REPORT_FILE"
echo "⚠️ Human attention required to review report!" | tee -a "$REPORT_FILE"
