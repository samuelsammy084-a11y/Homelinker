"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(
  () => import("./LocationPickerMap"),
  {
    ssr: false,
  }
);

type Props = {
  province: string;
  setProvince: (v: string) => void;

  city: string;
  setCity: (v: string) => void;

  suburb: string;
  setSuburb: (v: string) => void;

  address: string;
  setAddress: (v: string) => void;

  latitude: number | null;
  setLatitude: (v: number) => void;

  longitude: number | null;
  setLongitude: (v: number) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function LocationStep({
  province,
  setProvince,
  city,
  setCity,
  suburb,
  setSuburb,
  address,
  setAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  onBack,
  onNext,
}: Props) {
  const [loading, setLoading] = useState(false);

  const input =
    "w-full rounded-2xl border border-[#E8D9A8] p-4 text-black outline-none focus:border-[#C9A227]";

  async function findAddress() {
    if (!address || !city || !province) {
      alert("Please fill in the street address, city and province first.");
      return;
    }

    setLoading(true);

    try {
      const query = encodeURIComponent(
        `${address}, ${suburb}, ${city}, ${province}, South Africa`
      );

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
      );

      const data = await res.json();

      if (!data.length) {
        alert("Address not found.");
        setLoading(false);
        return;
      }

      setLatitude(Number(data[0].lat));
      setLongitude(Number(data[0].lon));
    } catch (err) {
      console.error(err);
      alert("Failed to locate address.");
    }

    setLoading(false);
  }

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <h2 className="text-4xl font-black text-center text-[#111111]">
        Property Location
      </h2>

      <p className="mt-3 mb-10 text-center text-[#555555]">
        Tell us where your property is located.
      </p>

      <div className="grid gap-6 md:grid-cols-2">

        <select
          className={input}
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        >
          <option value="">Province</option>
          <option>Gauteng</option>
          <option>Western Cape</option>
          <option>KwaZulu-Natal</option>
          <option>Eastern Cape</option>
          <option>Free State</option>
          <option>Limpopo</option>
          <option>Mpumalanga</option>
          <option>North West</option>
          <option>Northern Cape</option>
        </select>

        <input
          className={input}
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className={input}
          placeholder="Suburb"
          value={suburb}
          onChange={(e) => setSuburb(e.target.value)}
        />

        <input
          className={input}
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

      </div>

      <button
        type="button"
        onClick={findAddress}
        disabled={loading}
        className="mt-8 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white hover:bg-[#A67C00]"
      >
        {loading ? "Finding Address..." : "📍 Find Address"}
      </button>

      <div className="mt-8 overflow-hidden rounded-3xl border border-[#E8D9A8]">
        <LocationPickerMap
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-[#FFF9E8] p-4">
          <p className="text-sm text-gray-500">Latitude</p>
          <p className="font-bold">{latitude ?? "--"}</p>
        </div>

        <div className="rounded-xl bg-[#FFF9E8] p-4">
          <p className="text-sm text-gray-500">Longitude</p>
          <p className="font-bold">{longitude ?? "--"}</p>
        </div>

      </div>

      <div className="mt-10 flex justify-between">

        <button
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-8 py-4 text-[#C9A227]"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          disabled={
            !province ||
            !city ||
            !suburb ||
            !address ||
            latitude === null ||
            longitude === null
          }
          className="rounded-2xl bg-[#C9A227] px-8 py-4 text-white disabled:opacity-40"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}