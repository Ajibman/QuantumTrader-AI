import android.os.Bundle
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity

class TraderLabActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // This flag must be set before setContentView
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_trader_lab)
    }
}

import android.os.Bundle
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        // Set secure flag BEFORE setContentView
        window.setFlags(
            WindowManager.LayoutParams.FLAG_SECURE,
            WindowManager.LayoutParams.FLAG_SECURE
        )
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}

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
