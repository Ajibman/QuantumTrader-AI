#!/bin/bash
# restore.sh - Rollback utility for QT AI repo
# Restores the most recent backup of a given file or all files

BACKUP_DIR="backups"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ No backups found. Nothing to restore."
    exit 1
fi

restore_file() {
    FILE=$1
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR/${FILE}"_* 2>/dev/null | head -n 1)

    if [ -z "$LATEST_BACKUP" ]; then
        echo "⚠️ No backup found for $FILE"
    else
        echo "🔄 Restoring $FILE from $LATEST_BACKUP"
        cp "$LATEST_BACKUP" "$FILE"
        git add "$FILE"
    fi
}

if [ $# -eq 0 ]; then
    echo "ℹ️ No file specified. Restoring all tracked files..."
    for BAK in $BACKUP_DIR/*; do
        BASEFILE=$(basename "$BAK" | cut -d_ -f1)
        restore_file "$BASEFILE"
    done
else
    for FILE in "$@"; do
        restore_file "$FILE"
    done
fi

# Commit the restoration
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "Rollback: restored backup(s) at $TIMESTAMP" || echo "ℹ️ No changes to commit."

echo "✅ Restore complete."
