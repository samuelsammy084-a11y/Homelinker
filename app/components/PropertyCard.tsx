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
  MessageCircle,
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
  phoneNumber?: string | null;
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
  phoneNumber,
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);

  const safeImages =
    images?.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
        ];

  const listingUrl = slug
    ? `/properties/${slug}`
    : `/properties/${id}`;

  /*
   * Convert South African phone numbers into
   * WhatsApp international format.
   *
   * Examples:
   * 082 123 4567 -> 27821234567
   * 0821234567   -> 27821234567
   * +27 82 123 4567 -> 27821234567
   */
  function formatWhatsAppNumber(
    phone: string
  ): string | null {
    const cleaned = phone.replace(/\D/g, "");

    if (!cleaned) return null;

    if (cleaned.startsWith("27")) {
      return cleaned;
    }

    if (cleaned.startsWith("0")) {
      return `27${cleaned.slice(1)}`;
    }

    if (cleaned.length === 9) {
      return `27${cleaned}`;
    }

    return null;
  }

  function openWhatsApp(
    event: React.MouseEvent
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!phoneNumber) {
      alert(
        "The owner has not provided a WhatsApp number for this property."
      );
      return;
    }

    const whatsappNumber =
      formatWhatsAppNumber(phoneNumber);

    if (!whatsappNumber) {
      alert(
        "The WhatsApp number for this property is not valid."
      );
      return;
    }

    const message = encodeURIComponent(
      `Hi, I found your property "${title}" on HomeLinker and I'm interested in it. Is it still available?`
    );

    window.open(
      `https://wa.me/${whatsappNumber}?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const nextImage = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === safeImages.length - 1
        ? 0
        : prev + 1
    );
  };

  const prevImage = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImage((prev) =>
      prev === 0
        ? safeImages.length - 1
        : prev - 1
    );
  };

  return (
    <article className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_-20px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-22px_rgba(0,0,0,0.3)]">

      {/* IMAGE */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">

        <Image
          src={safeImages[currentImage]}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          unoptimized
        />

        <Link
          href={listingUrl}
          className="absolute inset-0 z-0"
          aria-label={`View ${title}`}
        >
          <span className="sr-only">
            View {title}
          </span>
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        {/* BADGES */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">

          {featured && (
            <span className="rounded-full bg-[#C9A227] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg">
              Featured
            </span>
          )}

          {verified && (
            <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg">
              Verified
            </span>
          )}

        </div>

        {/* PHOTO COUNT */}
        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/65 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          {safeImages.length}{" "}
          {safeImages.length === 1
            ? "photo"
            : "photos"}
        </div>

        {/* IMAGE CONTROLS */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1B1B1B] shadow-lg transition hover:scale-110"
              aria-label="Show previous image"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1B1B1B] shadow-lg transition hover:scale-110"
              aria-label="Show next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* IMAGE DOTS */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">

            {safeImages
              .slice(0, 5)
              .map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    setCurrentImage(index);
                  }}
                  aria-label={`Show photo ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImage === index
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}

          </div>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5">

        {/* PRICE */}
        <div>
          <p className="text-2xl font-black leading-none text-[#C9A227]">
            R{Number(price).toLocaleString("en-ZA")}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            per month
          </p>
        </div>

        {/* TITLE */}
        <h2 className="mt-4 line-clamp-2 min-h-[48px] text-lg font-bold leading-6 text-[#1B1B1B]">
          {title}
        </h2>

        {/* LOCATION */}
        <p className="mt-2 flex min-w-0 items-center gap-1.5 text-sm leading-5 text-slate-600">

          <MapPin
            size={15}
            className="shrink-0 text-[#C9A227]"
          />

          <span className="line-clamp-1">
            {location}
          </span>

        </p>

        {/* FEATURES */}
        <div className="mt-5 grid grid-cols-3 gap-2">

          <div className="rounded-xl bg-[#F8F6F1] px-2 py-3 text-center">
            <BedDouble
              size={17}
              className="mx-auto text-[#C9A227]"
            />

            <p className="mt-1 text-sm font-bold text-[#1B1B1B]">
              {bedrooms}
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Beds
            </p>
          </div>

          <div className="rounded-xl bg-[#F8F6F1] px-2 py-3 text-center">
            <Bath
              size={17}
              className="mx-auto text-[#C9A227]"
            />

            <p className="mt-1 text-sm font-bold text-[#1B1B1B]">
              {bathrooms}
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Baths
            </p>
          </div>

          <div className="rounded-xl bg-[#F8F6F1] px-2 py-3 text-center">
            <CarFront
              size={17}
              className="mx-auto text-[#C9A227]"
            />

            <p className="mt-1 text-sm font-bold text-[#1B1B1B]">
              {parking}
            </p>

            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Parking
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="mt-5 grid grid-cols-2 gap-2">

          {/* VIEW LISTING */}
          <Link
            href={listingUrl}
            className="flex items-center justify-center rounded-xl bg-[#C9A227] py-3 text-sm font-bold text-white transition hover:bg-[#A67C00] hover:shadow-lg"
          >
            View listing
          </Link>

          {/* WHATSAPP */}
          <button
            type="button"
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-sm font-bold text-white transition hover:bg-[#1ebe5d] hover:shadow-lg"
          >
            <MessageCircle size={17} />
            WhatsApp
          </button>

        </div>

      </div>
    </article>
  );
}