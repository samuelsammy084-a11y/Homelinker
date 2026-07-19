"use client";

import { useState } from "react";

type Props = {
  images: string[];
};

export default function PropertyGallery({ images }: Props) {
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

      <div className="relative">

        <img
          src={images[current]}
          alt=""
          className="w-full h-[550px] object-cover rounded-3xl shadow-xl"
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
            <img
              key={index}
              src={image}
              onClick={() => setCurrent(index)}
              className={`h-28 w-full object-cover rounded-xl cursor-pointer border-4 ${
                current === index
                  ? "border-[#C9A227]"
                  : "border-transparent"
              }`}
            />
          ))}

        </div>
      )}

    </div>
  );
}