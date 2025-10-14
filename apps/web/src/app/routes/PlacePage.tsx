//PlacePage.tsx
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGetWithFallback } from "./lib/api";
type Window = { open: string; close: string };
type Opening = {
  mon: Window[]; tue: Window[]; wed: Window[];
  thu: Window[]; fri: Window[]; sat: Window[]; sun: Window[];
};

type Place = {
  id: string;
  name: string;
  type: "gp" | "walk-in" | "utc" | "ae";
  address?: string;
  phone?: string;
  website?: string;
  location: { lat: number; lon: number };
  features?: { xray?: boolean; wheelchair?: boolean; parking?: boolean };
  opening: Opening;
};

const dayOrder: (keyof Opening)[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const dayLabel: Record<keyof Opening, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

export default function PlacePage() {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const { data } = await apiGetWithFallback(`/places/${id}`);
        setPlace(data as Place);
      } catch (err: any) {
        setError(
          err?.response?.data?.error ||
          err?.message ||
          "An error occurred fetching place details."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <Link to="/" style={{ textDecoration: "none" }}>← Back</Link>
      </div>

      {loading && <p>Loading...</p>}

      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {!loading && !error && place && (
        <>
          <h1 style={{ marginBottom: 0 }}>{place.name}</h1>
          <div style={{ color: "#666", marginBottom: 12 }}>{place.type.toUpperCase()}</div>

          {/* Contact / actions */}
          <div style={{ marginBottom: 10 }}>
            {place.address && (
              <div>
                <strong>Address:</strong>{" "}
                <span style={{ marginLeft: 8 }}>{place.address}</span>
              </div>
            )}
            {place.phone && (
              <div>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${place.phone}`} style={{ color: "#0066cc" }}>
                  {place.phone}
                </a>
              </div>
            )}
            {place.website && (
              <div>
                <strong>Website:</strong>{" "}
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0066cc" }}
                >
                  {place.website}
                </a>
              </div>
            )}
            {place.location && (
              <div>
                <strong>Map:</strong>{" "}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.location.lat},${place.location.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0066cc" }}
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Features */}
          {place.features && (
            <div style={{ marginBottom: 18 }}>
              <strong>Features:</strong>
              <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {"wheelchair" in place.features && (
                  <Badge label="Wheelchair" on={!!place.features.wheelchair} />
                )}
                {"parking" in place.features && (
                  <Badge label="Parking" on={!!place.features.parking} />
                )}
                {"xray" in place.features && (
                  <Badge label="X-ray" on={!!place.features.xray} />
                )}
              </div>
            </div>
          )}

          {/* Opening hours */}
          <div style={{ marginBottom: 16 }}>
            <strong>Opening Hours:</strong>
            <table style={{ width: "100%", marginTop: 6, borderCollapse: "collapse" }}>
              <tbody>
                {dayOrder.map((d) => (
                  <tr key={d}>
                    <td style={{ padding: "4px 8px", fontWeight: 500, width: 70 }}>
                      {dayLabel[d]}
                    </td>
                    <td style={{ padding: "4px 8px" }}>
                      {place.opening[d].length === 0
                        ? "Closed"
                        : place.opening[d].map((w, i) => (
                            <span key={`${d}-${i}`} style={{ marginRight: 8 }}>
                              {w.open} – {w.close}
                            </span>
                          ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 32, color: "#888", fontSize: 13 }}>
            Information provided as a guide only. Please check with the place for latest details.
          </div>
        </>
      )}
    </div>
  );
}

function Badge({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      style={{
        background: on ? "#e6ffed" : "#f1f5f9",
        color: on ? "#166534" : "#475569",
        border: `1px solid ${on ? "#16a34a" : "#cbd5e1"}`,
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 12,
      }}
    >
      {label}{on ? "" : " (n/a)"}
    </span>
  );
}