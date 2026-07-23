import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/getProperties";
import Link from "next/link";

export default async function FeaturedProperties() {
  const properties = await getProperties();

  // Show featured properties first.
  // If none are featured, show the latest 6.
  const featured = properties.filter((p: any) => p.featured);

  const displayProperties =
    featured.length > 0 ? featured : properties.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C9A227]">
            Featured
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[#1B1B1B]">
            Handpicked homes you will love
          </h2>

          <p className="mt-3 text-lg text-slate-600">
            Browse a curated mix of rooms, apartments, and houses across South Africa.
          </p>
        </div>

        <Link
          href="/properties"
          className="inline-flex items-center gap-2 font-semibold text-[#C9A227] transition hover:gap-3"
        >
          View all properties
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="rounded-[32px] border border-[#F0E7CF] bg-[#FFFDF8] p-4 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.15)] md:p-6">
        <div className="grid gap-8 md:grid-cols-3">
          {displayProperties.map((property: any) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              images={
                property.image_urls?.length
                  ? property.image_urls
                  : [
                      property.image_url ||
                        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
                    ]
              }
              price={property.price}
              title={property.title}
              location={`${property.city}, ${property.province}`}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              parking={property.parking}
              featured={property.featured}
              verified={property.verified}
            />
          ))}
        </div>
      </div>
    </section>
  );
}