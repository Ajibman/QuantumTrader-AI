// core/js/simulation/simulation_feed.js

let intervalId = null;
let subscribers = [];

export const SimulationFeed = {

  subscribe(fn) {
    subscribers.push(fn);
  },

  start() {
    if (intervalId) return;

    intervalId = setInterval(() => {
      const tick = {
        timestamp: new Date().toISOString(),
        price: (30000 + Math.random() * 500).toFixed(2),
        volume: (Math.random() * 2).toFixed(3)
      };

      subscribers.forEach(fn => fn(tick));
    }, 1000);
  },

  stop() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }
};
