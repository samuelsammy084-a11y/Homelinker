"use client";

import { useState } from "react";
import Link from "next/link";

type PropertyCardProps = {
  id: number;
  images: string[];
  price: number;
  title: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  featured?: boolean;
  verified?: boolean;
};

export default function PropertyCard({
  id,
  images,
  price,
  title,
  location,
  bedrooms,
  bathrooms,
  parking,
  featured,
  verified,
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

      {/* IMAGE */}
      <div className="relative overflow-hidden">

        <img
          src={
            images[currentImage] ||
            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d"
          }
          alt={title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Featured */}
        <div className="absolute top-4 left-4 flex gap-2">

          {featured && (
            <span className="rounded-full bg-[#C9A227] px-3 py-1 text-xs font-bold text-white shadow">
              ⭐ Featured
            </span>
          )}

          {verified && (
            <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">
              ✔ Verified
            </span>
          )}

        </div>

        {/* Image Count */}
        <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-black shadow">
          📷 {images.length}
        </div>

        {/* Previous */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl shadow transition hover:scale-110"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl shadow transition hover:scale-110"
            >
              ›
            </button>
          </>
        )}

      </div>

      {/* CONTENT */}

      <div className="p-6">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-3xl font-extrabold text-[#C9A227]">
              R{price.toLocaleString("en-ZA")}
            </p>

            <p className="text-sm text-gray-500">
              per month
            </p>

          </div>

        </div>

        <h2 className="mt-5 line-clamp-1 text-2xl font-bold text-[#1B1B1B]">
          {title}
        </h2>

        <p className="mt-2 line-clamp-1 text-gray-600">
          📍 {location}
        </p>

        {/* FEATURES */}

        <div className="mt-6 grid grid-cols-3 gap-3">

          <div className="rounded-xl bg-[#F8F6F1] py-3 text-center">

            <p className="text-2xl">🛏</p>

            <p className="mt-1 font-bold text-[#1B1B1B]">
              {bedrooms}
            </p>

            <p className="text-xs text-gray-500">
              Beds
            </p>

          </div>

          <div className="rounded-xl bg-[#F8F6F1] py-3 text-center">

            <p className="text-2xl">🛁</p>

            <p className="mt-1 font-bold text-[#1B1B1B]">
              {bathrooms}
            </p>

            <p className="text-xs text-gray-500">
              Baths
            </p>

          </div>

          <div className="rounded-xl bg-[#F8F6F1] py-3 text-center">

            <p className="text-2xl">🚗</p>

            <p className="mt-1 font-bold text-[#1B1B1B]">
              {parking}
            </p>

            <p className="text-xs text-gray-500">
              Parking
            </p>

          </div>

        </div>

        <Link
          href={`/properties/${id}`}
          className="mt-7 block rounded-xl bg-[#C9A227] py-4 text-center text-lg font-bold text-white transition-all duration-300 hover:bg-[#A67C00] hover:shadow-lg"
        >
          View Property →
        </Link>

      </div>

    </div>
  );
}