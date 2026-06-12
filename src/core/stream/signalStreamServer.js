import { WebSocketServer } from "ws";
import { generateSignal } from "../engine/signalEngine";

const wss = new WebSocketServer({ port: 8080 });

console.log("🚀 AI Signal Stream running on ws://localhost:8080");

function broadcastSignal(client, signal) {
  client.send(JSON.stringify({
    type: "AI_SIGNAL",
    payload: signal
  }));
}

// Mock market loop (replace with real market feed later)
setInterval(() => {

  const mockMarketData = {
    asset: "BTCUSD",
    volatilityIndex: Math.random(),
    trendStrength: Math.random(),
    volume: Math.random()
  };

  const mockAIOutput = {
    direction: ["BUY", "SELL", "WAIT"][Math.floor(Math.random() * 3)],
    entry_zone: { low: 42000, high: 42300 },
    stop_loss: { value: 41800 },
    take_profits: [
      { level: "TP1", value: 42800 },
      { level: "TP2", value: 43500 }
    ],
    confidence: Math.floor(Math.random() * 100),
    reasoning: ["Market momentum detected", "Volume spike confirmation"],
    warnings: []
  };

  const signal = generateSignal(mockMarketData, mockAIOutput);

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      broadcastSignal(client, signal);
    }
  });

}, 3000);
