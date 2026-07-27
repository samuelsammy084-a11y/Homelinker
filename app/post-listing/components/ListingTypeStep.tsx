"use client";

import { Home, BadgeDollarSign, CheckCircle2 } from "lucide-react";

type Props = {
  listingType: "rent" | "sale" | "";
  setListingType: (type: "rent" | "sale") => void;
  onNext: () => void;
};

export default function ListingTypeStep({
  listingType,
  setListingType,
  onNext,
}: Props) {
  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <div className="text-center">

        <h2 className="text-4xl font-black text-[#111111]">
          What would you like to list?
        </h2>

        <p className="mt-3 text-lg text-[#555555]">
          Choose the type of listing you want to create.
        </p>

      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">

        {/* RENT */}

        <button
          type="button"
          onClick={() => setListingType("rent")}
          className={`group relative overflow-hidden rounded-[28px] border-2 p-10 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
            listingType === "rent"
              ? "border-[#C9A227] bg-[#FFF9E8]"
              : "border-[#E8D9A8] bg-white"
          }`}
        >

          {listingType === "rent" && (
            <CheckCircle2
              size={34}
              className="absolute right-6 top-6 text-[#C9A227]"
            />
          )}

          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF3CF] transition-all group-hover:scale-110">

            <Home
              size={52}
              className="text-[#C9A227]"
            />

          </div>

          <h3 className="text-3xl font-black text-[#111111]">
            For Rent
          </h3>

          <p className="mt-3 text-[#555555]">
            List rooms, apartments, townhouses and houses available for monthly rental.
          </p>

          <div className="mt-8 space-y-2">

            <div className="text-[#444444]">✔ Monthly Rentals</div>

            <div className="text-[#444444]">✔ Deposit Information</div>

            <div className="text-[#444444]">✔ Lease Details</div>

          </div>

        </button>

        {/* SALE */}

        <button
          type="button"
          onClick={() => setListingType("sale")}
          className={`group relative overflow-hidden rounded-[28px] border-2 p-10 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
            listingType === "sale"
              ? "border-[#C9A227] bg-[#FFF9E8]"
              : "border-[#E8D9A8] bg-white"
          }`}
        >

          {listingType === "sale" && (
            <CheckCircle2
              size={34}
              className="absolute right-6 top-6 text-[#C9A227]"
            />
          )}

          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF3CF] transition-all group-hover:scale-110">

            <BadgeDollarSign
              size={52}
              className="text-[#C9A227]"
            />

          </div>

          <h3 className="text-3xl font-black text-[#111111]">
            For Sale
          </h3>

          <p className="mt-3 text-[#555555]">
            Sell houses, apartments, land or commercial properties across South Africa.
          </p>

          <div className="mt-8 space-y-2">

            <div className="text-[#444444]">✔ Selling Price</div>

            <div className="text-[#444444]">✔ Property Condition</div>

            <div className="text-[#444444]">✔ Rates & Taxes</div>

          </div>

        </button>

      </div>

      <div className="mt-12 flex justify-end">

        <button
          type="button"
          disabled={!listingType}
          onClick={onNext}
          className="rounded-2xl bg-[#C9A227] px-10 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-[#A67C00] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}