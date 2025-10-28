import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FitBounds } from "./FitBounds";

type Place = {
  id: string;
  name?: string;
  type?: "gp" | "walk-in" | "utc" | "ae" | string;
  distanceMeters?: number;
  status?: { open: boolean; closesInMins?: number };
  location: { lat: number; lon: number };
  address?: string;
  waitMinutes?: number | null;
};

const TYPE_ICON: Record<string, string> = {
  gp: "🩺",
  "walk-in": "🚶",
  utc: "🏥",
  ae: "🚑",
};

// Default marker fix (same as MapMini)
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
(L.Marker.prototype as any).options.icon = DefaultIcon;

export default function BigMap({ results }: { results: Place[] }) {
  const center: [number, number] =
    results[0] ? [results[0].location.lat, results[0].location.lon] : [51.509, -0.118];

  const bounds: [number, number][] | undefined =
    results.length ? results.map((r) => [r.location.lat, r.location.lon]) : undefined;

  return (
    <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {bounds && <FitBounds bounds={bounds} />}

      {results.map((r) => (
        <Marker key={r.id} position={[r.location.lat, r.location.lon]}>
          <Popup>
            <div style={{ fontWeight: 600 }}>
              {(TYPE_ICON[r.type ?? ""] ?? "📍")} {r.name ?? "Location"}
            </div>
            <div style={{ fontSize: 12 }}>
              {r.distanceMeters != null ? `${(r.distanceMeters / 1000).toFixed(1)} km` : ""}
              {r.waitMinutes != null ? ` · wait ${r.waitMinutes}m` : ""}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}