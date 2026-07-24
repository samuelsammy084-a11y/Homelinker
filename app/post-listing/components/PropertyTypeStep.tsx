"use client";

import {
  Home,
  Building2,
  Bed,
  Warehouse,
  Trees,
  Landmark,
  CheckCircle2,
} from "lucide-react";

type Props = {
  listingType: "rent" | "sale";
  propertyType: string;
  setPropertyType: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function PropertyTypeStep({
  listingType,
  propertyType,
  setPropertyType,
  onBack,
  onNext,
}: Props) {
  const rentTypes = [
    {
      value: "room",
      title: "Room",
      desc: "Single rooms and shared accommodation",
      icon: Bed,
    },
    {
      value: "apartment",
      title: "Apartment",
      desc: "Flats and apartments",
      icon: Building2,
    },
    {
      value: "house",
      title: "House",
      desc: "Standalone family homes",
      icon: Home,
    },
    {
      value: "townhouse",
      title: "Townhouse",
      desc: "Modern townhouse living",
      icon: Landmark,
    },
    {
      value: "cottage",
      title: "Cottage",
      desc: "Garden cottages",
      icon: Trees,
    },
    {
      value: "commercial",
      title: "Commercial",
      desc: "Shops, offices and warehouses",
      icon: Warehouse,
    },
  ];

  const saleTypes = [
    {
      value: "house",
      title: "House",
      desc: "Standalone family homes",
      icon: Home,
    },
    {
      value: "apartment",
      title: "Apartment",
      desc: "Apartments and flats",
      icon: Building2,
    },
    {
      value: "townhouse",
      title: "Townhouse",
      desc: "Townhouses and estates",
      icon: Landmark,
    },
    {
      value: "commercial",
      title: "Commercial",
      desc: "Business property",
      icon: Warehouse,
    },
    {
      value: "land",
      title: "Land",
      desc: "Vacant stands and farms",
      icon: Trees,
    },
  ];

  const options = listingType === "rent" ? rentTypes : saleTypes;

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <div className="text-center">

        <h2 className="text-4xl font-black text-[#111111]">
          Select Property Type
        </h2>

        <p className="mt-3 text-lg text-[#555555]">
          Choose the property you're listing.
        </p>

      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {options.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setPropertyType(item.value)}
              className={`relative rounded-3xl border-2 p-8 text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                propertyType === item.value
                  ? "border-[#C9A227] bg-[#FFF9E8]"
                  : "border-[#E8D9A8] bg-white"
              }`}
            >
              {propertyType === item.value && (
                <CheckCircle2
                  className="absolute right-5 top-5 text-[#C9A227]"
                  size={28}
                />
              )}

              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3CF]">
                <Icon className="text-[#C9A227]" size={34} />
              </div>

              <h3 className="text-2xl font-bold text-[#111111]">
                {item.title}
              </h3>

              <p className="mt-2 text-[#555555]">
                {item.desc}
              </p>
            </button>
          );
        })}

      </div>

      <div className="mt-12 flex justify-between">

        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-8 py-4 font-semibold text-[#C9A227] hover:bg-[#FFF9E8]"
        >
          ← Back
        </button>

        <button
          type="button"
          disabled={!propertyType}
          onClick={onNext}
          className="rounded-2xl bg-[#C9A227] px-8 py-4 font-semibold text-white hover:bg-[#A67C00] disabled:opacity-40"
        >
          Continue →
        </button>

      </div>

    </div>
  );
}