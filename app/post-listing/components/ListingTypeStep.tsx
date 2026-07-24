"use client";

import { Home, BadgeDollarSign } from "lucide-react";

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
    <div className="rounded-3xl bg-white p-10 shadow-xl">

      <h2 className="text-3xl font-bold text-center">
        What would you like to list?
      </h2>

      <p className="mt-3 text-center text-slate-500">
        Choose whether you're renting out or selling your property.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">

        <button
          onClick={() => setListingType("rent")}
          className={`rounded-3xl border-2 p-10 transition ${
            listingType === "rent"
              ? "border-[#C9A227] bg-[#FFF8E1]"
              : "border-gray-200 hover:border-[#C9A227]"
          }`}
        >
          <Home
            size={70}
            className="mx-auto text-[#C9A227]"
          />

          <h3 className="mt-6 text-2xl font-bold">
            For Rent
          </h3>

          <p className="mt-2 text-slate-500">
            Rooms, apartments, houses and more.
          </p>
        </button>

        <button
          onClick={() => setListingType("sale")}
          className={`rounded-3xl border-2 p-10 transition ${
            listingType === "sale"
              ? "border-[#C9A227] bg-[#FFF8E1]"
              : "border-gray-200 hover:border-[#C9A227]"
          }`}
        >
          <BadgeDollarSign
            size={70}
            className="mx-auto text-[#C9A227]"
          />

          <h3 className="mt-6 text-2xl font-bold">
            For Sale
          </h3>

          <p className="mt-2 text-slate-500">
            Houses, land, commercial property and more.
          </p>
        </button>

      </div>

      <button
        disabled={!listingType}
        onClick={onNext}
        className="mt-12 w-full rounded-2xl bg-[#C9A227] py-4 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#A67C00]"
      >
        Continue →
      </button>

    </div>
  );
}