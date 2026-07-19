"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-black placeholder:text-black outline-none transition-all duration-200 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  function handleSearch() {
    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (budget) params.set("maxPrice", budget);

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

        <h1 className="text-6xl md:text-7xl font-extrabold text-white">
          Find Your Perfect Place
        </h1>

        <p className="mt-6 text-xl text-gray-200">
          Connecting people to homes across South Africa.
        </p>

        <div className="mt-12 bg-white rounded-2xl shadow-2xl p-5">

          <div className="grid md:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="📍 Location"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            />

            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClass}
            >
              <option value="">Budget</option>
              <option value="2500">Up to R2 500</option>
              <option value="5000">Up to R5 000</option>
              <option value="10000">Up to R10 000</option>
              <option value="20000">Up to R20 000</option>
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClass}
            >
              <option value="">Property Type</option>
              <option>Room</option>
              <option>Bachelor</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Townhouse</option>
            </select>

            <button
              onClick={handleSearch}
              className="bg-[#C9A227] hover:bg-[#A67C00] text-white rounded-xl font-bold transition-all duration-300 hover:scale-105"
            >
              🔍 Search
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}