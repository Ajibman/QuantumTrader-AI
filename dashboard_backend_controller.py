import threading
import time
import json
import csv
import os
import glob
from datetime import datetime

# -------------------
# Configuration
# -------------------
LOG_FILE = 'dashboard_logs.json'  # Path to live dashboard logs
EXPORT_DIR = 'exports'
EXPORT_INTERVAL = 43200  # 12 hours
CLEANUP_INTERVAL = 86400  # 1 day
MAX_DAYS = 90  # Retention period

# Ensure export directory exists
if not os.path.exists(EXPORT_DIR):
    os.makedirs(EXPORT_DIR)

# -------------------
# Functions
# -------------------

def export_logs():
    while True:
        if os.path.exists(LOG_FILE):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # JSON export
            with open(LOG_FILE, 'r') as f:
                logs = [json.loads(line) for line in f]
            json_path = os.path.join(EXPORT_DIR, f'dashboard_logs_{timestamp}.json')
            with open(json_path, 'w') as f:
                json.dump(logs, f, indent=2)

            # CSV export
            if logs:
                headers = logs[0].keys()
                csv_path = os.path.join(EXPORT_DIR, f'dashboard_logs_{timestamp}.csv')
                with open(csv_path, 'w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow(headers)
                    for log in logs:
                        row = [json.dumps(log[h]) if isinstance(log[h], (list, dict)) else log[h] for h in headers]
                        writer.writerow(row)

        time.sleep(EXPORT_INTERVAL)

def cleanup_old_exports():
    while True:
        now = time.time()
        for filepath in glob.glob(os.path.join(EXPORT_DIR, '*')):
            if os.stat(filepath).st_mtime < now - MAX_DAYS * 86400:
                os.remove(filepath)
                print(f"Deleted old export: {filepath}")
        time.sleep(CLEANUP_INTERVAL)

def start_backend_controller():
    threading.Thread(target=export_logs, daemon=True).start()
    threading.Thread(target=cleanup_old_exports, daemon=True).start()
    print("QT AI Dashboard Backend Controller is running...")

# -------------------
# Start Controller
# -------------------
if __name__ == '__main__':
    start_backend_controller()
    while True:
        time.sleep(1)  # Keep main thread alive
