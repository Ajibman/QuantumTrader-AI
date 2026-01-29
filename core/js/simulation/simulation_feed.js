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

// core/js/simulation/simulation_feed.js

let intervalId = null;
let subscribers = [];
let price = 30000;
let trend = 1; // 1 = up, -1 = down

export const SimulationFeed = {

  subscribe(fn) {
    subscribers.push(fn);
  },

  start() {
    if (intervalId) return;

    intervalId = setInterval(() => {
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
