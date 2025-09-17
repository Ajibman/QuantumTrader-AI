import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(); // assumes same origin, backend running on same host

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Listen for system logs from backend
    socket.on("system_log", (log) => {
      setLogs((prev) => [...prev, log]);
    });

    // Cleanup
    return () => {
      socket.off("system_log");
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Backend Dashboard</h1>
      <div className="log-box system">
        <h2>System Logs</h2>
        {logs.length === 0 ? (
          <div>No logs yet...</div>
        ) : (
          logs.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(); // assumes same origin, backend running on same host

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Listen for system logs from backend
    socket.on("system_log", (log) => {
      setLogs((prev) => [...prev, log]);
    });

    // Cleanup
    return () => {
      socket.off("system_log");
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <h1>Backend Dashboard</h1>
      <div className="log-box system">
        <h2>System Logs</h2>
        {logs.length === 0 ? (
          <div>No logs yet...</div>
        ) : (
          logs.map((line, i) => <div key={i}>{line}</div>)
        )}
      </div>
    </div>
  );
        }
