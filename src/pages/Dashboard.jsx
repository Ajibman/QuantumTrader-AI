import React from "react";

import TopStatusBar from "../components/status/TopStatusBar";
import DecisionPanel from "../components/decision/DecisionPanel";
import RiskControlPanel from "../components/risk/RiskControlPanel";
import ActionButtons from "../components/actions/ActionButtons";
import InsightFeed from "../components/insights/InsightFeed";
import TradeHistoryPanel from "../components/analytics/TradeHistoryPanel";

export default function Dashboard() {
  return (
    <div className="dashboard-grid">

      <TopStatusBar />

      <div className="row">
        <DecisionPanel />
        <RiskControlPanel />
      </div>

      <div className="row">
        <ActionButtons />
        <InsightFeed />
      </div>

      <TradeHistoryPanel />

    </div>
  );
}
