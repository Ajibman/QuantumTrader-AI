export default function StatusBar({ signal }) {
  if (!signal) return null;

  return (
    <div className="status-bar">

      <span>Market: {signal.market_state}</span>
      <span>Mode: {signal.ai_mode}</span>
      <span>Confidence: {signal.confidence}%</span>

    </div>
  );
}
