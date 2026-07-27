"use client";

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
  images,
  onBack,
  onPublish,
}: Props) {
  return (
    <div className="rounded-[32px] border border-[#E8D9A8] bg-white p-10 shadow-xl">

      <h2 className="text-4xl font-black text-[#111111] text-center">
        Review Your Listing
      </h2>

      <p className="mt-3 mb-10 text-center text-[#555555]">
        Make sure everything looks correct before publishing.
      </p>

      <div className="space-y-8">

        {/* Basic Information */}
        <div>
          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Basic Information
          </h3>

          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6 space-y-3">

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

        {/* Location */}
        <div>

          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Location
          </h3>

          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6 space-y-2">

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

          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6 text-[#111111] text-lg font-medium">

            {title}

          </div>

        </div>

        {/* Description */}
        <div>

          <h3 className="mb-3 text-2xl font-bold text-[#111111]">
            Description
          </h3>

          <div className="rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-6 whitespace-pre-wrap text-[#111111] leading-7">

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

              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Property ${index + 1}`}
                className="h-40 w-full rounded-2xl border border-[#E8D9A8] object-cover shadow-md"
              />

            ))}

          </div>

        </div>

      </div>

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
          Publish Listing
        </button>

      </div>

    </div>
  );
}