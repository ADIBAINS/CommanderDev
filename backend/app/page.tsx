export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <h1>CommanderD</h1>
      <p>Incident intelligence engine. Use POST /api/analyze with a JSON body:</p>
      <pre style={{ background: "#f4f4f4", padding: "1rem", borderRadius: "4px" }}>
        {`{ "logs": ["2024-01-15T10:30:00Z ERROR [api] Connection refused", ...] }`}
      </pre>
    </main>
  );
}
