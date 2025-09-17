// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Update to live backend URL if deployed

const Dashboard = () => {
  const [visitors, setVisitors] = useState({});
  const [entryHistory, setEntryHistory] = useState({});
  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    // Initial data from server
    socket.on("initialData", (data) => {
      setVisitors(data.visitors);
      setEntryHistory(data.entryHistory);
      setLeaderboard(data.leaderboard);
    });

    // Updates from server
    socket.on("visitorRouted", (visitor) => {
      setVisitors((prev) => ({ ...prev, [visitor.visitorId]: visitor }));
    });

    socket.on("entryHistoryUpdate", ({ visitorId, entry }) => {
      setEntryHistory((prev) => {
        const history = prev[visitorId] || [];
        return { ...prev, [visitorId]: [entry, ...history] };
      });
    });

    socket.on("leaderboardUpdate", (updatedLeaderboard) => {
      setLeaderboard(updatedLeaderboard);
    });

    // Cleanup on unmount
    return () => {
      socket.off("initialData");
      socket.off("visitorRouted");
      socket.off("entryHistoryUpdate");
      socket.off("leaderboardUpdate");
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Quantum Trader AI - Dashboard</h1>

      <section>
        <h2>Visitors</h2>
        <pre>{JSON.stringify(visitors, null, 2)}</pre>
      </section>

      <section>
        <h2>Entry History</h2>
        <pre>{JSON.stringify(entryHistory, null, 2)}</pre>
      </section>

      <section>
        <h2>Leaderboard</h2>
        <pre>{JSON.stringify(leaderboard, null, 2)}</pre>
      </section>
    </div>
  );
};

export default Dashboard;
