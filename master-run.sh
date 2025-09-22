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
