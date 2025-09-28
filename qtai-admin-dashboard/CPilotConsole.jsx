```jsx
// src/components/CPilotConsole.jsx
export default function CPilotConsole() {
  return (
<div className="bg-gray-800 p-4 text-white rounded">
      <h2 className="text-lg font-bold text-yellow-400">CPilot™ Console</h2>
      <button className="bg-blue-600 px-4 py-2 mt-3 rounded hover:bg-blue-700 transition">
        Activate CPilot
      </button>
    </div>
  );
}

import { useState } from 'react';

export default function CPilotConsole() {
  const [status, setStatus] = useState("Standby");

  const activateCPilot = () => {
    setStatus("Active");
    console.log("CPilot™ is now active");
    // Future: trigger real activation hook
  };

  return (
    <div className="bg-gray-800 p-4 text-white rounded">
      <h2 className="text-lg font-bold text-yellow-400">CPilot™ Console</h2>
      <p className="mt-2 text-sm">Status: <span className="text-green-400">{status}</span></p>
      <button
        onClick={activateCPilot}
        className="bg-blue-600 px-4 py-2 mt-3 rounded hover:bg-blue-700 transition"
      >
        Activate CPilot
      </button>
    </div>
  );
}
```

---
