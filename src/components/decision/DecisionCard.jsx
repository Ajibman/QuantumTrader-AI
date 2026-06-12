import React from "react";

export default function DecisionCard({ signal }) {
  if (!signal) return null;

  return (
    <div className="card decision-card">

      <h2>{signal.asset}</h2>

      <h3>Direction: {signal.direction}</h3>

      <p>
        Entry: {signal.entry_zone.low} - {signal.entry_zone.high}
      </p>

      <p>
        Stop Loss: {signal.stop_loss.value}
      </p>

      <div>
        <h4>Take Profits</h4>
        <ul>
          {signal.take_profits.map((tp) => (
            <li key={tp.level}>
              {tp.level}: {tp.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="confidence">
        Confidence: {signal.confidence}%
      </div>

      <div className="reasoning">
        {signal.reasoning?.map((r, i) => (
          <p key={i}>🧠 {r}</p>
        ))}
      </div>

    </div>
  );
}
