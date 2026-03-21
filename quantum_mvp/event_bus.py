import redis
import json
from config import REDIS_HOST, REDIS_PORT

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

CHANNEL = "market"

def publish(data):
    r.publish(CHANNEL, json.dumps(data))

def subscribe():
    pubsub = r.pubsub()
    pubsub.subscribe(CHANNEL)
    for message in pubsub.listen():
        if message["type"] == "message":
            yield json.loads(message["data"])
