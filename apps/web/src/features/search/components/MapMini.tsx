import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

// Ensure Leaflet default icons work in Vite
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
(L.Marker.prototype as any).options.icon = DefaultIcon;

export default function MapMini({ lat, lon, name }: { lat: number; lon: number; name: string }) {
  return (
    <MapContainer center={[lat, lon]} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lon]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}