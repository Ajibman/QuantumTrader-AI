```jsx
// src/App.jsx
import StatusPanel from './components/StatusPanel';
import MarketPulse from './components/MarketPulse';
import CPilotConsole from './components/CPilotConsole';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-3xl font-bold text-blue-500">QT AI Admin Dashboard</h1>
      <StatusPanel />
      <MarketPulse />
      <CPilotConsole />
    </div>
  );
}
```

---
