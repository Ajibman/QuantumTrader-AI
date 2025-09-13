from flask import Flask, jsonify
from master_generator import self_structure, CCLM
import random

app = Flask(__name__)
cclm = CCLM()

# Simulated peace index
def get_peace_index():
    # Example: random float 0–100 for demo
    return round(random.uniform(70, 100), 2)

# Simulated Module 12 events
def get_simulation_events():
    return [
        {"event": "Market flux detected", "impact": random.randint(1,5)},
        {"event": "High-risk alert", "impact": random.randint(1,5)},
        {"event": "Module sync completed", "impact": random.randint(1,5)},
    ]

@app.route('/dashboard_data')
def dashboard_data():
    cclm_mode = cclm.current_mode()
    return jsonify({
        "cclm_mode": cclm_mode,
        "peace_index": get_peace_index(),
        "simulation_events": get_simulation_events(),
        "self_structure": self_structure()
    })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)

from flask import Flask, jsonify
from master_generator import self_structure, CCLM
import random, json, os, datetime

app = Flask(__name__)
cclm = CCLM()

LOG_FILE = 'logs/dashboard_log.jsonl'
os.makedirs('logs', exist_ok=True)  # Ensure logs directory exists

# Simulated peace index
def get_peace_index():
    return round(random.uniform(70, 100), 2)

# Simulated Module 12 events
def get_simulation_events():
    return [
        {"event": "Market flux detected", "impact": random.randint(1,5)},
        {"event": "High-risk alert", "impact": random.randint(1,5)},
        {"event": "Module sync completed", "impact": random.randint(1,5)},
    ]

def log_dashboard_snapshot(data):
    """Append snapshot to log file in JSON Lines format"""
    timestamp = datetime.datetime.utcnow().isoformat()
    snapshot = {"timestamp": timestamp, **data}
    with open(LOG_FILE, 'a') as f:
        f.write(json.dumps(snapshot) + '\n')

@app.route('/dashboard_data')
def dashboard_data():
    cclm_mode = cclm.current_mode()
    data = {
        "cclm_mode": cclm_mode,
        "peace_index": get_peace_index(),
        "simulation_events": get_simulation_events(),
        "self_structure": self_structure()
    }
    # Log snapshot
    log_dashboard_snapshot(data)
    return jsonify(data)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)

@app.route('/dashboard_logs')
def dashboard_logs():
    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r') as f:
            for line in f:
                logs.append(json.loads(line))
    return jsonify(logs)

import threading
import time
import json
import csv
from datetime import datetime
import os

EXPORT_DIR = 'exports'
if not os.path.exists(EXPORT_DIR):
    os.makedirs(EXPORT_DIR)

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

        time.sleep(43200)  # every 12 hours
