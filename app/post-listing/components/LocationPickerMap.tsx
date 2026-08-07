"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

type LeafletIconPrototype = typeof L.Icon.Default.prototype & {
  _getIconUrl?: string;
};

const defaultIcon = L.Icon.Default.prototype as LeafletIconPrototype;
delete defaultIcon._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
};

function ClickHandler({
  setLatitude,
  setLongitude,
}: {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });

  return null;
}

function ChangeView({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      map.flyTo([latitude, longitude], 17, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [latitude, longitude, map]);

  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: Props) {
  return (
    <MapContainer
      center={[-26.2041, 28.0473]}
      zoom={13}
      style={{
        height: "450px",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <ChangeView
        latitude={latitude}
        longitude={longitude}
      />

      <ClickHandler
        setLatitude={setLatitude}
        setLongitude={setLongitude}
      />

      {latitude !== null && longitude !== null && (
        <Marker position={[latitude, longitude]} />
      )}
    </MapContainer>
  );
}