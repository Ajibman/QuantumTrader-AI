 ```js
const signals = [];

function registerSignal(signal) {
  signals.push({ signal, timestamp: Date.now() });
  console.log(`📡 Registered signal: signal.type`);


function processSignals() 
  signals.sort((a, b) => b.timestamp - a.timestamp);
  signals.forEach(( signal ) => 
    switch (signal.type) 
      case 'market':
        handleMarketSignal(signal);
        break;
      case 'system':
        handleSystemSignal(signal);
        break;
      case 'external':
        handleExternalSignal(signal);
        break;
      default:
        console.warn(`⚠️ Unrecognized signal type:{signal.type}`);
    }
  });
}

function handleMarketSignal(signal) {
  console.log(`📈 Market signal processed: signal.data`);


function handleSystemSignal(signal) 
  console.log(`🖥️ System signal processed:{signal.data}`);
}

function handleExternalSignal(signal) {
  console.log(`🌍 External signal processed: ${signal.data}`);
}

module.exports = { registerSignal, processSignals };
```
