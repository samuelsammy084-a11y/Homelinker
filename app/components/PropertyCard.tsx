"use client";

import { useState } from "react";
import Link from "next/link";
import { BedDouble, Bath, CarFront, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

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
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_12px_40px_-20px_rgba(17,17,17,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(17,17,17,0.35)]">
      <div className="relative overflow-hidden">
        <img
          src={images[currentImage] || "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d"}
          alt={title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {featured && (
            <span className="rounded-full bg-[#C9A227] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow">
              Featured
            </span>
          )}
          {verified && (
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow">
              Verified
            </span>
          )}
        </div>

        <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-[#1B1B1B] shadow">
          {images.length} photos
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1B1B1B] shadow transition hover:scale-110"
              aria-label="Show previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1B1B1B] shadow transition hover:scale-110"
              aria-label="Show next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-3xl font-black text-[#C9A227]">R{price.toLocaleString("en-ZA")}</p>
            <p className="mt-1 text-sm text-slate-500">per month</p>
          </div>
        </div>

        <h2 className="mt-5 line-clamp-1 text-xl font-bold text-[#1B1B1B]">{title}</h2>

        <p className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={14} className="text-[#C9A227]" />
          {location}
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[#F8F6F1] py-3 text-center">
            <BedDouble size={16} className="mx-auto text-[#C9A227]" />
            <p className="mt-2 font-bold text-[#1B1B1B]">{bedrooms}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Beds</p>
          </div>
          <div className="rounded-2xl bg-[#F8F6F1] py-3 text-center">
            <Bath size={16} className="mx-auto text-[#C9A227]" />
            <p className="mt-2 font-bold text-[#1B1B1B]">{bathrooms}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Baths</p>
          </div>
          <div className="rounded-2xl bg-[#F8F6F1] py-3 text-center">
            <CarFront size={16} className="mx-auto text-[#C9A227]" />
            <p className="mt-2 font-bold text-[#1B1B1B]">{parking}</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Parking</p>
          </div>
        </div>

        <Link
          href={`/properties/${id}`}
          className="mt-7 block rounded-2xl bg-[#C9A227] py-3.5 text-center text-base font-semibold text-white transition-all duration-300 hover:bg-[#A67C00] hover:shadow-lg"
        >
          View listing
        </Link>
      </div>
    </div>
  );
}