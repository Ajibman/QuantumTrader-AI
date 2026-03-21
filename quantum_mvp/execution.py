import time

def execute(order):
    start = time.time()

    # Simulated execution
    print(f"[EXECUTE] {order['action']} at {order['price']}")

    latency = (time.time() - start) * 1000
    print(f"[LATENCY] Execution took {latency:.3f} ms")
