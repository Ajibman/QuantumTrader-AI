import { useState, useEffect } from "react";

export default function Dashboard() {
  const [securityLog, setSecurityLog] = useState("");

  // Function to fetch log
  const fetchSecurityLog = async () => {
    try {
      const response = await fetch("/admin/security-log");
      const data = await response.text();
      setSecurityLog(data);
    } catch (err) {
      setSecurityLog("Error fetching security log.");
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchSecurityLog(); // initial load
    const interval = setInterval(fetchSecurityLog, 5000);
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div>
      <h2>Backend Dashboard</h2>

      <pre
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#111",
          color: "#0f0",
          maxHeight: "300px",
          overflowY: "auto",
          borderRadius: "8px",
        }}
      >
        {securityLog || "Loading security log..."}
      </pre>
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
