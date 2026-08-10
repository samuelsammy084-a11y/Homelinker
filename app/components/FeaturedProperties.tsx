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
   * Only listings marked as promoted are intended
   * to appear in this homepage section.
   *
   * If there are currently no promoted listings,
   * use the first available listings so the section
   * never looks empty during development.
   */
  const promotedProperties = properties.filter(
    (property: Property) => property.is_promoted === true
  );

  const displayProperties =
    promotedProperties.length > 0
      ? promotedProperties
      : properties.slice(0, 6);

  return (
    <section className="bg-[#F8F6F1] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="mb-7 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/20 bg-[#C9A227]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#A67C00] sm:text-xs">
              <Sparkles size={13} />
              Popular
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#1B1B1B] sm:text-4xl lg:text-5xl">
              Popular listings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
              Discover properties getting the most attention on HomeLinker.
            </p>
          </div>

          {/* DESKTOP VIEW ALL */}
          <Link
            href="/properties"
            className="hidden items-center gap-2 text-sm font-bold text-[#C9A227] transition hover:gap-3 sm:inline-flex sm:text-base"
          >
            View all properties
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* LISTINGS CONTAINER */}
        <div className="rounded-[26px] border border-[#F0E7CF] bg-[#FFFDF8] p-3 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.18)] sm:rounded-[34px] sm:p-6">
          {/* MOBILE */}
          <div className="sm:hidden">
            <div
              className="
                flex
                snap-x
                snap-mandatory
                gap-4
                overflow-x-auto
                pb-3
                px-1
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {displayProperties.map((property: Property) => (
                <div
                  key={property.id}
                  className="
                    w-[88%]
                    min-w-[88%]
                    shrink-0
                    snap-center
                  "
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
              ))}

              {/* VIEW MORE CARD */}
              <Link
                href="/properties"
                className="
                  flex
                  w-[88%]
                  min-w-[88%]
                  shrink-0
                  snap-center
                  flex-col
                  items-center
                  justify-center
                  rounded-[24px]
                  border
                  border-[#E8D8A5]
                  bg-[#FFF9E8]
                  px-8
                  py-14
                  text-center
                  transition
                  hover:border-[#C9A227]
                  hover:bg-[#FFF5D0]
                "
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227] text-white shadow-md">
                  <ArrowRight size={24} />
                </div>

                <h3 className="mt-5 text-xl font-black text-[#1B1B1B]">
                  View more
                </h3>

                <p className="mt-2 max-w-[220px] text-sm leading-6 text-slate-500">
                  Explore more properties available on HomeLinker.
                </p>

                <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-bold text-white">
                  Browse properties
                  <ArrowRight size={16} />
                </span>
              </Link>
            </div>

            {/* SWIPE INDICATOR */}
            {displayProperties.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                <span>←</span>
                Swipe to explore
                <span>→</span>
              </div>
            )}
          </div>

          {/* TABLET / DESKTOP */}
          <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
            {displayProperties.slice(0, 6).map((property: Property) => (
              <PropertyCard
                key={property.id}
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
                price={property.price}
                title={property.title}
                location={`${property.city}, ${property.province}`}
                bedrooms={property.bedrooms ?? 0}
                bathrooms={property.bathrooms ?? 0}
                parking={property.parking ?? 0}
                featured={property.featured}
                verified={property.verified}
              />
            ))}
          </div>
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-5 flex justify-center sm:hidden">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl border border-[#C9A227] bg-white px-5 py-3 text-sm font-bold text-[#A67C00] shadow-sm transition hover:bg-[#FFF9E8]"
          >
            View all properties
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}