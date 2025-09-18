 #!/bin/bash

BACKUP_DIR="backup"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y-%m-%d-%H%M%S")
BACKUP_FILE="$BACKUP_DIR/index-$TIMESTAMP.html"

backup_index() {
  cp index.html "$BACKUP_FILE"
  echo "Backup created: $BACKUP_FILE"
  git add "$BACKUP_FILE"
  git commit -m "backup: index.html at $TIMESTAMP"
  git tag "backup-$TIMESTAMP"
  git push origin main --tags
}

restore_latest() {
  LATEST_BACKUP=$(ls -t $BACKUP_DIR/index-*.html | head -n 1)
  if [ -n "$LATEST_BACKUP" ]; then
    cp "$LATEST_BACKUP" index.html
    echo "Restored from latest backup: $LATEST_BACKUP"
  else
    echo "No backups found!"
  fi
}

restore_specific() {
  if [ -f "$1" ]; then
    cp "$1" index.html
    echo "Restored from: $1"
  else
    echo "Backup file not found: $1"
  fi
}

restore_by_tag() {
  TAG=$1
  FILE="$BACKUP_DIR/index-${TAG#backup-}.html"
  if [ -f "$FILE" ]; then
    cp "$FILE" index.html
    echo "Restored from tag: $TAG ($FILE)"
  else
    echo "Backup for tag $TAG not found!"
  fi
}

list_backups() {
  echo "Available backups:"
  ls -t $BACKUP_DIR/index-*.html 2>/dev/null
  echo ""
  echo "Available tags:"
  git tag -l "backup-*"
}

case "$1" in
  backup) backup_index ;;
  restore) [ -z "$2" ] && restore_latest || restore_specific "$2" ;;
  restore-tag) restore_by_tag "$2" ;;
  list) list_backups ;;
  *) echo "Usage: $0 {backup|restore [file]|restore-tag <tag>|list}" ;;
esac
