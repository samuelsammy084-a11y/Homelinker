"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";

const PROVINCES = [
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

const PROPERTY_TYPES = [
  "House",
  "Apartment",
  "Flat",
  "Room",
  "Townhouse",
  "Cottage",
];

export default function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [province, setProvince] = useState(
    searchParams.get("province") ?? ""
  );
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [maxPrice, setMaxPrice] = useState(
    searchParams.get("maxPrice") ?? ""
  );
  const [open, setOpen] = useState(false);

  const activeCount = [province, type, maxPrice].filter(Boolean).length;

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());

    province ? params.set("province", province) : params.delete("province");
    type ? params.set("type", type) : params.delete("type");
    maxPrice ? params.set("maxPrice", maxPrice) : params.delete("maxPrice");

    router.push(`/properties?${params.toString()}`);
    setOpen(false);
  }

  function clearFilters() {
    setProvince("");
    setType("");
    setMaxPrice("");
    router.push("/properties");
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8D8A5] bg-white px-4 py-2.5 text-sm font-semibold text-[#1B1B1B] shadow-sm transition hover:bg-[#FFF9E8]"
        >
          <SlidersHorizontal size={16} className="text-[#C9A227]" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C9A227] text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition hover:text-[#1B1B1B]"
          >
            <X size={14} />
            Clear filters
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-[calc(100vw-2rem)] max-w-sm rounded-2xl border border-[#E8D8A5] bg-white p-5 shadow-xl sm:w-96">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Province
              </label>
              <select
                value={province}
                onChange={(event) => setProvince(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-[#1B1B1B] focus:border-[#C9A227] focus:outline-none"
              >
                <option value="">Any province</option>
                {PROVINCES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Property type
              </label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-[#1B1B1B] focus:border-[#C9A227] focus:outline-none"
              >
                <option value="">Any type</option>
                {PROPERTY_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Max price (R per month)
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="e.g. 8000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-[#1B1B1B] focus:border-[#C9A227] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={applyFilters}
              className="w-full rounded-xl bg-[#C9A227] py-3 text-sm font-bold text-white transition hover:bg-[#A67C00]"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}