import { Link } from "react-router-dom";
import MapMini from "./MapMini";
import type { Place } from "../hooks/usePlacesSearch";

function renderToday(opening: Place["opening"]): string {
  const now = new Date();
  const key = (["sun","mon","tue","wed","thu","fri","sat"] as const)[now.getDay()];
  const windows = opening[key];
  if (!windows || windows.length === 0) return "Closed";
  return windows.map(w => `${w.open}–${w.close}`).join(", ");
}

type Props = {
  place: Place;
  expanded: boolean;
  onToggle: () => void;
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
  toDirections: (lat: number, lon: number) => string;
  // theme tokens
  border: string; card: string; fg: string; sub: string; dark: boolean;
};

export default function ResultCard({
  place: r, expanded, onToggle, isFav, toggleFav, toDirections,
  border, card, fg, sub, dark
}: Props) {
  const isOpen = r.status.open;
  const km = (r.distanceMeters / 1000).toFixed(1);

  return (
    <li style={{ border: `1px solid ${border}`, borderRadius: 12, overflow: "hidden", background: card }}>
      {/* Header */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
        aria-expanded={expanded}
        aria-controls={`panel-${r.id}`}
        style={{ cursor: "pointer", display: "block", width: "100%", padding: 12, background: "transparent", border: "none", textAlign: "left", color: fg }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600 }}>
              <button
                onClick={(ev) => { ev.stopPropagation(); toggleFav(r.id); }}
                aria-label={isFav(r.id) ? "Unfavourite" : "Favourite"}
                style={{ marginRight: 6, border: "none", background: "transparent", cursor: "pointer" }}
              >
                {isFav(r.id) ? "⭐" : "☆"}
              </button>
              {ICON[r.type]} {r.name}
            </div>
            <div style={{ fontSize: 13, color: sub }}>
              {r.type.toUpperCase()} · {km} km · Today: {renderToday(r.opening)} {r.waitMinutes != null ? `· Est. wait: ${r.waitMinutes}m` : ""}
            </div>
          </div>
          <span
            style={{ fontSize: 12, padding: "4px 8px", borderRadius: 999, background: isOpen ? "#14532d" : "#7f1d1d", border: `1px solid ${isOpen ? "#16a34a" : "#dc2626"}`, color: "#fff" }}
          >
            {isOpen ? `Open${r.status.closesInMins ? ` · closes in ${r.status.closesInMins}m` : ""}` : "Closed"}
          </span>
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div id={`panel-${r.id}`} style={{ padding: 12, borderTop: `1px solid ${border}`, background: dark ? "#0f172a" : "#fafafa", color: fg }}>
          <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            {r.address && <div>{r.address}</div>}
            {r.phone && <a href={`tel:${r.phone}`} style={{ color: "#0b6" }}>Call: {r.phone}</a>}
            {r.website && (
              <a href={r.website} target="_blank" rel="noreferrer" style={{ color: "#0b6" }}>
                Website
              </a>
            )}
            <Link to={`/place/${r.id}`} style={{ color: "#0b6" }}>View details →</Link>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={toDirections(r.location.lat, r.location.lon)}
              target="_blank"
              rel="noreferrer"
              style={{ padding: "8px 10px", background: "#0b6", color: "white", borderRadius: 8, textDecoration: "none" }}
            >
              Directions
            </a>
          </div>

          <div style={{ height: 180, borderRadius: 8, overflow: "hidden", border: `1px solid ${border}`, marginBottom: 10 }}>
            <MapMini lat={r.location.lat} lon={r.location.lon} name={r.name} />
          </div>

          <div style={{ fontSize: 13, color: sub }}>
            <strong style={{ color: fg }}>Today:</strong> {renderToday(r.opening)}
          </div>
        </div>
      )}
    </li>
  );
}

const ICON: Record<Place["type"], string> = {
  gp: "🩺",
  "walk-in": "🚶",
  utc: "🏥",
  ae: "🚑"
};