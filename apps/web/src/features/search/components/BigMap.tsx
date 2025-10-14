import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useDirectionsUrl } from "../hooks/useDirectionsUrl";
import { FitBounds } from "./FitBounds";
import type { Place } from "../hooks/usePlacesSearch";

const TYPE_ICON: Record<Place["type"], string> = {
  gp: "🩺",
  "walk-in": "🚶",
  utc: "🏥",
  ae: "🚑"
};

export default function BigMap({ results }: { results: Place[] }) {
  const { toDirections } = useDirectionsUrl();

  const center = results[0]
    ? [results[0].location.lat, results[0].location.lon] as [number, number]
    : [51.509, -0.118] as [number, number];

  const bounds = results.length
    ? (results.map(r => [r.location.lat, r.location.lon]) as [number, number][])
    : undefined;

  return (
    <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
      />
      {bounds && <FitBounds bounds={bounds} />}
      {results.map(r => (
        <Marker key={r.id} position={[r.location.lat, r.location.lon]}>
          <Popup>
            <div style={{ fontWeight: 600 }}>{TYPE_ICON[r.type]} {r.name}</div>
            <div style={{ fontSize: 12 }}>{(r.distanceMeters/1000).toFixed(1)} km{r.waitMinutes != null ? ` · wait ${r.waitMinutes}m` : ""}</div>
            <a href={toDirections(r.location.lat, r.location.lon)} target="_blank" rel="noreferrer">Directions</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}