"use client";

type SearchBarProps = {
  province: string;
  city: string;
  type: string;
  maxPrice: number;

  setProvince: (value: string) => void;
  setCity: (value: string) => void;
  setType: (value: string) => void;
  setMaxPrice: (value: number) => void;

  onSearch?: () => void;
};

export default function SearchBar({
  province,
  city,
  type,
  maxPrice,
  setProvince,
  setCity,
  setType,
  setMaxPrice,
  onSearch,
}: SearchBarProps) {
  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-black outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-10">

      <div className="grid md:grid-cols-5 gap-4">

        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className={inputClass}
        >
          <option value="">All Provinces</option>
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

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="">All Types</option>
          <option>Room</option>
          <option>Bachelor</option>
          <option>Apartment</option>
          <option>Townhouse</option>
          <option>House</option>
        </select>

        <input
          type="number"
          placeholder="Max Budget"
          value={maxPrice || ""}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className={inputClass}
        />

        <button
          onClick={onSearch}
          className="bg-[#C9A227] hover:bg-[#A67C00] text-white rounded-xl px-6 font-semibold transition-all"
        >
          🔍 Search
        </button>

      </div>

    </div>
  );
}