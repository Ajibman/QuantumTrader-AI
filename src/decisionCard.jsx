import { useSignalStore } from "../../state/signalStore";

export default function DecisionCard() {

  const signal = useSignalStore(state => state.signal);

  if (!signal) return <div>Waiting for signal...</div>;

  return (
    <div className="card">

      <h2>{signal.asset}</h2>
      <h3>{signal.direction}</h3>

      <p>Confidence: {signal.confidence}%</p>

      <p>
        Entry: {signal.entry_zone.low} - {signal.entry_zone.high}
      </p>

    </div>
  );
}
