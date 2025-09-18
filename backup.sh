 #!/bin/bash
# Backup and Restore script for index.html

cd "$(dirname "$0")"

mkdir -p backups

if [ "$1" == "backup" ]; then
  # Backup current index.html
  cp index.html "backups/index-$(date +%Y-%m-%d-%H%M%S).html"
  git add backups/
  git commit -m "chore: backup index.html on $(date +%Y-%m-%d %H:%M:%S)"
  git push origin main
  echo "✅ Backup completed."

elif [ "$1" == "restore" ]; then
  if [ -z "$2" ]; then
    echo "⚠️ Please specify which backup file to restore."
    echo "Available backups:"
    ls backups/
    exit 1
  fi

  cp "backups/$2" index.html
  git add index.html
  git commit -m "chore: restore index.html from $2"
  git push origin main
  echo "✅ Restored index.html from $2"

else
  echo "Usage:"
  echo "./backup.sh backup        # create a new backup"
  echo "./backup.sh restore FILE  # restore index.html from a backup"
fi
