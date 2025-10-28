import MapMini from "./MapMini";

type Place = {
  id: string;
  name?: string;
  address?: string;
  type: "gp" | "walk-in" | "utc" | "ae" | string;
  distanceMeters?: number;
  status: { open: boolean; closesInMins?: number };
  location: { lat: number; lon: number };
  opening?: Record<string, { open: string; close: string }[]>;
  waitMinutes?: number | null;
  phone?: string;
  website?: string;
};

type Props = {
  place: Place;
  expanded: boolean;
  onToggle: () => void;
  isFav: (id: string) => boolean;
  toggleFav: (id: string) => void;
  toDirections: (lat: number, lon: number) => string;
  border: string;
  card: string;
  fg: string;
  sub: string;
  dark: boolean;
};

const ICON: Record<string, string> = {
  gp: "🩺",
  "walk-in": "🚶",
  utc: "🏥",
  ae: "🚑",
};

function renderToday(opening?: Place["opening"]) {
  if (!opening) return "—";
  const dow = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date().getDay()];
  const slots = (opening as any)[dow] || [];
  if (!slots.length) return "Closed";
  return slots.map((w: any) => `${w.open}–${w.close}`).join(", ");
}

const ResultCard = ({
  place: r,
  expanded,
  onToggle,
  isFav,
  toggleFav,
  toDirections,
  border,
  card,
  fg,
  sub,
  dark,
}: Props) => {
  const distanceKm = ((r.distanceMeters ?? 0) / 1000).toFixed(1);
  const name =
    r.name?.trim() ||
    r.address?.trim() ||
    `Around ${r.location.lat.toFixed(6)},${r.location.lon.toFixed(6)}`;

  return (
    <li
      style={{
        border: `1px solid ${border}`,
        borderRadius: 12,
        overflow: "hidden",
        background: card,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={expanded}
        style={{
          cursor: "pointer",
          display: "block",
          width: "100%",
          padding: 12,
          background: "transparent",
          border: "none",
          textAlign: "left",
          color: fg,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>
              <button
                onClick={(ev) => {
                  ev.stopPropagation();
                  toggleFav(r.id);
                }}
                aria-label={isFav(r.id) ? "Unfavourite" : "Favourite"}
                style={{
                  marginRight: 6,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                {isFav(r.id) ? "⭐" : "☆"}
              </button>
              {ICON[r.type] || "🏥"} {name}
            </div>
            <div style={{ fontSize: 13, color: sub }}>
              {r.type.toUpperCase()} · {distanceKm} km · Today: {renderToday(r.opening)}{" "}
              {r.waitMinutes != null ? `· Est. wait: ${r.waitMinutes}m` : ""}
            </div>
          </div>

          <span
            style={{
              marginRight: "30px",
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 999,
              background: r.status.open ? "#14532d" : "#7f1d1d",
              border: `1px solid ${r.status.open ? "#16a34a" : "#dc2626"}`,
              color: "#fff",
              whiteSpace: "nowrap",
            }}
          >
            {r.status.open
              ? `Open${r.status.closesInMins ? ` · closes in ${r.status.closesInMins}m` : ""}`
              : "Closed"}
          </span>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            padding: 12,
            borderTop: `1px solid ${border}`,
            background: dark ? "#0f172a" : "#fafafa",
            color: fg,
          }}
        >
          <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
            {r.address && <div>{r.address}</div>}
            {r.phone && (
              <a href={`tel:${r.phone}`} style={{ color: "#0b6" }}>
                Call: {r.phone}
              </a>
            )}
            {r.website && (
              <a href={r.website} target="_blank" rel="noreferrer" style={{ color: "#0b6" }}>
                Website
              </a>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <a
              href={toDirections(r.location.lat, r.location.lon)}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "8px 10px",
                background: "#0b6",
                color: "white",
                borderRadius: 8,
                textDecoration: "none",
              }}
            >
              Directions
            </a>
          </div>

          {/* ✅ Map section — this was rendering correctly */}
          <div
            style={{
              height: 180,
              borderRadius: 8,
              overflow: "hidden",
              border: `1px solid ${border}`,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <MapMini lat={r.location.lat} lon={r.location.lon} name={name} />
          </div>

          <div style={{ fontSize: 13, color: sub }}>
            <strong style={{ color: fg }}>Today:</strong> {renderToday(r.opening)}
          </div>
        </div>
      )}
    </li>
  );
};

export default ResultCard;