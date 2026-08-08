"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BedDouble,
  Bath,
  CarFront,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";

type PropertyCardProps = {
  id: number;
  slug?: string;
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
  slug,
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

  const safeImages =
    images?.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
        ];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );
  };

  return (
    <article className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[28px]">
      {/* IMAGE */}
      <div className="relative aspect-[1.05/1] overflow-hidden bg-slate-100 sm:aspect-[4/3]">
        <Link
          href={slug ? `/properties/${slug}` : `/properties/${id}`}
          className="absolute inset-0 z-0"
        >
          <Image
            src={safeImages[currentImage]}
            alt={title}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized
          />
        </Link>

        {/* BADGES */}
        <div className="absolute left-2.5 top-2.5 z-10 flex max-w-[85%] flex-wrap gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {featured && (
            <span className="rounded-full bg-[#C9A227] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-white shadow sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.15em]">
              Featured
            </span>
          )}

          {verified && (
            <span className="rounded-full bg-emerald-600 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-white shadow sm:px-3 sm:py-1.5 sm:text-[11px] sm:tracking-[0.15em]">
              Verified
            </span>
          )}
        </div>

        {/* PHOTO COUNT */}
        <div className="absolute bottom-2.5 right-2.5 z-10 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold text-[#1B1B1B] shadow backdrop-blur sm:bottom-4 sm:right-4 sm:px-3 sm:py-1.5 sm:text-sm">
          {safeImages.length} photos
        </div>

        {/* IMAGE CONTROLS */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1B1B1B] shadow transition hover:scale-110 sm:left-3 sm:h-9 sm:w-9"
              aria-label="Show previous image"
            >
              <ChevronLeft size={15} className="sm:h-[18px] sm:w-[18px]" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1B1B1B] shadow transition hover:scale-110 sm:right-3 sm:h-9 sm:w-9"
              aria-label="Show next image"
            >
              <ChevronRight size={15} className="sm:h-[18px] sm:w-[18px]" />
            </button>
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-2.5 sm:p-5 lg:p-6">
        {/* PRICE */}
        <div>
          <p className="text-lg font-black leading-tight text-[#C9A227] sm:text-2xl lg:text-3xl">
            R{price.toLocaleString("en-ZA")}
          </p>

          <p className="mt-0.5 text-[9px] text-slate-500 sm:mt-1 sm:text-sm">
            per month
          </p>
        </div>

        {/* TITLE */}
        <h2 className="mt-2 line-clamp-2 text-xs font-bold leading-4 text-[#1B1B1B] sm:mt-4 sm:text-lg sm:leading-6 lg:text-xl">
          {title}
        </h2>

        {/* LOCATION */}
        <p className="mt-1.5 flex min-w-0 items-center gap-1 text-[9px] leading-3 text-slate-600 sm:mt-2 sm:gap-2 sm:text-sm sm:leading-5">
          <MapPin
            size={11}
            className="shrink-0 text-[#C9A227] sm:h-[14px] sm:w-[14px]"
          />

          <span className="line-clamp-1">{location}</span>
        </p>

        {/* FEATURES */}
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2.5">
          <div className="rounded-xl bg-[#F8F6F1] py-2 text-center sm:rounded-2xl sm:py-3">
            <BedDouble
              size={13}
              className="mx-auto text-[#C9A227] sm:h-4 sm:w-4"
            />

            <p className="mt-1 text-xs font-bold text-[#1B1B1B] sm:mt-2 sm:text-base">
              {bedrooms}
            </p>

            <p className="text-[7px] uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-[0.15em]">
              Beds
            </p>
          </div>

          <div className="rounded-xl bg-[#F8F6F1] py-2 text-center sm:rounded-2xl sm:py-3">
            <Bath
              size={13}
              className="mx-auto text-[#C9A227] sm:h-4 sm:w-4"
            />

            <p className="mt-1 text-xs font-bold text-[#1B1B1B] sm:mt-2 sm:text-base">
              {bathrooms}
            </p>

            <p className="text-[7px] uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-[0.15em]">
              Baths
            </p>
          </div>

          <div className="rounded-xl bg-[#F8F6F1] py-2 text-center sm:rounded-2xl sm:py-3">
            <CarFront
              size={13}
              className="mx-auto text-[#C9A227] sm:h-4 sm:w-4"
            />

            <p className="mt-1 text-xs font-bold text-[#1B1B1B] sm:mt-2 sm:text-base">
              {parking}
            </p>

            <p className="text-[7px] uppercase tracking-wide text-slate-500 sm:text-[10px] sm:tracking-[0.15em]">
              Parking
            </p>
          </div>
        </div>

        {/* VIEW LISTING */}
        <Link
          href={slug ? `/properties/${slug}` : `/properties/${id}`}
          className="mt-2.5 block rounded-xl bg-[#C9A227] py-2.5 text-center text-[10px] font-bold text-white transition-all duration-300 hover:bg-[#A67C00] hover:shadow-lg sm:mt-5 sm:rounded-2xl sm:py-3.5 sm:text-sm lg:text-base"
        >
          View listing
        </Link>
      </div>
    </article>
  );
}