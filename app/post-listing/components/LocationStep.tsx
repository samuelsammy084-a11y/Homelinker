"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";

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
  setLatitude: (v: number | null) => void;

  longitude: number | null;
  setLongitude: (v: number | null) => void;

  onBack: () => void;
  onNext: () => void;
};

const provinces = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Eastern Cape",
  "Free State",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
];

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
  const [addressMessage, setAddressMessage] = useState("");

  const input =
    "w-full rounded-2xl border border-[#E8D9A8] bg-white p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10";

  function saveManualAddress() {
    setAddressMessage("Address entered. You can continue to the next step.");
  }

  const canContinue =
    province.trim() !== "" &&
    city.trim() !== "" &&
    address.trim() !== "";

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-6 shadow-xl sm:p-10">

      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-[#111111] sm:text-4xl">
          Property Location
        </h2>

        <p className="mt-3 text-[#555555]">
          Enter the property address to continue.
        </p>
      </div>

      <div className="mt-10 space-y-6">

        {/* PROVINCE */}
        <div>
          <label className="mb-2 block font-semibold text-[#111111]">
            Province
          </label>

          <select
            className={input}
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setAddressMessage("");
              setLatitude(null);
              setLongitude(null);
            }}
          >
            <option value="">
              Select Province
            </option>

            {provinces.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* CITY + SUBURB */}
        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block font-semibold text-[#111111]">
              City / Town
            </label>

            <input
              className={input}
              placeholder="e.g. Tembisa"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setAddressMessage("");
                setLatitude(null);
                setLongitude(null);
              }}
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold text-[#111111]">
              Suburb / Section
            </label>

            <input
              className={input}
              placeholder="e.g. Emfihlweni"
              value={suburb}
              onChange={(e) => {
                setSuburb(e.target.value);
                setAddressMessage("");
                setLatitude(null);
                setLongitude(null);
              }}
            />
          </div>

        </div>

        {/* STREET ADDRESS */}
        <div className="relative">

          <label className="mb-2 block font-semibold text-[#111111]">
            Street Address
          </label>

          <div className="relative">

            <MapPin
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C9A227]"
            />

            <input
              className={`${input} pl-12`}
              placeholder="Type or paste the full address..."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setAddressMessage("");
                setLatitude(null);
                setLongitude(null);
              }}
              autoComplete="street-address"
            />

          </div>
        </div>

        <button
          type="button"
          onClick={saveManualAddress}
          disabled={!address.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Search size={18} />
          Use This Address
        </button>

        {addressMessage && (
          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-4">

            <p className="text-sm leading-6 text-[#555555]">
              {addressMessage}
            </p>

          </div>
        )}

        {/* OPTIONAL LOCATION DETAILS */}
        {(latitude !== null || longitude !== null) && (
          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-[#FFF9E8] p-4">
              <p className="text-xs text-gray-500">
                Latitude
              </p>

              <p className="mt-1 font-bold text-[#111111]">
                {latitude ?? "--"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FFF9E8] p-4">
              <p className="text-xs text-gray-500">
                Longitude
              </p>

              <p className="mt-1 font-bold text-[#111111]">
                {longitude ?? "--"}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* NAVIGATION */}
      <div className="mt-10 flex items-center justify-between">

        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-6 py-4 font-semibold text-[#C9A227] transition hover:bg-[#FFF6D8] sm:px-8"
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="rounded-2xl bg-[#C9A227] px-6 py-4 font-semibold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-40 sm:px-8"
        >
          Continue →
        </button>

      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        The map is optional. Your address is what matters for
        posting your property.
      </p>

    </div>
  );
}