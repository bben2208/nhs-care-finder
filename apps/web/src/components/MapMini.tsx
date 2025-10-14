import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as L from "leaflet";

function useLeafletDefaultIcon() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const DefaultIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41]
    });
    (L.Marker.prototype as any).options.icon = DefaultIcon;
  }, []);
}

export default function MapMini({
  lat,
  lon,
  name,
}: {
  lat: number;
  lon: number;
  name?: string;
}) {
  useLeafletDefaultIcon();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  console.debug("[MapMini] at", { lat, lon, name });

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={14}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>{name ?? "Location"}</Popup>
      </Marker>
    </MapContainer>
  );
}