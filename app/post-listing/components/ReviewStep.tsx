"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";

type Props = {
  listingType: string;
  propertyType: string;

  title: string;
  description: string;

  province: string;
  city: string;
  suburb: string;
  address: string;

  price: string;

  bedrooms: string;
  bathrooms: string;
  parking: string;

  phoneNumber: string;

  images: File[];

  onBack: () => void;
  onPublish: () => void;
};

export default function ReviewStep({
  listingType,
  propertyType,
  title,
  description,
  province,
  city,
  suburb,
  address,
  price,
  bedrooms,
  bathrooms,
  parking,
  phoneNumber,
  images,
  onBack,
  onPublish,
}: Props) {
  const imageUrls = useMemo(
    () => images.map((image) => URL.createObjectURL(image)),
    [images]
  );

  useEffect(() => {
    return () => {
      imageUrls.forEach(URL.revokeObjectURL);
    };
  }, [imageUrls]);

  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">
      <h2 className="text-center text-4xl font-black text-[#111111]">
        Review Your Listing
      </h2>

      <p className="mb-10 mt-3 text-center text-[#555555]">
        Make sure everything looks correct before continuing.
      </p>

      <div className="space-y-8">
        {/* Basic Information */}
        <div>
          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Basic Information
          </h3>

          <div className="space-y-3 rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6">
            <p className="text-[#111111]">
              <span className="font-bold">Listing:</span> {listingType}
            </p>

            <p className="text-[#111111]">
              <span className="font-bold">Property:</span> {propertyType}
            </p>

            <p className="text-[#111111]">
              <span className="font-bold">Price:</span> R {price}
            </p>

            <p className="text-[#111111]">
              <span className="font-bold">Bedrooms:</span> {bedrooms}
            </p>

            <p className="text-[#111111]">
              <span className="font-bold">Bathrooms:</span> {bathrooms}
            </p>

            <p className="text-[#111111]">
              <span className="font-bold">Parking:</span> {parking}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Contact Information
          </h3>

          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6">
            <p className="text-[#111111]">
              <span className="font-bold">Phone Number:</span>{" "}
              {phoneNumber || "Not provided"}
            </p>

            <p className="mt-2 text-sm text-[#666666]">
              This number will be used for the WhatsApp contact button on your
              listing.
            </p>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Location
          </h3>

          <div className="space-y-2 rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6">
            <p className="text-[#111111]">{address}</p>
            <p className="text-[#111111]">{suburb}</p>
            <p className="text-[#111111]">{city}</p>
            <p className="text-[#111111]">{province}</p>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Title
          </h3>

          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6 text-lg font-medium text-[#111111]">
            {title}
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Description
          </h3>

          <div className="whitespace-pre-wrap rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6 leading-7 text-[#111111]">
            {description}
          </div>
        </div>

        {/* Photos */}
        <div>
          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Photos ({images.length})
          </h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-40 w-full overflow-hidden rounded-2xl border border-[#E8D9A8] shadow-md"
              >
                <Image
                  src={imageUrls[index]}
                  alt={`Property ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-12 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-2xl border-2 border-[#C9A227] px-8 py-4 font-semibold text-[#C9A227] transition hover:bg-[#FFF6D8]"
        >
          ← Back
        </button>

        <button
          onClick={onPublish}
          className="rounded-2xl bg-[#C9A227] px-10 py-4 font-bold text-white transition hover:bg-[#A67C00]"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}