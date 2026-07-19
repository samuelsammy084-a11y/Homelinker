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
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-1">

      <div className="relative">

        <img
          src={
            images[currentImage] ||
            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d"
          }
          alt={title}
          className="w-full h-64 object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg text-xl"
            >
              ‹
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg text-xl"
            >
              ›
            </button>
          </>
        )}

        <div className="absolute top-4 left-4 flex gap-2">
          {featured && (
            <span className="bg-[#C9A227] text-white px-3 py-1 rounded-full text-sm font-semibold">
              ⭐ Featured
            </span>
          )}

          {verified && (
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              ✔ Verified
            </span>
          )}
        </div>

        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
          📷 {images.length}
        </div>
      </div>

      <div className="p-6">

        <p className="text-[#C9A227] text-3xl font-bold">
          R{price.toLocaleString("en-ZA")}
          <span className="text-lg font-medium text-gray-700">
            {" "}
            / month
          </span>
        </p>

        <h2 className="text-2xl font-bold text-[#1B1B1B] mt-3">
          {title}
        </h2>

        <p className="text-gray-700 mt-2 text-lg">
          📍 {location}
        </p>

        <div className="flex justify-between mt-6 text-[#1B1B1B] font-semibold border-t pt-5">
          <span>🛏 {bedrooms}</span>
          <span>🛁 {bathrooms}</span>
          <span>🚗 {parking}</span>
        </div>

        <Link
          href={`/properties/${id}`}
          className="block mt-6 bg-[#C9A227] hover:bg-[#A67C00] text-white text-center py-3 rounded-xl font-bold transition"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}