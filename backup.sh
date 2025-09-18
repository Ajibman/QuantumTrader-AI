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
