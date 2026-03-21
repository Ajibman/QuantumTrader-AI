import threading
from event_bus import subscribe
from decision_engine import decide
from execution import execute

def run_engine():
    for market_data in subscribe():
        decision = decide(market_data)

        if decision["action"] != "HOLD":
            execute(decision)

if __name__ == "__main__":
    print("Starting QuantumTrader-AI MVP...")
    run_engine()
