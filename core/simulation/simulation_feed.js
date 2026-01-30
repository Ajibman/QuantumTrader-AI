// core/simulation/simulation_feed.js

let intervalId = null;

export const simulationFeed = {
  start(timing, onTick) {
    if (intervalId) return;

    const intervalMs = this.resolveInterval(timing);

    intervalId = setInterval(() => {
      const tick = {
        price: this.mockPrice(),
        timestamp: Date.now()
      };

      onTick?.(tick);
    }, intervalMs);
  },

  stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },

  resolveInterval(timing) {
    if (!timing) return 1000;

    const { value, unit } = timing;

    if (unit === "seconds") return value * 1000;
    if (unit === "minutes") return value * 60 * 1000;

    return 1000;
  },

  mockPrice() {
    const base = 100;
    const variance = Math.random() * 2 - 1;
    return +(base + variance).toFixed(2);
  }
};
