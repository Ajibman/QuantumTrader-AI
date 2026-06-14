 // TradingFloor Simulation Feed — Rebuilt Core Version

class TradingFloorFeed {
  constructor() {
    this.intervalId = null;
    this.subscribers = new Set();
    this.running = false;
  }

  /**
   * Start feed loop
   */
  start(timing = { value: 5, unit: "s" }) {
    if (this.running) return;

    const ms = this._toMilliseconds(timing);

    this.running = true;

    this.intervalId = setInterval(() => {
      const tick = this._generateTick();
      this._emit(tick);
    }, ms);
  }

  /**
   * Stop feed loop
   */
  stop() {
    this.running = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Subscribe to tick stream
   * returns unsubscribe function
   */
  subscribe(fn) {
    if (typeof fn !== "function") return;

    this.subscribers.add(fn);

    return () => this.subscribers.delete(fn);
  }

  /**
   * Emit tick to all subscribers safely
   */
  _emit(tick) {
    for (const fn of this.subscribers) {
      try {
        fn(tick);
      } catch (err) {
        console.error("[TradingFloorFeed Error]", err);
      }
    }
  }

  /**
   * Tick generator (simulation engine)
   */
  _generateTick() {
    const basePrice = 1000;

    return {
      timestamp: new Date().toISOString(),
      price: +(basePrice + (Math.random() - 0.5) * 20).toFixed(2),
      volume: Math.floor(Math.random() * 1000),
      direction: Math.random() > 0.5 ? "up" : "down"
    };
  }

  /**
   * Normalize timing input
   */
  _toMilliseconds(timing) {
    const value = timing?.value ?? 5;
    const unit = timing?.unit ?? "s";

    const map = {
      ms: 1,
      s: 1000,
      m: 60_000
    };

    return value * (map[unit] || 5000);
  }
}

export const tradingFloorFeed = new TradingFloorFeed();
