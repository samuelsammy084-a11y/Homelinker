import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/getProperties";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function FeaturedProperties() {
  const properties = await getProperties();
  const featured = properties.filter((p: any) => p.featured);
  const displayProperties = featured.length > 0 ? featured : properties.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-[#C9A227]">
            <Sparkles size={14} /> Featured
          </p>
          <h2 className="mt-4 text-3xl font-black text-[#1B1B1B] sm:text-4xl">
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
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="rounded-[36px] border border-[#F0E7CF] bg-[#FFFDF8] p-4 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.18)] md:p-6">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {displayProperties.map((property: any) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              images={
                property.image_urls?.length
                  ? property.image_urls
                  : [property.image_url || "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d"]
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