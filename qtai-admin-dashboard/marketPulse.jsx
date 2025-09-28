```jsx
// src/components/MarketPulse.jsx
export default function MarketPulse() {
  return (
    <div className="bg-black p-4 text-green-400 border border-green-700 rounded">
      <h2 className="text-xl font-semibold">Live Market Pulse</h2>
      <div className="mt-2 text-sm space-y-1">
        <p>🪙 BTC: $26,300 | 🔄 +1.2%</p>
        <p>💱 EUR/USD: 1.092 | 🔻 -0.4%</p>
        <p>📈 S&P 500: 4,500 | ⬆️ +0.8%</p>
      </div>
    </div>
  );
}
```

---
