"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  MapPin,
  Search,
  CheckCircle2,
} from "lucide-react";

type SearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    suburb?: string;
    neighbourhood?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    province?: string;
    postcode?: string;
  };
};

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
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] =
    useState<SearchResult | null>(null);
  const [searchMessage, setSearchMessage] = useState("");

  const input =
    "w-full rounded-2xl border border-[#E8D9A8] bg-white p-4 text-black outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10";

  /*
   * AUTOMATIC ADDRESS SEARCH
   *
   * This runs while the user types.
   * Finding an address is OPTIONAL.
   */
  useEffect(() => {
    const query = address.trim();

    if (query.length < 4) {
      setSuggestions([]);
      setSearchMessage("");
      return;
    }

    const timer = window.setTimeout(async () => {
      setSearching(true);
      setSearchMessage("");

      try {
        const fullQuery = [
          query,
          suburb.trim(),
          city.trim(),
          province.trim(),
          "South Africa",
        ]
          .filter(Boolean)
          .join(", ");

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&countrycodes=za&q=${encodeURIComponent(
            fullQuery
          )}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Address search failed: ${response.status}`
          );
        }

        const results =
          (await response.json()) as SearchResult[];

        setSuggestions(results);

        if (results.length === 0) {
          setSearchMessage(
            "We couldn't find an exact match. That's okay — you can still use the address you entered."
          );
        }
      } catch (error) {
        console.error(
          "HomeLinker address search error:",
          error
        );

        setSuggestions([]);

        setSearchMessage(
          "We couldn't search the map right now. You can still continue with your address."
        );
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [address, suburb, city, province]);

  function chooseSuggestion(result: SearchResult) {
    const details = result.address ?? {};

    const road = details.road ?? "";
    const houseNumber = details.house_number ?? "";

    const formattedAddress =
      [houseNumber, road]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      result.display_name.split(",")[0];

    const detectedSuburb =
      details.suburb ||
      details.neighbourhood ||
      "";

    const detectedCity =
      details.city ||
      details.town ||
      details.village ||
      details.municipality ||
      "";

    const detectedProvince =
      details.state ||
      details.province ||
      "";

    setAddress(formattedAddress);

    if (detectedSuburb) {
      setSuburb(detectedSuburb);
    }

    if (detectedCity) {
      setCity(detectedCity);
    }

    if (detectedProvince) {
      const matchingProvince = provinces.find(
        (item) =>
          item.toLowerCase() ===
          detectedProvince.toLowerCase()
      );

      setProvince(
        matchingProvince || detectedProvince
      );
    }

    setLatitude(Number(result.lat));
    setLongitude(Number(result.lon));

    setSelectedLocation(result);
    setSuggestions([]);
    setSearchMessage("");
  }

  /*
   * MANUAL ADDRESS
   *
   * This intentionally does NOT require a map result.
   */
  function saveManualAddress() {
    if (!address.trim()) {
      setSearchMessage(
        "Please enter the street address first."
      );
      return;
    }

    setSearchMessage(
      "Address saved. You can continue even though an exact map location was not found."
    );
  }

  /*
   * Province + City + Address are enough.
   *
   * Latitude and longitude are OPTIONAL.
   */
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
          Enter the property address. You don't need to find
          the exact location on the map.
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
              setSelectedLocation(null);
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
                setSelectedLocation(null);
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
                setSelectedLocation(null);
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
              className={`${input} pl-12 pr-12`}
              placeholder="Type or paste the full address..."
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setSelectedLocation(null);
                setLatitude(null);
                setLongitude(null);
              }}
              autoComplete="street-address"
            />

            {searching && (
              <Loader2
                size={19}
                className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#C9A227]"
              />
            )}

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Start typing and we'll automatically suggest
            matching addresses.
          </p>

          {/* ADDRESS SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-[#E8D9A8] bg-white shadow-2xl">

              {suggestions.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() =>
                    chooseSuggestion(result)
                  }
                  className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition last:border-0 hover:bg-[#FFF9E8]"
                >
                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-[#C9A227]"
                  />

                  <span className="text-sm leading-6 text-[#111111]">
                    {result.display_name}
                  </span>
                </button>
              ))}

            </div>
          )}

        </div>

        {/* OPTIONAL SEARCH BUTTON */}
        <button
          type="button"
          onClick={saveManualAddress}
          disabled={!address.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Search size={18} />
          Use This Address
        </button>

        {/* MAP FOUND */}
        {selectedLocation && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

            <CheckCircle2
              size={22}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <p className="font-bold text-emerald-800">
                Location found
              </p>

              <p className="mt-1 text-sm text-emerald-700">
                We found this address on the map.
                Your property will use this location.
              </p>
            </div>

          </div>
        )}

        {/* MAP NOT FOUND */}
        {searchMessage && (
          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-4">

            <p className="text-sm leading-6 text-[#555555]">
              {searchMessage}
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