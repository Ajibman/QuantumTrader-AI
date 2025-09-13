from flask import Flask, jsonify
import os
import threading
import time
import glob
from datetime import datetime

app = Flask(__name__)

EXPORT_DIR = 'exports'
LOG_FILE = 'dashboard_logs.json'
MAX_DAYS = 90

# Track last operations
status = {
    'last_export': None,
    'last_cleanup': None,
    'threads_running': []
}

def export_logs():
    while True:
        if os.path.exists(LOG_FILE):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            # JSON and CSV export logic here (same as backend controller)
            status['last_export'] = timestamp
        time.sleep(43200)

def cleanup_old_exports():
    while True:
        now = time.time()
        for filepath in glob.glob(os.path.join(EXPORT_DIR, '*')):
            if os.stat(filepath).st_mtime < now - MAX_DAYS * 86400:
                os.remove(filepath)
        status['last_cleanup'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        time.sleep(86400)

# Start daemon threads
threads = [
    threading.Thread(target=export_logs, daemon=True, name='ExportThread'),
    threading.Thread(target=cleanup_old_exports, daemon=True, name='CleanupThread')
]
for t in threads:
    t.start()
    status['threads_running'].append(t.name)

# Backend-only monitoring endpoint
@app.route('/backend_status')
def backend_status():
    return jsonify({
        'last_export': status['last_export'],
        'last_cleanup': status['last_cleanup'],
        'threads_running': status['threads_running'],
        'total_exports': len(os.listdir(EXPORT_DIR)) if os.path.exists(EXPORT_DIR) else 0
    })

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=False)  # Localhost only
