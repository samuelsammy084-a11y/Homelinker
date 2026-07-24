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

        <div>
          <h3 className="font-bold text-xl text-[#111111] mb-2">
            Basic Information
          </h3>

          <div className="rounded-2xl bg-[#FFF9E8] p-6 space-y-2">

            <p><b>Listing:</b> {listingType}</p>

            <p><b>Property:</b> {propertyType}</p>

            <p><b>Price:</b> R {price}</p>

            <p><b>Bedrooms:</b> {bedrooms}</p>

            <p><b>Bathrooms:</b> {bathrooms}</p>

            <p><b>Parking:</b> {parking}</p>

          </div>
        </div>

        <div>

          <h3 className="font-bold text-xl text-[#111111] mb-2">
            Location
          </h3>

          <div className="rounded-2xl bg-[#FFF9E8] p-6">

            <p>{address}</p>

            <p>{suburb}</p>

            <p>{city}</p>

            <p>{province}</p>

          </div>

        </div>

        <div>

          <h3 className="font-bold text-xl mb-2">
            Title
          </h3>

          <div className="rounded-2xl bg-[#FFF9E8] p-6">

            {title}

          </div>

        </div>

        <div>

          <h3 className="font-bold text-xl mb-2">
            Description
          </h3>

          <div className="rounded-2xl bg-[#FFF9E8] p-6 whitespace-pre-wrap">

            {description}

          </div>

        </div>

        <div>

          <h3 className="font-bold text-xl mb-3">
            Photos ({images.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {images.map((image, index) => (

              <img
                key={index}
                src={URL.createObjectURL(image)}
                className="h-40 w-full rounded-2xl object-cover"
              />

            ))}

          </div>

        </div>

      </div>

      <div className="mt-12 flex justify-between">

        <button
          onClick={onBack}
          className="rounded-2xl border border-[#C9A227] px-8 py-4 font-semibold text-[#C9A227]"
        >
          ← Back
        </button>

        <button
          onClick={onPublish}
          className="rounded-2xl bg-[#C9A227] px-10 py-4 font-bold text-white hover:bg-[#A67C00]"
        >
          Publish Listing
        </button>

      </div>

    </div>
  );
}