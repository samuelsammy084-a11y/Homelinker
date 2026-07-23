"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

type PropertySearchBarProps = {
  sticky?: boolean;
};

export default function PropertySearchBar({ sticky = false }: PropertySearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [province, setProvince] = useState(searchParams.get("province") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [budget, setBudget] = useState(searchParams.get("maxPrice") ?? "");

  useEffect(() => {
    setProvince(searchParams.get("province") ?? "");
    setCity(searchParams.get("city") ?? "");
    setType(searchParams.get("type") ?? "");
    setBudget(searchParams.get("maxPrice") ?? "");
  }, [searchParams]);

  function handleSearch() {
    const params = new URLSearchParams();

    if (province) params.set("province", province);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (budget) params.set("maxPrice", budget);

    router.push(`/properties?${params.toString()}`);
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  return (
    <div
      className={`rounded-[28px] border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-200/70 backdrop-blur ${sticky ? "sticky top-24 z-30" : ""}`}
    >
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <select value={province} onChange={(e) => setProvince(e.target.value)} className={inputClass}>
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
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={inputClass}
        />

        <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
          <option value="">Property Type</option>
          <option>Room</option>
          <option>Bachelor</option>
          <option>Apartment</option>
          <option>House</option>
          <option>Townhouse</option>
        </select>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Max budget
          </label>
          <input
            type="range"
            min="2500"
            max="30000"
            step="500"
            value={budget || 30000}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full accent-[#C9A227]"
          />
          <div className="mt-2 flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>R{Number(budget || 30000).toLocaleString("en-ZA")}</span>
            <span>Max</span>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 font-bold text-white transition-all duration-300 hover:bg-[#A67C00] hover:shadow-lg"
        >
          <Search size={18} />
          Search
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
