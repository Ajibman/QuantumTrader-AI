export default function RiskPanel({ signal }) {
  if (!signal) return null;

  return (
    <div className="card risk-panel">

      <h3>Risk Engine</h3>

      <p>Level: {signal.risk.level}</p>
      <p>Exposure: {signal.risk.max_exposure_percent}%</p>
      <p>Lot Size: {signal.risk.lot_sensitivity}</p>

    </div>
  );
}
