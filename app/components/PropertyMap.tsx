"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  latitude: number;
  longitude: number;
  title: string;
};

export default function PropertyMap({
  latitude,
  longitude,
  title,
}: Props) {
  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold text-[#1B1B1B] mb-4">
        Property Location
      </h2>

      <div className="overflow-hidden rounded-2xl shadow-lg">
        <MapContainer
          center={[latitude, longitude]}
          zoom={15}
          scrollWheelZoom={false}
          style={{
            height: "450px",
            width: "100%",
          }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[latitude, longitude]}>
            <Popup>{title}</Popup>
          </Marker>
        </MapContainer>
      </div>

      <a
        href={`https://www.google.com/maps?q=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-5 bg-[#C9A227] hover:bg-[#A67C00] text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        Open in Google Maps
      </a>
    </div>
  );
}