import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/getProperties";
import type { Property } from "@/app/types/property";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FeaturedProperties() {
  const properties = await getProperties();

  /*
   * Only show valid properties.
   * This prevents old/test listings with invalid data
   * such as R0 or empty titles from appearing.
   */
  const validProperties = properties.filter(
    (property: Property) =>
      property.id &&
      property.title?.trim() &&
      Number(property.price) > 0
  );

  /*
   * Featured section:
   * ONLY properties explicitly marked as featured.
   */
  const featured = validProperties.filter(
    (property: Property) => Boolean(property.featured)
  );

  /*
   * Do NOT fall back to random properties here.
   * If there are no featured properties, the section
   * simply won't display any property cards.
   */
  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="py-10 sm:py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mb-7 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#C9A227]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#A67C00] sm:text-xs">
              <Sparkles size={13} />
              Featured
            </div>

            <h2 className="text-3xl font-black tracking-tight text-[#1B1B1B] sm:text-4xl lg:text-5xl">
              Handpicked homes
              <span className="block text-[#C9A227]">
                you will love
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Browse a curated mix of rooms, apartments, and houses
              across South Africa.
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

        {/* Properties */}
        <div className="rounded-[28px] border border-[#F0E7CF] bg-[#FFFDF8] p-3 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.18)] sm:rounded-[36px] sm:p-6">

          {/* MOBILE: horizontal carousel */}
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:hidden">
            {featured.map((property: Property) => (
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
                  price={Number(property.price)}
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

          {/* MOBILE swipe hint */}
          {featured.length > 2 && (
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400 sm:hidden">
              <span>←</span>
              Swipe to explore
              <span>→</span>
            </div>
          )}

          {/* TABLET / DESKTOP */}
          <div className="hidden gap-6 sm:grid sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((property: Property) => (
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
                price={Number(property.price)}
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
      </div>
    </section>
  );
}