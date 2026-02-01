// core/js/simulation_feed.js

/**
 * Mock market data generator
 * Deterministic + inspectable
 * No network, no randomness unless seeded
 */

const SimulationFeed = (() => {
  let timer = null;
  let tick = 0;

  const subscribers = new Set();

  function subscribe(fn) {
    subscribers.add(fn);
  }

  function unsubscribe(fn) {
    subscribers.delete(fn);
  }

  function emit(data) {
    subscribers.forEach(fn => fn(data));
  }

  function generateTick() {
    tick += 1;

    // simple, readable market shape
    const price = 100 + Math.sin(tick / 5) * 2;
    const momentum = Math.cos(tick / 10);
    const volatility = Math.abs(Math.sin(tick / 7));

    return {
      ts: Date.now(),
      tick,
      price: Number(price.toFixed(2)),
      momentum: Number(momentum.toFixed(3)),
      volatility: Number(volatility.toFixed(3))
    };
  }

  function start(interval = 1000) {
    if (timer) return;
    timer = setInterval(() => emit(generateTick()), interval);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
    tick = 0;
  }

  return {
    start,
    stop,
    subscribe,
    unsubscribe
  };
})();

export default SimulationFeed;
