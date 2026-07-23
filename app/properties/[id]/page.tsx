import { supabase } from "@/lib/supabase";
import Link from "next/link";
import PropertyGallery from "@/app/components/PropertyGallery";
import PropertyMap from "@/app/components/PropertyMap";
import FavoriteButton from "@/app/components/FavoriteButton";
import ReportListingButton from "@/app/components/ReportListingButton";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetails({ params }: Props) {
  const { id } = await params;

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold text-black">
          Property not found
        </h1>
      </main>
    );
  }

  const images =
    property.image_urls?.length
      ? property.image_urls
      : [
          property.image_url ||
            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
        ];

  return (
    <main className="min-h-screen bg-[#F8F6F1]">

      <div className="max-w-7xl mx-auto px-6 pt-10">

        <PropertyGallery images={images} />

      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-5xl font-bold text-black">
            {property.title}
          </h1>

          <div className="flex items-center gap-2">
            <FavoriteButton propertyId={property.id} className="rounded-full border border-[#E8D8A5] bg-white p-3 text-[#C9A227] shadow-sm transition hover:scale-105" />
            <ReportListingButton propertyId={property.id} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {property.verification_status === "verified" ? (
            <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
              ✔ Verified Property
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              ⏳ Pending Verification
            </span>
          )}

          {property.user_id ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              Verified Landlord
            </span>
          ) : null}
        </div>

        <p className="text-[#C9A227] text-4xl font-bold mt-4">
          R{property.price.toLocaleString("en-ZA")} / month
        </p>

        <div className="mt-3 space-y-1">
  <p className="text-lg font-medium text-[#1B1B1B]">
    📍 {property.street_address}
  </p>

  <p className="text-[#1B1B1B]">
    {property.suburb}
  </p>

  <p className="text-[#1B1B1B]">
    {property.city}, {property.province}
  </p>
</div>
        <div className="flex flex-wrap gap-8 mt-10 text-lg text-black">

          <div>🛏 {property.bedrooms} Bedrooms</div>

          <div>🛁 {property.bathrooms} Bathrooms</div>

          <div>🚗 {property.parking} Parking</div>

          <div>🏠 {property.property_type}</div>

        </div>

        <div className="mt-12">

          <h2 className="text-3xl font-bold text-black mb-4">
            Description
          </h2>

          <p className="text-black leading-8 text-lg">
            {property.description}
          </p>

        </div>

        <div className="flex flex-wrap gap-4 mt-12">

  <a
    href={`tel:${property.contact_number}`}
    className="bg-[#C9A227] text-white px-8 py-4 rounded-xl font-semibold"
  >
    📞 Call
  </a>

  <a
    href={`https://wa.me/27${property.contact_number.replace(
      /^0/,
      ""
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold"
  >
    💬 WhatsApp
  </a>

  <Link
    href="/properties"
    className="border border-black text-black px-8 py-4 rounded-xl"
  >
    ← Back
  </Link>

</div><p className="text-red-600 font-bold">
  Latitude: {String(property.latitude)} |
  Longitude: {String(property.longitude)}
</p>

{property.latitude && property.longitude && (
  <PropertyMap
    latitude={property.latitude}
    longitude={property.longitude}
    title={property.title}
  />
)}

</div>

</main>
  );
}