export default function InsightFeed({ signal }) {
  return (
    <div className="card insights">

      <h3>AI Reasoning</h3>

      {signal?.reasoning?.map((r, i) => (
        <p key={i}>• {r}</p>
      ))}

      {signal?.warnings?.map((w, i) => (
        <p key={i} style={{ color: "orange" }}>⚠ {w}</p>
      ))}

    </div>
  );
}
