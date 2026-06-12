import React from "react";
import { Link } from "react-router-dom";

export default function AppLayout({ children }) {
  return (
    <div className="app-shell">

      {/* SIDE NAV */}
      <aside className="sidebar">

        <h2>QTAI</h2>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/strategy">Strategy</Link>
          <Link to="/settings">Settings</Link>
        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-view">
        {children}
      </main>

    </div>
  );
}
