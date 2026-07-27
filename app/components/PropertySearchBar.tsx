"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Search,
  MapPin,
  Home,
  Building2,
} from "lucide-react";

type PropertySearchBarProps = {
  sticky?: boolean;
};

const southAfricanCities = [
  { city: "Johannesburg", province: "Gauteng" },
  { city: "Sandton", province: "Gauteng" },
  { city: "Randburg", province: "Gauteng" },
  { city: "Roodepoort", province: "Gauteng" },
  { city: "Soweto", province: "Gauteng" },
  { city: "Midrand", province: "Gauteng" },
  { city: "Pretoria", province: "Gauteng" },
  { city: "Centurion", province: "Gauteng" },
  { city: "Kempton Park", province: "Gauteng" },
  { city: "Boksburg", province: "Gauteng" },
  { city: "Benoni", province: "Gauteng" },
  { city: "Cape Town", province: "Western Cape" },
  { city: "Bellville", province: "Western Cape" },
  { city: "Stellenbosch", province: "Western Cape" },
  { city: "Paarl", province: "Western Cape" },
  { city: "George", province: "Western Cape" },
  { city: "Durban", province: "KwaZulu-Natal" },
  { city: "Umhlanga", province: "KwaZulu-Natal" },
  { city: "Pinetown", province: "KwaZulu-Natal" },
  { city: "Pietermaritzburg", province: "KwaZulu-Natal" },
  { city: "Bloemfontein", province: "Free State" },
  { city: "Polokwane", province: "Limpopo" },
  { city: "Mbombela", province: "Mpumalanga" },
  { city: "Rustenburg", province: "North West" },
  { city: "Kimberley", province: "Northern Cape" },
  { city: "Gqeberha", province: "Eastern Cape" },
  { city: "East London", province: "Eastern Cape" },
];

function PropertySearchBarContent({
  sticky = false,
}: PropertySearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const [listingType, setListingType] = useState<"rent" | "sale">(
    (searchParams.get("listingType") as "rent" | "sale") || "rent"
  );

  const [province, setProvince] = useState(
    searchParams.get("province") ?? ""
  );

  const [city, setCity] = useState(
    searchParams.get("city") ?? ""
  );

  const [type, setType] = useState(
    searchParams.get("type") ?? ""
  );

  const [budget, setBudget] = useState(
    searchParams.get("maxPrice") ?? ""
  );

  const [showSuggestions, setShowSuggestions] =
    useState(false);
const suggestions = southAfricanCities.filter((item) =>
  item.city.toLowerCase().includes(city.toLowerCase())
);
  useEffect(() => {
    setListingType(
      (searchParams.get("listingType") as "rent" | "sale") ||
        "rent"
    );

    setProvince(searchParams.get("province") ?? "");
    setCity(searchParams.get("city") ?? "");
    setType(searchParams.get("type") ?? "");
    setBudget(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  const maxBudget =
    listingType === "rent"
      ? 100000
      : 200000000;

  const minBudget =
    listingType === "rent"
      ? 2500
      : 50000;

  const step =
    listingType === "rent"
      ? 500
      : 50000;

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";
      function handleSearch() {
    const params = new URLSearchParams();

    params.set("listingType", listingType);

    if (province) params.set("province", province);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (budget) params.set("maxPrice", budget);

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div
      ref={wrapperRef}
      className={`rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur ${
        sticky ? "sticky top-24 z-30" : ""
      }`}
    >
      <div className="mb-6 flex gap-3">

        <button
          onClick={() => {
            setListingType("rent");
            setBudget("100000");
          }}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition ${
            listingType === "rent"
              ? "bg-[#C9A227] text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Home size={18} />
          For Rent
        </button>

        <button
          onClick={() => {
            setListingType("sale");
            setBudget("5000000");
          }}
          className={`flex items-center gap-2 rounded-xl px-6 py-3 font-bold transition ${
            listingType === "sale"
              ? "bg-[#C9A227] text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Building2 size={18} />
          For Sale
        </button>

      </div>

      <div className="grid gap-4 lg:grid-cols-5 md:grid-cols-2">

        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className={inputClass}
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

        <div className="relative">

          <input
            type="text"
            placeholder="City, suburb or area..."
            value={city}
            onFocus={() => setShowSuggestions(true)}
            onChange={(e) => {
              setCity(e.target.value);
              setShowSuggestions(true);
            }}
            className={inputClass}
          />

          {showSuggestions && city.length > 0 && (
            <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-xl max-h-72 overflow-y-auto">

              {suggestions.length > 0 ? (
                suggestions.map((item) => (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => {
                      setCity(item.city);
                      setProvince(item.province);
                      setShowSuggestions(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#F8F6F1]"
                  >
                    <MapPin
                      size={16}
                      className="text-[#C9A227]"
                    />

                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.city}
                      </p>

                      <p className="text-xs text-slate-500">
                        {item.province}
                      </p>
                    </div>

                  </button>
                ))
              ) : (
                <div className="p-4 text-sm text-slate-500">
                  No matching locations found.
                </div>
              )}

            </div>
          )}

        </div>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="">Property Type</option>
          <option>Room</option>
          <option>Bachelor Flat</option>
          <option>Apartment</option>
          <option>Flat</option>
          <option>House</option>
          <option>Townhouse</option>
          <option>Duplex</option>
          <option>Cottage</option>
          <option>Farm</option>
          <option>Vacant Land</option>
          <option>Commercial Property</option>
          <option>Industrial Property</option>
        </select>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            {listingType === "rent"
              ? "Maximum Rent"
              : "Maximum Price"}
          </label>

          <input
            type="range"
            min={minBudget}
            max={maxBudget}
            step={step}
            value={budget || maxBudget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full accent-[#C9A227]"
          />

          <div className="mt-2 flex justify-between text-sm font-semibold text-slate-700">
            <span>
              R
              {Number(
                budget || maxBudget
              ).toLocaleString("en-ZA")}
            </span>

            <span>
              {listingType === "rent"
                ? "Rent"
                : "Price"}
            </span>
          </div>

        </div>

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 font-bold text-white transition hover:bg-[#A67C00] hover:shadow-lg"
        >
          <Search size={18} />
          Search
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}

export default function PropertySearchBar(
  props: PropertySearchBarProps
) {
  return (
    <Suspense
      fallback={
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
        </div>
      }
    >
      <PropertySearchBarContent {...props} />
    </Suspense>
  );
}