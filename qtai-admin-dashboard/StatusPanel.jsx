```jsx
// src/components/StatusPanel.jsx
export default function StatusPanel() {
  return (
    <div className="bg-gray-900 p-4 rounded text-white">
      <h2 className="text-xl font-bold text-blue-400">System Status</h2>
      <ul className="mt-2 text-sm text-gray-300 space-y-1">
        <li>🕓 Launch Date: Nov 09, 2025 (WA+1)</li>
        <li>✅ Scheduler: Armed</li>
        <li>✅ Modules: 15 Active</li>
        <li>⚡ Market Sync: Standby</li>
        <li>🔒 Ethics Layer: Ready</li>
      </ul>
    </div>
  );
}
```
