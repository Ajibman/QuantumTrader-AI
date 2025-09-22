#!/bin/bash
# master-run.sh - main startup script for QuantumTrader-AI

# Exit immediately on error
set -e

echo ">>> QuantumTrader-AI Master Run Starting..."

# Step 1: Rotate logs and visitor stats (safe monthly rotation)
if [ -f "./rotate.sh" ]; then
  echo ">>> Running rotation script..."
  bash ./rotate.sh
else
  echo ">>> rotate.sh not found. Skipping rotation..."
fi

# Step 2: Start server.js with nodemon
if command -v nodemon >/dev/null 2>&1; then
  echo ">>> Starting server with nodemon..."
  nodemon server.js
else
  echo ">>> Starting server with node..."
  node server.js
fi

#!/bin/bash
# master-run.sh - QuantumTrader-AI master script

# Auto-commit, log visitor stats, and push changes

# Set variables
REPO_DIR="/path/to/QuantumTrader-AI"  # <- Update with your local repo path
LOG_FILE="$REPO_DIR/logs/app.log"
VISITOR_STATS="$REPO_DIR/visitor-stats.json"
COMMIT_MESSAGE="Auto-update: $(date +'%Y-%m-%d %H:%M:%S')"
BRANCH="main"  # change if your branch name is different

# 1. Navigate to repo
cd "$REPO_DIR" || { echo "Repo not found! Exiting..."; exit 1; }

# 2. Pull latest changes
git pull origin "$BRANCH" --quiet

# 3. Update visitor stats (simulate refresh)
if [ -f "$VISITOR_STATS" ]; then
    VISITS=$(jq '.visits += 1' "$VISITOR_STATS")
    echo "$VISITS" > "$VISITOR_STATS"
else
    echo '{"visits": 1}' > "$VISITOR_STATS"
fi

# 4. Append visit count to app.log silently
echo "$(date +'%Y-%m-%d %H:%M:%S') - Visitor count updated" >> "$LOG_FILE"

# 5. Stage all changes
git add .

# 6. Auto-commit with message
git commit -m "$COMMIT_MESSAGE" --quiet

# 7. Push to remote (will use HTTPS or SSH based on config)
git push origin "$BRANCH" --quiet

# 8. Log server restart event if needed
echo "$(date +'%Y-%m-%d %H:%M:%S') - Master-run.sh executed" >> "$LOG_FILE"

# 9. Optional: Cleanup logs older than 30 days
find "$REPO_DIR/logs" -type f -name "*.log" -mtime +30 -exec rm {} \;

# 10. Finished
echo "Master-run.sh executed successfully at $(date +'%Y-%m-%d %H:%M:%S')"

#!/bin/bash
# master-run.sh - updates stats, logs, reminders

# 1. Update visitor stats & logs (existing logic)
# e.g., node update-stats.js or any other logic you have

# 2. Append automatic log entries
echo "$(date '+%Y-%m-%d %H:%M:%S') - Auto update completed." >> ./logs/app.log

# 3. Commit and push updated logs/statistics to GitHub
cd /path/to/QuantumTrader-AI

git add logs/app.log logs/visitor-stats.json logs/reminders.log
git commit -m "chore: auto-update logs & visitor stats $(date '+%Y-%m-%d %H:%M:%S')"
git push origin main

0 * * * * /path/to/QuantumTrader-AI/scripts/master-run.sh

/path/to/QuantumTrader-AI/scripts/master-run.shcrontab -e

# Add the line:
0 * * * * /path/to/QuantumTrader-AI/scripts/master-run.shchmod +x scripts/master-run.sh

#!/bin/bash
# master-run.sh - Central automation script for QuantumTrader-AI
# Author: Olagoke Ajibulu
# Date: 2025-09-21
# Purpose: Auto-update, visitor stats logging, reminders, and scheduled tasks.

# ==== CONFIGURATION ====
ROOT_DIR="$(dirname "$0")/.."          # Adjust if script is placed inside /scripts
LOG_DIR="$ROOT_DIR/logs"
ASSETS_DIR="$ROOT_DIR/Assets"
VISITOR_STATS="$LOG_DIR/visitor-stats.json"
APP_LOG="$LOG_DIR/app.log"
REMINDERS_LOG="$LOG_DIR/reminders.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# ==== HELPER FUNCTIONS ====

# Append timestamped message to log
log() {
    local msg="$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') : $msg" >> "$APP_LOG"
}

# Update visitor stats
update_visitor_stats() {
    if [ ! -f "$VISITOR_STATS" ]; then
        echo '{"totalVisits":0}' > "$VISITOR_STATS"
    fi
    totalVisits=$(jq '.totalVisits' "$VISITOR_STATS")
    totalVisits=$((totalVisits + 1))
    jq --argjson count "$totalVisits" '.totalVisits=$count' "$VISITOR_STATS" > tmp.json && mv tmp.json "$VISITOR_STATS"
    log "Visitor stats updated. Total visits: $totalVisits"
}

# Append reminders quietly
update_reminders() {
    if [ ! -f "$REMINDERS_LOG" ]; then
        touch "$REMINDERS_LOG"
    fi
    echo "$(date '+%Y-%m-%d %H:%M:%S') : Reminder check completed" >> "$REMINDERS_LOG"
}

# ==== MAIN EXECUTION ====
log "=== master-run.sh started ==="
update_visitor_stats
update_reminders
log "=== master-run.sh finished ==="
