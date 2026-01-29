import SimulationFeed from './simulation_feed.js';
import CPilot from './cpilot_ready.js';

const CPilotSimulationBind = (() => {

  function start() {
    SimulationFeed.subscribe(CPilot.ingestMarketTick);
    SimulationFeed.start(1000);
  }

  function stop() {
    SimulationFeed.stop();
    SimulationFeed.unsubscribe(CPilot.ingestMarketTick);
  }

  return { start, stop };

})();

export default CPilotSimulationBind;
