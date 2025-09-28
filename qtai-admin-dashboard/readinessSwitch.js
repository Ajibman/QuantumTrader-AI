```jsx
export default function TransmissionPreview() {
  const signals = [
    "Forex Market",
    "eCurrency Channels",
    "Global Fortune 500",
    "US Fortune 500",
    "Commodities",
    "Metals",
    "Indexes",
    "SMEs & Industries",
    "Community Signals",
  ];

  return (
    <div className="bg-gray-900 p-4 mt-4 rounded text-white">
      <h2 className="text-xl font-bold text-indigo-400">Transmission Preview</h2>
      <ul className="mt-3 text-sm text-gray-300 list-disc list-inside space-y-1">
        {signals.map((item, i) => (
          <li key={i}>📡 {item}</li>
        ))}
      </ul>
    </div>
  );
}
```

```jsx
import TransmissionPreview from './components/TransmissionPreview';

// inside return():
<TransmissionPreview />
```
