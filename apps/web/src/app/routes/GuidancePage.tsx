import { Link } from "react-router-dom";

function Card({ title, body, goTo }: { title: string; body: string; goTo: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}>{body}</div>
      <div style={{ fontSize: 13 }}>
        Suggested venue: <strong>{goTo}</strong>
      </div>
    </div>
  );
}

export default function GuidancePage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Link to="/" style={{ textDecoration: "none" }}>← Back to search</Link>
      </header>

      <h1 style={{ fontSize: 22, marginBottom: 12 }}>When to go where?</h1>
      <p style={{ fontSize: 14, color: "#374151", marginBottom: 16 }}>
        This is information only — not medical advice. If you’re unsure, use NHS 111 online.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        <Card
          title="Sprain or strain"
          body="Rest, ice, compression, elevation. If severe pain or you can’t put weight on it, get it seen."
          goTo="Urgent Treatment Centre / Walk-in"
        />
        <Card
          title="Small cuts or minor burns"
          body="Cool under running water for 20 minutes (burns). Dress the wound. If bleeding doesn't stop with pressure, escalate."
          goTo="Urgent Treatment Centre / Walk-in"
        />
        <Card
          title="Fever (child)"
          body="Use NHS 111 online for an assessment. Seek GP if persistent or worsening."
          goTo="NHS 111 online / GP"
        />
        <Card
          title="Chest pain or stroke symptoms"
          body="Call 999 immediately."
          goTo="A&E / 999"
        />
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <a
          href="https://111.nhs.uk/"
          target="_blank"
          rel="noreferrer"
          style={{ padding: "10px 14px", background: "#0b6", color: "white", borderRadius: 8, textDecoration: "none" }}
        >
          Use NHS 111 online
        </a>
        <a
          href="tel:999"
          style={{ padding: "10px 14px", background: "#dc2626", color: "white", borderRadius: 8, textDecoration: "none" }}
        >
          Call 999 (emergency)
        </a>
      </div>

      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 16 }}>
        If you have a life-threatening emergency, call 999.
      </p>
    </div>
  );
}