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
   * Paid/promoted properties are shown first.
   * These are the listings you will eventually
   * charge clients to promote.
   */
  const promotedProperties = properties.filter(
    (property: Property) => property.is_promoted === true
  );

  /*
   * Temporary fallback:
   *
   * If nobody has paid to promote a listing yet,
   * show the newest properties so the homepage
   * never looks empty.
   */
  const popularListings =
    promotedProperties.length > 0
      ? promotedProperties
      : properties.slice(0, 6);

  return (
    <section className="bg-[#F8F6F1] py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* SECTION HEADER */}
        <div className="mb-7 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A67C00] sm:text-xs">
              <Sparkles size={14} />
              Popular Listings
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#1B1B1B] sm:text-4xl lg:text-5xl">
              Popular
              <span className="block text-[#C9A227]">
                Listings
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Discover properties getting extra attention on HomeLinker.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#C9A227] transition hover:gap-3 sm:text-base"
          >
            View all properties
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* LISTINGS */}
        {popularListings.length > 0 ? (
          <div className="rounded-[28px] border border-[#F0E7CF] bg-[#FFFDF8] p-3 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.18)] sm:rounded-[36px] sm:p-6">

            {/* MOBILE */}
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:hidden">
              {popularListings.map((property: Property) => (
                <div
                  key={property.id}
                  className="w-[calc(50%-6px)] min-w-[calc(50%-6px)] shrink-0 snap-start"
                >
                  <PropertyCard
                    id={property.id}
                    slug={property.slug}
                    images={
                      property.image_urls?.length
                        ? property.image_urls
                        : [
                            property.image_url ||
                              "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
                          ]
                    }
                    price={Number(property.price) || 0}
                    title={property.title}
                    location={`${property.city}, ${property.province}`}
                    bedrooms={property.bedrooms ?? 0}
                    bathrooms={property.bathrooms ?? 0}
                    parking={property.parking ?? 0}
                    featured={property.featured}
                    verified={property.verified}
                  />
                </div>
              ))}
            </div>

            {/* MOBILE SWIPE HINT */}
            {popularListings.length > 2 && (
              <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:hidden">
                <span>←</span>
                Swipe to explore
                <span>→</span>
              </div>
            )}

            {/* TABLET / DESKTOP */}
            <div className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-3">
              {popularListings.map((property: Property) => (
                <div
                  key={property.id}
                  className="relative"
                >
                  {property.is_promoted && (
                    <div className="absolute left-3 top-3 z-30 inline-flex items-center gap-1 rounded-full bg-[#C9A227] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                      <Sparkles size={11} />
                      Promoted
                    </div>
                  )}

                  <PropertyCard
                    id={property.id}
                    slug={property.slug}
                    images={
                      property.image_urls?.length
                        ? property.image_urls
                        : [
                            property.image_url ||
                              "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
                          ]
                    }
                    price={Number(property.price) || 0}
                    title={property.title}
                    location={`${property.city}, ${property.province}`}
                    bedrooms={property.bedrooms ?? 0}
                    bathrooms={property.bathrooms ?? 0}
                    parking={property.parking ?? 0}
                    featured={property.featured}
                    verified={property.verified}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="rounded-[28px] border border-[#F0E7CF] bg-white p-10 text-center shadow-sm sm:rounded-[36px] sm:p-16">
            <Sparkles
              className="mx-auto text-[#C9A227]"
              size={32}
            />

            <h3 className="mt-4 text-2xl font-black text-[#1B1B1B]">
              Popular listings coming soon
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Check back soon to discover properties being promoted
              on HomeLinker.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 font-bold text-white transition hover:bg-[#A67C00]"
            >
              Browse Properties
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}