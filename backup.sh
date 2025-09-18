#!/bin/bash
# Backup script for index.html

# Make sure we are inside the repo
cd "$(dirname "$0")"

# Ensure backups folder exists
mkdir -p backups

# Copy index.html with today's date
cp index.html "backups/index-$(date +%Y-%m-%d).html"

# Stage the backup
git add backups/

# Commit with a clear message
git commit -m "chore: backup index.html on $(date +%Y-%m-%d)"

# Push to GitHub
git push origin main
