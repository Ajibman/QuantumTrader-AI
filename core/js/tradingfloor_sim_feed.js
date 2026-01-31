// TradingFloor Simulation Feed — App-ready
class TradingFloorFeed {
  constructor() {
    this.interval = null;
    this.subscribers = [];
  }

  start(timing = { value: 5, unit: "seconds" }) {
    if (this.interval) return;

    const ms = this._toMilliseconds(timing.value, timing.unit);

    this.interval = setInterval(() => {
      const tick = this.generateTick();
      this.notify(tick);
    }, ms);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  subscribe(fn) {
    if (typeof fn === "function") this.subscribers.push(fn);
  }

  notify(tick) {
    this.subscribers.forEach(fn => fn(tick));
  }

  generateTick() {
    return {
      timestamp: new Date().toISOString(),
      price: +(Math.random() * 100 + 1000).toFixed(2),
      volume: +(Math.random() * 10).toFixed(3),
      trend: Math.random() > 0.5 ? "up" : "down"
    };
  }

  _toMilliseconds(value, unit) {
    const map = { seconds: 1000, minutes: 60_000 };
    return map[unit] ? value * map[unit] : 5000;
  }
}

export const tradingFloorFeed = new TradingFloorFeed();
