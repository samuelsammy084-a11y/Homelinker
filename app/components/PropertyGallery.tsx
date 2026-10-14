"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  X,
  ChevronLeft,
  ChevronRight,
  Expand,
} from "lucide-react";

type Props = {
  images: string[];
  altText?: string;
};

export default function PropertyGallery({
  images,
  altText = "Property image",
}: Props) {
  const safeImages = images.filter(
    (image) =>
      typeof image === "string" &&
      image.trim().length > 0
  );

  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] =
    useState(false);

  const [touchStartX, setTouchStartX] =
    useState<number | null>(null);

  const imageCount = safeImages.length;

  const next = useCallback(() => {
    if (imageCount <= 1) return;

    setCurrent(
      (previous) =>
        (previous + 1) % imageCount
    );
  }, [imageCount]);

  const previous = useCallback(() => {
    if (imageCount <= 1) return;

    setCurrent((previousIndex) =>
      previousIndex === 0
        ? imageCount - 1
        : previousIndex - 1
    );
  }, [imageCount]);

  function openLightboxAt(index: number) {
    if (imageCount === 0) return;

    setCurrent(index);
    setLightboxOpen(true);
  }

  /*
   * Keep the selected image valid if
   * the image list changes.
   */
  useEffect(() => {
    if (imageCount === 0) {
      setCurrent(0);
      setLightboxOpen(false);
      return;
    }

    if (current >= imageCount) {
      setCurrent(0);
    }
  }, [current, imageCount]);

  /*
   * Keyboard navigation and body scroll
   * lock while the lightbox is open.
   */
  useEffect(() => {
    if (!lightboxOpen) return;

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowRight") {
        next();
      }

      if (event.key === "ArrowLeft") {
        previous();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [lightboxOpen, next, previous]);

  function handleTouchStart(
    event: React.TouchEvent
  ) {
    setTouchStartX(
      event.touches[0].clientX
    );
  }

  function handleTouchEnd(
    event: React.TouchEvent
  ) {
    if (touchStartX === null) return;

    const deltaX =
      event.changedTouches[0].clientX -
      touchStartX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        previous();
      } else {
        next();
      }
    }

    setTouchStartX(null);
  }

  /*
   * The first image is the large image.
   * Images 2-5 are shown as smaller tiles.
   */
  const thumbnails = safeImages.slice(1, 5);

  /*
   * Number of photos that are NOT visible
   * in the desktop five-image grid.
   */
  const remainingCount = Math.max(
    imageCount - 5,
    0
  );

  /*
   * Defensive fallback.
   *
   * Your property page already supplies
   * /og-image.jpg when a property has no
   * uploaded photos, but this protects the
   * component if it is reused elsewhere.
   */
  if (imageCount === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src="/og-image.jpg"
          alt={altText}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  return (
    <div>
      {/* DESKTOP GALLERY */}

      <div className="hidden gap-2 sm:grid sm:grid-cols-4 sm:grid-rows-2 sm:overflow-hidden sm:rounded-2xl">
        {/* Main image */}

        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          className="relative col-span-2 row-span-2 aspect-[4/3] w-full overflow-hidden bg-slate-100"
          aria-label="View main property photo"
        >
          <Image
            src={safeImages[0]}
            alt={altText}
            fill
            sizes="50vw"
            className="object-cover transition duration-300 hover:brightness-95"
            priority
          />
        </button>

        {/* Smaller images */}

        {thumbnails.map(
          (image, index) => {
            const imageIndex = index + 1;

            const isLastVisible =
              index ===
                thumbnails.length - 1 &&
              remainingCount > 0;

            return (
              <button
                key={`${image}-${imageIndex}`}
                type="button"
                onClick={() =>
                  openLightboxAt(imageIndex)
                }
                className="relative col-span-1 row-span-1 aspect-[4/3] w-full overflow-hidden bg-slate-100"
                aria-label={`View property photo ${
                  imageIndex + 1
                }`}
              >
                <Image
                  src={image}
                  alt={`${altText} — photo ${
                    imageIndex + 1
                  }`}
                  fill
                  sizes="25vw"
                  className="object-cover transition duration-300 hover:brightness-95"
                />

                {isLastVisible && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 px-3 text-center text-lg font-bold text-white">
                    +{remainingCount}{" "}
                    {remainingCount === 1
                      ? "photo"
                      : "photos"}
                  </div>
                )}
              </button>
            );
          }
        )}
      </div>

      {/* DESKTOP VIEW ALL */}

      {imageCount > 1 && (
        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          className="mt-3 hidden items-center gap-2 rounded-xl border border-[#E8D8A5] bg-white px-4 py-2 text-sm font-semibold text-[#1B1B1B] shadow-sm transition hover:bg-[#F8F6F1] sm:inline-flex"
        >
          <Expand size={16} />

          View all {imageCount}{" "}
          {imageCount === 1
            ? "photo"
            : "photos"}
        </button>
      )}

      {/* MOBILE CAROUSEL */}

      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 sm:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          type="button"
          onClick={() =>
            openLightboxAt(current)
          }
          className="absolute inset-0 z-0"
          aria-label="View full photo"
        >
          <Image
            src={safeImages[current]}
            alt={`${altText} — photo ${
              current + 1
            }`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </button>

        {/* Mobile previous/next buttons */}

        {imageCount > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previous();
              }}
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {/* Mobile indicators */}

        {imageCount > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex max-w-[55%] -translate-x-1/2 gap-1.5 overflow-hidden">
            {safeImages
              .slice(0, 8)
              .map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 shrink-0 rounded-full transition-all ${
                    current === index
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
          </div>
        )}

        {/* Mobile photo count */}

        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white">
          {current + 1} / {imageCount}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX */}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label="Property photo gallery"
        >
          {/* Lightbox header */}

          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <span className="text-sm font-medium text-white/70">
              {current + 1} / {imageCount}
            </span>

            <button
              type="button"
              onClick={() =>
                setLightboxOpen(false)
              }
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/10"
              aria-label="Close full-screen view"
            >
              <X size={22} />
            </button>
          </div>

          {/* Fullscreen image */}

          <div
            className="relative flex-1"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={safeImages[current]}
              alt={`${altText} — photo ${
                current + 1
              }`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            {imageCount > 1 && (
              <>
                <button
                  type="button"
                  onClick={previous}
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-5"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-5"
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* LIGHTBOX THUMBNAILS */}

          {imageCount > 1 && (
            <div className="flex gap-2 overflow-x-auto px-4 py-3 sm:justify-center sm:px-6">
              {safeImages.map(
                (image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() =>
                      setCurrent(index)
                    }
                    className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      current === index
                        ? "border-[#C9A227]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`View photo ${
                      index + 1
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${altText} thumbnail ${
                        index + 1
                      }`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}