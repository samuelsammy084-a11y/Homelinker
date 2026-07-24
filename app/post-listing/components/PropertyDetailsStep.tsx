"use client";

type Props = {
  listingType: "rent" | "sale";

  price: string;
  setPrice: (v: string) => void;

  bedrooms: string;
  setBedrooms: (v: string) => void;

  bathrooms: string;
  setBathrooms: (v: string) => void;

  parking: string;
  setParking: (v: string) => void;

  furnished: boolean;
  setFurnished: (v: boolean) => void;

  petFriendly: boolean;
  setPetFriendly: (v: boolean) => void;

  deposit: string;
  setDeposit: (v: string) => void;

  availableFrom: string;
  setAvailableFrom: (v: string) => void;

  floorSize: string;
  setFloorSize: (v: string) => void;

  landSize: string;
  setLandSize: (v: string) => void;

  condition: string;
  setCondition: (v: string) => void;

  rates: string;
  setRates: (v: string) => void;

  levies: string;
  setLevies: (v: string) => void;

  onBack: () => void;
  onNext: () => void;
};

export default function PropertyDetailsStep({
  listingType,

  price,
  setPrice,

  bedrooms,
  setBedrooms,

  bathrooms,
  setBathrooms,

  parking,
  setParking,

  furnished,
  setFurnished,

  petFriendly,
  setPetFriendly,

  deposit,
  setDeposit,

  availableFrom,
  setAvailableFrom,

  floorSize,
  setFloorSize,

  landSize,
  setLandSize,

  condition,
  setCondition,

  rates,
  setRates,

  levies,
  setLevies,

  onBack,
  onNext,
}: Props) {
  const input =
    "w-full rounded-2xl border border-[#E8D9A8] bg-white p-4 text-[#111111] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20";

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <h2 className="text-center text-4xl font-black text-[#111111]">
        Property Details
      </h2>

      <p className="mt-3 mb-10 text-center text-[#555555]">
        Enter the details of your property.
      </p>

      <div className="grid gap-6 md:grid-cols-2">

        <input
          type="number"
          className={input}
          placeholder={listingType === "rent" ? "Monthly Rent (R)" : "Selling Price (R)"}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          className={input}
          placeholder="Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        />

        <input
          type="number"
          className={input}
          placeholder="Bathrooms"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
        />

        <input
          type="number"
          className={input}
          placeholder={listingType === "rent" ? "Parking" : "Garages"}
          value={parking}
          onChange={(e) => setParking(e.target.value)}
        />

        {listingType === "rent" && (
          <>
            <input
              className={input}
              placeholder="Deposit"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />

            <input
              type="date"
              className={input}
              value={availableFrom}
              onChange={(e) => setAvailableFrom(e.target.value)}
            />
          </>
        )}

        {listingType === "sale" && (
          <>
            <input
              className={input}
              placeholder="Floor Size (m²)"
              value={floorSize}
              onChange={(e) => setFloorSize(e.target.value)}
            />

            <input
              className={input}
              placeholder="Land Size (m²)"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
            />

            <select
              className={input}
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="">Property Condition</option>
              <option>Brand New</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Needs Renovation</option>
            </select>

            <input
              className={input}
              placeholder="Rates & Taxes (R)"
              value={rates}
              onChange={(e) => setRates(e.target.value)}
            />

            <input
              className={input}
              placeholder="Levies (R)"
              value={levies}
              onChange={(e) => setLevies(e.target.value)}
            />
          </>
        )}

      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">

        <label className="flex items-center justify-between rounded-2xl border border-[#E8D9A8] p-5">

          <span className="font-semibold text-[#111111]">
            Furnished
          </span>

          <input
            type="checkbox"
            checked={furnished}
            onChange={(e) => setFurnished(e.target.checked)}
            className="h-5 w-5 accent-[#C9A227]"
          />

        </label>

        <label className="flex items-center justify-between rounded-2xl border border-[#E8D9A8] p-5">

          <span className="font-semibold text-[#111111]">
            Pet Friendly
          </span>

          <input
            type="checkbox"
            checked={petFriendly}
            onChange={(e) => setPetFriendly(e.target.checked)}
            className="h-5 w-5 accent-[#C9A227]"
          />

        </label>

      </div>

      <div className="mt-12 flex justify-between">

        <button
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-8 py-4 font-semibold text-[#C9A227] hover:bg-[#FFF9E8]"
        >
          ← Back
        </button>

        <button
          onClick={onNext}
          className="rounded-2xl bg-[#C9A227] px-8 py-4 font-semibold text-white hover:bg-[#A67C00]"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}