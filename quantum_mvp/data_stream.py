import asyncio
import websockets
import json
from config import WS_URL
from event_bus import publish

async def stream():
    async with websockets.connect(WS_URL) as ws:
        while True:
            msg = await ws.recv()
            data = json.loads(msg)

            market_data = {
                "price": float(data["p"]),
                "timestamp": data["T"]
            }

            publish(market_data)

if __name__ == "__main__":
    asyncio.run(stream())
