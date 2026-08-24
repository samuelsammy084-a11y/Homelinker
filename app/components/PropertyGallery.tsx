"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

type Props = {
  images: string[];
  altText?: string;
};

export default function PropertyGallery({
  images,
  altText = "Property image",
}: Props) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previous = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const openLightboxAt = (index: number) => {
    setCurrent(index);
    setLightboxOpen(true);
  };

  // Keyboard navigation while the lightbox is open
  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, next, previous]);

  function handleTouchStart(event: React.TouchEvent) {
    setTouchStartX(event.touches[0].clientX);
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX == null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(deltaX) > 40) {
      deltaX > 0 ? previous() : next();
    }

    setTouchStartX(null);
  }

  const thumbnails = images.slice(1, 5);
  const remainingCount = images.length - 5;

  return (
    <div>
      {/* ---------- DESKTOP GRID (Property24-style) ---------- */}
      <div className="hidden gap-2 sm:grid sm:grid-cols-4 sm:grid-rows-2 sm:overflow-hidden sm:rounded-2xl">
        {/* Main large image */}
        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          className="relative col-span-2 row-span-2 aspect-[4/3] w-full overflow-hidden"
        >
          <Image
            src={images[0]}
            alt={altText}
            fill
            sizes="50vw"
            className="object-cover transition duration-300 hover:brightness-95"
            priority
          />
        </button>

        {/* Up to 4 smaller tiles */}
        {thumbnails.map((image, index) => {
          const isLastVisible =
            index === thumbnails.length - 1 && remainingCount > 0;

          return (
            <button
              key={index}
              type="button"
              onClick={() => openLightboxAt(index + 1)}
              className="relative col-span-1 row-span-1 aspect-[4/3] w-full overflow-hidden"
            >
              <Image
                src={image}
                alt={`${altText} — photo ${index + 2}`}
                fill
                sizes="25vw"
                className="object-cover transition duration-300 hover:brightness-95"
              />

              {isLastVisible && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-bold text-white">
                  +{remainingCount + 1} photos
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* "View all photos" button, desktop */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          className="mt-3 hidden items-center gap-2 rounded-xl border border-[#E8D8A5] bg-white px-4 py-2 text-sm font-semibold text-[#1B1B1B] shadow-sm transition hover:bg-[#F8F6F1] sm:inline-flex"
        >
          <Expand size={16} />
          View all {images.length} photos
        </button>
      )}

      {/* ---------- MOBILE CAROUSEL ---------- */}
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() => openLightboxAt(current)}
          className="absolute inset-0 z-0"
          aria-label="View full photo"
        >
          <Image
            src={images[current]}
            alt={altText}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.slice(0, 8).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  current === index ? "w-5 bg-white" : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* ---------- LIGHTBOX ---------- */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <span className="text-sm font-medium text-white/70">
              {current + 1} / {images.length}
            </span>

            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label="Close full-screen view"
            >
              <X size={22} />
            </button>
          </div>

          <div
            className="relative flex-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={images[current]}
              alt={`${altText} — photo ${current + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-5"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-5"
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail rail */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:justify-center sm:px-6">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    current === index
                      ? "border-[#C9A227]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${altText} thumbnail ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}