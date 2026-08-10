import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/getProperties";
import type { Property } from "@/app/types/property";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default async function FeaturedProperties() {
  const properties = await getProperties();

  /*
   * POPULAR LISTINGS
   *
   * If promoted listings exist, they get priority.
   * Otherwise, use the existing listings so the section
   * ALWAYS appears on the homepage.
   *
   * Maximum: 6 listings in the carousel.
   */
  const promotedProperties = properties.filter(
    (property: Property) => property.is_promoted === true
  );

  const popularListings =
    promotedProperties.length > 0
      ? promotedProperties.slice(0, 6)
      : properties.slice(0, 6);

  /*
   * Don't show an empty section if the database
   * genuinely has no properties at all.
   */
  if (popularListings.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A67C00]">
              <Sparkles size={14} />
              Popular Listings
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#1B1B1B] sm:text-4xl lg:text-5xl">
              Popular homes
              <span className="block text-[#C9A227]">
                people are looking at
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Discover popular properties available on HomeLinker.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#C9A227] transition hover:gap-3 sm:text-base"
          >
            View more
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* HORIZONTAL LISTINGS */}
        <div className="rounded-[28px] border border-[#F0E7CF] bg-[#FFFDF8] p-3 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.18)] sm:rounded-[36px] sm:p-6">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            
            {/* PROPERTY CARDS */}
            {popularListings.map((property: Property) => {
              const images =
                property.image_urls?.length
                  ? property.image_urls
                  : [
                      property.image_url ||
                        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
                    ];

              return (
                <div
                  key={property.id}
                  className="
                    w-[calc(33.333%-11px)]
                    min-w-[calc(33.333%-11px)]
                    shrink-0
                    snap-start
                    max-md:w-[calc(50%-8px)]
                    max-md:min-w-[calc(50%-8px)]
                    max-sm:w-[calc(50%-8px)]
                    max-sm:min-w-[calc(50%-8px)]
                  "
                >
                  <PropertyCard
                    id={property.id}
                    slug={property.slug}
                    images={images}
                    price={property.price}
                    title={property.title}
                    location={`${property.city}, ${property.province}`}
                    bedrooms={property.bedrooms ?? 0}
                    bathrooms={property.bathrooms ?? 0}
                    parking={property.parking ?? 0}
                    featured={property.featured}
                    verified={property.verified}
                  />
                </div>
              );
            })}

            {/* VIEW MORE CARD — ALWAYS AT THE END */}
            <div
              className="
                w-[calc(33.333%-11px)]
                min-w-[calc(33.333%-11px)]
                shrink-0
                snap-start
                max-md:w-[calc(50%-8px)]
                max-md:min-w-[calc(50%-8px)]
                max-sm:w-[calc(50%-8px)]
                max-sm:min-w-[calc(50%-8px)]
              "
            >
              <Link
                href="/properties"
                className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[30px] border-2 border-dashed border-[#C9A227]/40 bg-[#FFFDF8] p-8 text-center transition hover:border-[#C9A227] hover:bg-[#FFF9E8]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                  <ArrowRight size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-black text-[#1B1B1B]">
                  View More
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  See all available properties on HomeLinker.
                </p>

                <span className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 font-bold text-black">
                  View Properties
                  <ArrowRight size={17} />
                </span>
              </Link>
            </div>
          </div>

          {/* SWIPE HINT */}
          {popularListings.length > 3 && (
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              <span>←</span>
              Swipe right to see more
              <span>→</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}