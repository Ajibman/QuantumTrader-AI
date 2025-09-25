 // src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";

const SOCKET_URL = "http://localhost:4000"; // replace with deployed backend URL

const Dashboard = () => {
  const [visitors, setVisitors] = useState([]);
  const [historicalLeaderboard, setHistoricalLeaderboard] = useState({});
  const [entryHistory, setEntryHistory] = useState({});
  const [filterBubble, setFilterBubble] = useState("All");
  const [filterTier, setFilterTier] = useState("All");
  const [dateRange, setDateRange] = useState("All");

  useEffect(() => {
    const socket = io(SOCKET_URL);

    const handleVisitorUpdate = (data) => {
      setVisitors((prev) => {
        const existing = prev.filter(v => v.visitorId !== data.visitorId);
        return [...existing, data];
      });

      setHistoricalLeaderboard((prev) => {
        const prevEntry = prev[data.visitorId] || { count: 0, highestTier: null, totalScore: 0 };
        const newTier = getTier(data);
        const tierRank = { Gold: 3, Silver: 2, Bronze: 1, null: 0 };
        const highestTier = tierRank[newTier] > tierRank[prevEntry.highestTier] ? newTier : prevEntry.highestTier;
        const count = prevEntry.count + 1;
        const totalScore = prevEntry.totalScore + (data.score ?? 0);
        return { ...prev, [data.visitorId]: { count, highestTier, totalScore } };
      });

      setEntryHistory((prev) => {
        const visitorHistory = prev[data.visitorId] || [];
        const newEntry = {
          timestamp: new Date().toISOString(), // ISO for easy filtering
          bubble: data.destination,
          score: data.score ?? "N/A",
          tier: getTier(data)
        };
        return { ...prev, [data.visitorId]: [newEntry, ...visitorHistory] };
      });

      if (isTopVisitor(data)) {
        toast.success(`Top Visitor Alert: ${data.visitorId} entered ${data.destination}`, { duration: 5000 });
      }
    };

    socket.on("visitorRouted", handleVisitorUpdate);
    socket.on("visitorReEvaluated", handleVisitorUpdate);

    return () => socket.disconnect();
  }, []);

  const isTopVisitor = (v) => {
    if (v.destination === "TraderLab_CPilot") return (v.score ?? 0) >= 8 && v.peacefulness >= 7;
    if (v.destination === "CPilot") return (v.score ?? 0) >= 7 && v.emotionalIntelligence >= 8;
    return false;
  };

  const getTier = (v) => {
    if (!isTopVisitor(v)) return null;
    if (v.score >= 9 && (v.peacefulness ?? 0) >= 9) return "Gold";
    if (v.score >= 8 && (v.peacefulness ?? 0) >= 8) return "Silver";
    return "Bronze";
  };

  // Utility: filter entry history based on tier, bubble, date range
  const getFilteredHistory = () => {
    let filtered = [];
    Object.entries(entryHistory).forEach(([visitorId, entries]) => {
      let filteredEntries = entries;

      if (filterTier !== "All") {
        filteredEntries = filteredEntries.filter(e => e.tier === filterTier);
      }

      if (filterBubble !== "All") {
        filteredEntries = filteredEntries.filter(e => e.bubble === filterBubble);
      }

      if (dateRange === "Last7Days") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        filteredEntries = filteredEntries.filter(e => new Date(e.timestamp) >= cutoff);
      } else if (dateRange === "Last30Days") {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);
        filteredEntries = filteredEntries.filter(e => new Date(e.timestamp) >= cutoff);
      }

      if (filteredEntries.length > 0) {
        filtered.push([visitorId, filteredEntries]);
      }
    });

    return Object.fromEntries(filtered);
  };

  // Export CSV
  const exportCSV = (data, filename) => {
    const csvContent = Object.entries(data)
      .map(([visitorId, entries]) => entries.map(e => `${visitorId},${e.timestamp},${e.bubble},${e.score},${e.tier ?? "N/A"}`).join("\n"))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON
  const exportJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Quantum Trader AI Dashboard</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="border p-1 rounded">
        
