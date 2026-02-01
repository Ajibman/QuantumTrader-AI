 // core/js/simulation/simulation_feed.js

class SimulationFeed {
  constructor() {
    this.interval = null;
    this.subscribers = [];
    this.price = 30000;       // starting price
    this.trend = 1;           // 1 = up, -1 = down
  }

  /**
   * Start the feed
   * @param {object} timing - { value, unit, label }
   * @param {function} onTick - callback for each tick
   */
  start(timing, onTick) {
    if (this.interval) return;

    const intervalMs = this.resolveTiming(timing);

    this.interval = setInterval(() => {
      // Small random trend shifts
      if (Math.random() > 0.97) this.trend *= -1;

      // Price moves in trend direction
      this.price += this.trend * (Math.random() * 15);

      const tick = {
        timestamp: new Date().toISOString(),
        price: Number(this.price.toFixed(2)),
        volume: +(Math.random() * 5).toFixed(3),
        trend: this.trend === 1 ? "up" : "down"
      };

      // Direct callback
      if (onTick) onTick(tick);

      // Notify all subscribers (e.g., CPilotEngine, Monitor)
      this.notify(tick);

    }, intervalMs);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  subscribe(fn) {
    if (typeof fn === "function") {
      this.subscribers.push(fn);
    }
  }

  notify(tick) {
    this.subscribers.forEach(fn => fn(tick));
  }

  generateTick() {
    // fallback tick generator (not used directly)
    return {
      price: +(Math.random() * 100 + 1000).toFixed(2),
      volume: +(Math.random() * 5).toFixed(3),
      timestamp: new Date().toISOString(),
      trend: Math.random() > 0.5 ? "up" : "down"
    };
  }

  resolveTiming(timing) {
    if (!timing) return 15000; // default 15s
    if (timing.unit === "seconds") return timing.value * 1000;
    if (timing.unit === "minutes") return timing.value * 60000;
    if (timing.unit === "hours") return timing.value * 3600000;
    return 15000;
  }
}

export const simulationFeed = new SimulationFeed();
