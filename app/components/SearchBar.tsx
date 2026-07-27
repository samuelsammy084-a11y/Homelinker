"use client";

type SearchBarProps = {
  listingType: "rent" | "sale";

  province: string;
  city: string;
  type: string;

  minPrice: number;
  maxPrice: number;

  setListingType: (value: "rent" | "sale") => void;

  setProvince: (value: string) => void;
  setCity: (value: string) => void;
  setType: (value: string) => void;

  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;

  onSearch?: () => void;
};

export default function SearchBar({
  listingType,

  province,
  city,
  type,

  minPrice,
  maxPrice,

  setListingType,

  setProvince,
  setCity,
  setType,

  setMinPrice,
  setMaxPrice,

  onSearch,
}: SearchBarProps) {
  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 mb-10">

      {/* RENT / SALE */}

      <div className="flex gap-4 mb-6">

        <button
          onClick={() => setListingType("rent")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            listingType === "rent"
              ? "bg-[#C9A227] text-white"
              : "bg-gray-100 text-black hover:bg-gray-200"
          }`}
        >
          🏠 For Rent
        </button>

        <button
          onClick={() => setListingType("sale")}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            listingType === "sale"
              ? "bg-[#C9A227] text-white"
              : "bg-gray-100 text-black hover:bg-gray-200"
          }`}
        >
          🏡 For Sale
        </button>

      </div>

      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-4">

        {/* Province */}

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

        {/* City */}

        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={inputClass}
        />

        {/* Property Type */}

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={inputClass}
        >
          <option value="">All Property Types</option>

          <option>Room</option>
          <option>Bachelor Flat</option>
          <option>Apartment</option>
          <option>Townhouse</option>
          <option>House</option>
          <option>Cottage</option>
          <option>Duplex</option>
          <option>Farm</option>
          <option>Vacant Land</option>
          <option>Commercial Property</option>
          <option>Industrial Property</option>

        </select>

        {/* Minimum Price */}

        <input
          type="number"
          placeholder={
            listingType === "rent"
              ? "Minimum Rent"
              : "Minimum Price"
          }
          value={minPrice || ""}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className={inputClass}
        />

        {/* Maximum Price */}

        <input
          type="number"
          placeholder={
            listingType === "rent"
              ? "Maximum Rent"
              : "Maximum Price"
          }
          value={maxPrice || ""}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className={inputClass}
        />

        {/* Search */}

        <button
          onClick={onSearch}
          className="bg-[#C9A227] hover:bg-[#A67C00] text-white rounded-xl font-bold px-6 transition-all"
        >
          🔍 Search
        </button>

      </div>

    </div>
  );
}