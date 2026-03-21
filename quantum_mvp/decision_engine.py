from config import THRESHOLD_PRICE

def decide(market_data):
    price = market_data["price"]

    if price > THRESHOLD_PRICE:
        return {"action": "BUY", "price": price}
    elif price < THRESHOLD_PRICE * 0.98:
        return {"action": "SELL", "price": price}

    return {"action": "HOLD", "price": price}
