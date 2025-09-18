 #!/bin/bash

# Backup directory
BACKUP_DIR="./backup"
mkdir -p $BACKUP_DIR

# Timestamp for backups
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# === BACKUP FUNCTION ===
backup() {
  cp index.html $BACKUP_DIR/index-$TIMESTAMP.html
  echo "Backup created: $BACKUP_DIR/index-$TIMESTAMP.html"
  git add $BACKUP_DIR/index-$TIMESTAMP.html
  git commit -m "backup: index.html at $TIMESTAMP"
  git push origin main
}

# === RESTORE FUNCTIONS (AUTO-COMMIT + PUSH) ===

# Restore latest backup
restore_latest() {
  LATEST_BACKUP=$(ls -t $BACKUP_DIR/index-*.html | head -n 1)
  if [ -n "$LATEST_BACKUP" ]; then
    cp "$LATEST_BACKUP" index.html
    echo "Restored from latest backup: $LATEST_BACKUP"
    git add index.html
    git commit -m "restore: index.html from $LATEST_BACKUP"
    git push origin main
  else
    echo "No backups found!"
  fi
}

# Restore a specific backup file
restore_specific() {
  if [ -f "$1" ]; then
    cp "$1" index.html
    echo "Restored from: $1"
    git add index.html
    git commit -m "restore: index.html from $1"
    git push origin main
  else
    echo "Backup file not found: $1"
  fi
}

# Restore by tag (backup timestamp)
restore_by_tag() {
  TAG=$1
  FILE="$BACKUP_DIR/index-${TAG#backup-}.html"
  if [ -f "$FILE" ]; then
    cp "$FILE" index.html
    echo "Restored from tag: $TAG ($FILE)"
    git add index.html
    git commit -m "restore: index.html from tag $TAG"
    git push origin main
  else
    echo "Backup for tag $TAG not found!"
  fi
}
