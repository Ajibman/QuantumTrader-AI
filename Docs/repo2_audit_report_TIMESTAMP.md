 #!/bin/bash
# repo2_cleanup_report_summary.sh
# Purpose: Audit, cleanup, merge, and generate a detailed report with summary for repo2

REPO_DIR="repo2"
BACKUP_DIR="$REPO_DIR/_backup_$(date +%Y%m%d_%H%M%S)"
REPORT_FILE="$REPO_DIR/docs/repo2_audit_report_$(date +%Y%m%d_%H%M%S).md"
mkdir -p "$BACKUP_DIR"
mkdir -p "$REPO_DIR/docs"

# Initialize counters
moved_files=0
removed_duplicates=0
merged_folders=0
misplaced_commit_msgs=0

echo "# Repo2 Audit Report" > "$REPORT_FILE"
echo "Audit performed at $(date)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# -----------------------------
# 1. Misplaced commit messages
# -----------------------------
KEYWORDS=("feat(" "chore(" "fix(" "docs(" "refactor(" "test(" "perf(" "style(")
for file in $(find "$REPO_DIR" -type f -name "*.sh" -o -name "*.py" -o -name "*.md"); do
    for kw in "${KEYWORDS[@]}"; do
        if grep -q "$kw" "$file"; then
            ((misplaced_commit_msgs++))
            cp "$file" "$BACKUP_DIR/"
            sed -i "/$kw/d" "$file"
        fi
    done
done

# -----------------------------
# 2. Folder structure check
# -----------------------------
DESIRED_FOLDERS=("scripts" "assets" "docs" "tests")
for folder in "${DESIRED_FOLDERS[@]}"; do
    [ ! -d "$REPO_DIR/$folder" ] && mkdir -p "$REPO_DIR/$folder"
done

# -----------------------------
# 3. Misplaced files check
# -----------------------------
for file in $(find "$REPO_DIR" -maxdepth 2 -type f); do
    case "$file" in
        *.sh)
            [[ "$file" != "$REPO_DIR/scripts/"* ]] && mv "$file" "$REPO_DIR/scripts/" && ((moved_files++)) ;;
        *.py)
            [[ "$file" != "$REPO_DIR/scripts/"* ]] && mv "$file" "$REPO_DIR/scripts/" && ((moved_files++)) ;;
        *.md)
            [[ "$file" != "$REPO_DIR/docs/"* ]] && mv "$file" "$REPO_DIR/docs/" && ((moved_files++)) ;;
    esac
done

# -----------------------------
# 4. Duplicate files detection
# -----------------------------
declare -A file_hash_map
for file in $(find "$REPO_DIR" -type f); do
    hash=$(sha256sum "$file" | awk '{print $1}')
    if [[ -n "${file_hash_map[$hash]}" ]]; then
        mv "$file" "$BACKUP_DIR/"
        ((removed_duplicates++))
    else
        file_hash_map[$hash]="$file"
    fi
done

# -----------------------------
# 5. Duplicate folders merge
# -----------------------------
for folder1 in $(find "$REPO_DIR" -mindepth 1 -type d); do
    for folder2 in $(find "$REPO_DIR" -mindepth 1 -type d); do
        [[ "$folder1" == "$folder2" ]] && continue
        sum1=$(find "$folder1" -type f -exec sha256sum {} + | sha256sum | awk '{print $1}')
        sum2=$(find "$folder2" -type f -exec sha256sum {} + | sha256sum | awk '{print $1}')
        if [[ "$sum1" == "$sum2" ]]; then
            mv "$folder2"/* "$folder1/" 2>/dev/null
            rmdir "$folder2" 2>/dev/null
            ((merged_folders++))
        fi
    done
done

# -----------------------------
# 6. Generate summary table
# -----------------------------
echo "## Summary Table" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| Category | Count |" >> "$REPORT_FILE"
echo "|----------|-------|" >> "$REPORT_FILE"
echo "| Misplaced commit messages removed | $misplaced_commit_msgs |" >> "$REPORT_FILE"
echo "| Misplaced files moved to proper folders | $moved_files |" >> "$REPORT_FILE"
echo "| Duplicate files removed and backed up | $removed_duplicates |" >> "$REPORT_FILE"
echo "| Duplicate folders merged | $merged_folders |" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# -----------------------------
# 7. End notes
# -----------------------------
echo "✅ Repo2 audit, cleanup, and merge completed." >> "$REPORT_FILE"
echo "📌 Backup folder: $BACKUP_DIR" >> "$REPORT_FILE"
echo "📌 Detailed audit report generated at: $REPORT_FILE" >> "$REPORT_FILE"
echo "⚠️ Human attention required to review report!" >> "$REPORT_FILE"

echo "💡 Audit complete. Report saved at $REPORT_FILE. Please review flagged items."
