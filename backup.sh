 #!/bin/bash

BACKUP_DIR="./backup"
TIMESTAMP=$(date +"%Y-%m-%d-%H%M%S")

mkdir -p "$BACKUP_DIR"

case "$1" in
  backup)
    cp index.html "$BACKUP_DIR/index-$TIMESTAMP.html"
    echo "✅ Backup created: $BACKUP_DIR/index-$TIMESTAMP.html"
    ;;
  restore)
    if [ -n "$2" ]; then
      cp "$BACKUP_DIR/$2" index.html
      echo "✅ Restored from $BACKUP_DIR/$2"
    else
      LATEST=$(ls -t $BACKUP_DIR/index-*.html | head -n 1)
      if [ -n "$LATEST" ]; then
        cp "$LATEST" index.html
        echo "✅ Restored latest backup: $LATEST"
      else
        echo "⚠️ No backups found in $BACKUP_DIR"
      fi
    fi
    ;;
  *)
    echo "Usage: ./backup.sh {backup|restore [filename]}"
    ;;
esac
