"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  altText?: string;
};

export default function PropertyGallery({ images, altText = "Property image" }: Props) {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const previous = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div>

      <div className="relative h-[550px] w-full overflow-hidden rounded-3xl shadow-xl">
        <Image
          src={images[current]}
          alt={altText}
          fill
          sizes="(max-width: 1024px) 100vw, 1000px"
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={previous}
              className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-12 h-12 text-2xl shadow"
            >
              ←
            </button>

            <button
              onClick={next}
              className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/80 rounded-full w-12 h-12 text-2xl shadow"
            >
              →
            </button>
          </>
        )}

      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4 mt-6">

          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              className={`relative h-28 w-full overflow-hidden rounded-xl border-4 ${
                current === index
                  ? "border-[#C9A227]"
                  : "border-transparent"
              }`}
            >
              <Image
                src={image}
                alt={`${altText} — photo ${index + 1}`}
                fill
                sizes="150px"
                className="object-cover"
              />
            </button>
          ))}

        </div>
      )}

    </div>
  );
}