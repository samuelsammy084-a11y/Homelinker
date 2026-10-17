import PropertyCard from "./PropertyCard";
import { getProperties } from "@/lib/getProperties";
import type { Property } from "@/app/types/property";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

const MAX_POPULAR_LISTINGS = 6;

function hasActivePaidPromotion(property: Property) {
  if (property.status !== "active") {
    return false;
  }

  if (property.is_promoted !== true) {
    return false;
  }

  if (
    property.promotion_source !== "premium" &&
    property.promotion_source !== "pro"
  ) {
    return false;
  }

  if (!property.promotion_expires_at) {
    return false;
  }

  const expiresAt = new Date(
    property.promotion_expires_at
  ).getTime();

  return (
    Number.isFinite(expiresAt) &&
    expiresAt > Date.now()
  );
}

function isLegacyPopular(property: Property) {
  return (
    property.status === "active" &&
    property.legacy_popular === true
  );
}

export default async function FeaturedProperties() {
  const properties = await getProperties();

  /*
   * ============================================
   * HOMELINKER POPULAR LISTINGS RULES
   * ============================================
   *
   * 1. Active paid promotions come first.
   *
   * 2. Premium and Pro promotions only qualify
   *    while their promotion is still active.
   *
   * 3. Existing legacy Popular listings fill
   *    any remaining homepage positions.
   *
   * 4. New Free listings NEVER automatically
   *    enter Popular Listings.
   *
   * 5. Sold/rented/inactive properties are
   *    excluded.
   *
   * 6. As paid listings are added, legacy
   *    listings naturally get pushed out.
   */

  const paidPromotedProperties =
    properties.filter(
      (property: Property) =>
        hasActivePaidPromotion(property)
    );

  /*
   * Priority Pro properties should receive the
   * strongest placement inside Popular Listings.
   *
   * After Priority properties:
   * - other paid promoted listings follow
   * - newest promotion wins within the same tier
   */

  paidPromotedProperties.sort((a, b) => {
    const aPriority =
      a.promotion_source === "pro" &&
      a.is_priority === true;

    const bPriority =
      b.promotion_source === "pro" &&
      b.is_priority === true;

    if (aPriority !== bPriority) {
      return aPriority ? -1 : 1;
    }

    const aStarted = a.promotion_starts_at
      ? new Date(a.promotion_starts_at).getTime()
      : 0;

    const bStarted = b.promotion_starts_at
      ? new Date(b.promotion_starts_at).getTime()
      : 0;

    return bStarted - aStarted;
  });

  /*
   * Legacy Popular listings are only the
   * properties we deliberately preserved.
   *
   * A new Free listing cannot qualify here
   * unless somebody explicitly changes its
   * legacy_popular database flag.
   */

  const legacyProperties = properties.filter(
    (property: Property) =>
      isLegacyPopular(property) &&
      !paidPromotedProperties.some(
        (promotedProperty) =>
          promotedProperty.id === property.id
      )
  );

  /*
   * Paid properties occupy the first positions.
   *
   * Legacy listings only fill whatever space
   * remains out of the six homepage positions.
   */

  const paidSlots =
    paidPromotedProperties.slice(
      0,
      MAX_POPULAR_LISTINGS
    );

  const remainingSlots = Math.max(
    0,
    MAX_POPULAR_LISTINGS -
      paidSlots.length
  );

  const legacySlots =
    legacyProperties.slice(
      0,
      remainingSlots
    );

  const displayProperties = [
    ...paidSlots,
    ...legacySlots,
  ];

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
              Discover standout properties currently
              receiving enhanced visibility on HomeLinker.
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

        {/* LISTINGS */}
        <div className="rounded-[26px] border border-[#F0E7CF] bg-[#FFFDF8] p-3 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.18)] sm:rounded-[34px] sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {displayProperties.map(
              (property: Property) => (
                <div
                  key={property.id}
                  className="min-w-0"
                >
                  <PropertyCard
                    id={property.id}
                    slug={property.slug}
                    status={property.status}
                    listingType={
                      property.listing_type
                    }
                    images={
                      property.image_urls?.length
                        ? property.image_urls
                        : [
                            property.image_url ||
                              "/og-image.png",
                          ]
                    }
                    price={property.price}
                    title={property.title}
                    location={`${property.city}, ${property.province}`}
                    bedrooms={
                      property.bedrooms ?? 0
                    }
                    bathrooms={
                      property.bathrooms ?? 0
                    }
                    parking={
                      property.parking ?? 0
                    }
                    featured={
                      property.featured
                    }
                    verified={
                      property.verified
                    }
                  />
                </div>
              )
            )}

            {/* MOBILE VIEW MORE CARD */}
            <Link
              href="/properties"
              className="flex min-h-[260px] flex-col items-center justify-center rounded-[20px] border border-[#E8D8A5] bg-[#FFF9E8] px-4 py-8 text-center transition hover:border-[#C9A227] hover:bg-[#FFF5D0] sm:hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227] text-white shadow-md">
                <ArrowRight size={21} />
              </div>

              <h3 className="mt-4 text-base font-black text-[#1B1B1B]">
                View more
              </h3>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Explore more properties on
                HomeLinker.
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#C9A227] px-4 py-2.5 text-xs font-bold text-white">
                Browse
                <ArrowRight size={14} />
              </span>
            </Link>
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