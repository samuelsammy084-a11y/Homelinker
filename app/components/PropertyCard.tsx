"use client";

import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

type Props = {
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
  status?: string | null;
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
  status,
  phoneNumber,
}: Props) {
  const [currentImage, setCurrentImage] = useState(0);

  const [contactPhone, setContactPhone] = useState<
    string | null
  >(phoneNumber ?? null);

  const safeImages =
    images?.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
        ];

  const listingUrl = slug
    ? `/properties/${slug}`
    : `/properties/${id}`;

  // Descriptive alt text — includes location and bed/bath count so image
  // search (Google Images) has real context to rank on, not just the title.
  const imageAlt =
    `${title} — ${bedrooms} bed, ${bathrooms} bath property in ${location}`;

  // --------------------------------------------------
  // Get WhatsApp number
  // --------------------------------------------------

  useEffect(() => {
    if (phoneNumber?.trim()) {
      setContactPhone(phoneNumber);
      return;
    }

    async function loadContactPhone() {
      const { data, error } = await supabase
        .from("properties")
        .select("contact_phone")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error(
          "HomeLinker WhatsApp number error:",
          error
        );
        return;
      }

      if (data?.contact_phone) {
        setContactPhone(data.contact_phone);
      }
    }

    void loadContactPhone();
  }, [id, phoneNumber]);

  // --------------------------------------------------
  // Format South African WhatsApp number
  // --------------------------------------------------

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

  // --------------------------------------------------
  // WhatsApp
  // --------------------------------------------------

  function openWhatsApp(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!contactPhone?.trim()) {
      alert(
        "The owner has not provided a WhatsApp number for this property."
      );
      return;
    }

    const whatsappNumber =
      formatWhatsAppNumber(contactPhone);

    if (!whatsappNumber) {
      alert(
        "The WhatsApp number for this property is not valid."
      );
      return;
    }

    const propertyUrl =
      `${window.location.origin}${listingUrl}`;

    const message = encodeURIComponent(
      `Hi, I found this property on HomeLinker and I'm interested in it. Is it still available?\n\n${propertyUrl}`
    );

    const whatsappUrl =
      `https://wa.me/${whatsappNumber}?text=${message}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function nextImage(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setCurrentImage((previous) =>
      previous === safeImages.length - 1
        ? 0
        : previous + 1
    );
  }

  function previousImage(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setCurrentImage((previous) =>
      previous === 0
        ? safeImages.length - 1
        : previous - 1
    );
  }

  return (
    <article className="group overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_10px_35px_-20px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-22px_rgba(0,0,0,0.3)]">

      {/* IMAGE */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Image
          src={safeImages[currentImage]}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${
            status === "sold" || status === "rented"
              ? "grayscale-[40%] brightness-75"
              : ""
          }`}
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

        {(status === "sold" || status === "rented") && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/35">
            <span className="rotate-[-8deg] rounded-lg border-2 border-white bg-black/80 px-5 py-1.5 text-sm font-black uppercase tracking-[0.2em] text-white shadow-lg">
              {status === "sold" ? "Sold" : "Rented"}
            </span>
          </div>
        )}

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
              onClick={previousImage}
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
            {safeImages.slice(0, 5).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
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
      <div className="p-3.5 sm:p-5">

        {/* PRICE */}
        <div>
          <p className="text-[22px] font-black leading-none text-[#C9A227] sm:text-2xl">
            R{Number(price).toLocaleString("en-ZA")}
          </p>

          <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">
            per month
          </p>
        </div>

        {/* TITLE */}
        <h2 className="mt-3 min-h-[44px] line-clamp-2 text-[16px] font-bold leading-5 text-[#1B1B1B] sm:mt-4 sm:min-h-[48px] sm:text-lg sm:leading-6">
          {title}
        </h2>

        {/* LOCATION */}
        <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[13px] leading-5 text-slate-600 sm:text-sm">
          <MapPin
            size={15}
            className="shrink-0 text-[#C9A227]"
          />

          <span className="line-clamp-1">
            {location}
          </span>
        </p>

        {/* FEATURES */}
        <div className="mt-4 grid grid-cols-3 gap-1.5 sm:mt-5 sm:gap-2">

          <div className="rounded-xl bg-[#F8F6F1] px-1.5 py-2.5 text-center sm:px-2 sm:py-3">
            <BedDouble
              size={16}
              className="mx-auto text-[#C9A227] sm:size-[17px]"
            />

            <p className="mt-1 text-sm font-bold text-[#1B1B1B]">
              {bedrooms}
            </p>

            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:text-[9px] sm:tracking-[0.12em]">
              Beds
            </p>
          </div>

          <div className="rounded-xl bg-[#F8F6F1] px-1.5 py-2.5 text-center sm:px-2 sm:py-3">
            <Bath
              size={16}
              className="mx-auto text-[#C9A227] sm:size-[17px]"
            />

            <p className="mt-1 text-sm font-bold text-[#1B1B1B]">
              {bathrooms}
            </p>

            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:text-[9px] sm:tracking-[0.12em]">
              Baths
            </p>
          </div>

          <div className="rounded-xl bg-[#F8F6F1] px-1.5 py-2.5 text-center sm:px-2 sm:py-3">
            <CarFront
              size={16}
              className="mx-auto text-[#C9A227] sm:size-[17px]"
            />

            <p className="mt-1 text-sm font-bold text-[#1B1B1B]">
              {parking}
            </p>

            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-500 sm:text-[9px] sm:tracking-[0.12em]">
              Parking
            </p>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="mt-4 grid grid-cols-1 gap-2 sm:mt-5">

          {/* VIEW LISTING */}
          <Link
            href={listingUrl}
            className="flex min-w-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-xl bg-[#C9A227] px-2 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#A67C00] hover:shadow-lg sm:py-3 sm:text-sm"
          >
            View listing
          </Link>

          {/* WHATSAPP */}
          <button
            type="button"
            onClick={openWhatsApp}
            className="flex min-w-0 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl bg-[#25D366] px-2 py-2.5 text-[12px] font-bold text-white transition hover:bg-[#1ebe5d] hover:shadow-lg sm:gap-2 sm:py-3 sm:text-sm"
          >
            <MessageCircle
              size={16}
              className="shrink-0 sm:size-[17px]"
            />

            <span className="truncate">
              WhatsApp
            </span>
          </button>

        </div>
      </div>
    </article>
  );
}