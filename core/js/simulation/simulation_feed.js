// core/js/simulation/simulation_feed.js

// small random trend shifts
      if (Math.random() > 0.97) trend *= -1;

      price += trend * (Math.random() * 15);

      const tick = {
        timestamp: new Date().toISOString(),
        price: price.toFixed(2),
        volume: (Math.random() * 2).toFixed(3),
        trend: trend === 1 ? "up" : "down"
      };

      subscribers.forEach(fn => fn(tick));
    }, 1000);
  },

  stop() {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// core/simulation/simulation_feed.js

class SimulationFeed {
  constructor() {
    this.interval = null;
    this.subscribers = [];
  }

  start(timing, onTick) {
    const intervalMs = this.resolveTiming(timing);

    this.interval = setInterval(() => {
      const tick = this.generateTick();
      onTick(tick);
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
    this.subscribers.push(fn);
  }

  notify(tick) {
    this.subscribers.forEach(fn => fn(tick));
  }

  generateTick() {
    return {
      price: +(Math.random() * 100 + 1000).toFixed(2),
      volume: Math.floor(Math.random() * 10 + 1),
      timestamp: Date.now()
    };
  }

  resolveTiming(timing) {
    if (!timing) return 15000;
    if (timing.unit === "seconds") return timing.value * 1000;
    if (timing.unit === "minutes") return timing.value * 60000;
    return 15000;
  }
}

export const simulationFeed = new SimulationFeed();
