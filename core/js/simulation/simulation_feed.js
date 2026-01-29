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
