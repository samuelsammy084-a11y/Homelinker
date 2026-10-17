import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Bath,
  CarFront,
  Search,
} from "lucide-react";

import PropertySearchBar from "@/app/components/PropertySearchBar";
import { getProperties } from "@/lib/getProperties";
import type { Property } from "@/app/types/property";

export const metadata: Metadata = {
  title:
    "Properties for Sale & Rent Across South Africa | HomeLinker",

  description:
    "Find rooms, flats, apartments and houses to rent or buy across South Africa. Search by province, city, suburb, property type and price on HomeLinker.",

  alternates: {
    canonical: "https://www.homelinker.co.za/properties",
  },

  openGraph: {
    title:
      "Properties for Sale & Rent Across South Africa | HomeLinker",

    description:
      "Explore property listings throughout South Africa. Find a place to rent or buy, or browse available homes and rooms on HomeLinker.",

    url: "https://www.homelinker.co.za/properties",
    siteName: "HomeLinker",
    type: "website",
  },
};

type Props = {
  searchParams: Promise<{
    province?: string;
    city?: string;
    type?: string;
    listingType?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

type PromotionBadge =
  | "Priority"
  | "Premium"
  | "Pro"
  | null;

function parsePrice(
  value?: string
): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  if (
    !Number.isFinite(parsed) ||
    parsed < 0
  ) {
    return undefined;
  }

  return parsed;
}

function formatPrice(price: number): string {
  return `R${Number(
    price || 0
  ).toLocaleString("en-ZA")}`;
}

function getListingLabel(
  listingType?: string | null
): string {
  const value =
    listingType?.toLowerCase().trim();

  if (
    value === "sale" ||
    value === "for sale"
  ) {
    return "For Sale";
  }

  if (
    value === "rent" ||
    value === "for rent"
  ) {
    return "For Rent";
  }

  return listingType || "Property";
}

function isRental(
  listingType?: string | null
): boolean {
  const value =
    listingType?.toLowerCase().trim();

  return (
    value === "rent" ||
    value === "for rent"
  );
}

/*
 * A promotion is only considered active when:
 *
 * - the property itself is active
 * - HomeLinker marked it as promoted
 * - it came from Premium or Pro
 * - it has a valid future expiry date
 *
 * This prevents stale database flags from showing
 * paid badges after a promotion expires.
 */
function hasActivePaidPromotion(
  property: Property,
  now: number
): boolean {
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
    expiresAt > now
  );
}

function getPromotionBadge(
  property: Property,
  now: number
): PromotionBadge {
  if (
    !hasActivePaidPromotion(
      property,
      now
    )
  ) {
    return null;
  }

  if (
    property.promotion_source === "pro" &&
    property.is_priority === true
  ) {
    return "Priority";
  }

  if (
    property.promotion_source === "premium"
  ) {
    return "Premium";
  }

  if (
    property.promotion_source === "pro"
  ) {
    return "Pro";
  }

  return null;
}

function getPromotionBadgeClass(
  badge: PromotionBadge
): string {
  switch (badge) {
    case "Priority":
      return "border border-[#F0D77A] bg-black text-[#E8C75A]";

    case "Pro":
      return "border border-black bg-black text-[#E8C75A]";

    case "Premium":
      return "border border-[#C9A227] bg-[#C9A227] text-white";

    default:
      return "";
  }
}

export default async function PropertiesPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  const listingType =
    params.listingType === "rent" ||
    params.listingType === "sale"
      ? params.listingType
      : undefined;

  const minPrice = parsePrice(
    params.minPrice
  );

  const maxPrice = parsePrice(
    params.maxPrice
  );

  const allProperties =
    await getProperties({
      province: params.province,
      city: params.city,
      type: params.type,
      listingType,
      minPrice,
      maxPrice,
    });

  /*
   * Public property search should only display
   * currently active listings.
   *
   * This protects this page even before every
   * database query is fully centralised around
   * active-only public inventory.
   */
  const properties =
    allProperties.filter(
      (property) =>
        property.status === "active"
    );

  const hasFilters = Boolean(
    params.province ||
      params.city ||
      params.type ||
      params.listingType ||
      params.minPrice ||
      params.maxPrice
  );

  const heading = listingType
    ? listingType === "rent"
      ? "Properties to Rent"
      : "Properties for Sale"
    : "Find Your Next Property";

  /*
   * Use one timestamp for the entire render so
   * every property is evaluated consistently.
   */
  const now = Date.now();

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-slate-900">
      {/* HERO + SEARCH */}

      <section className="border-b border-[#C9A227]/20 bg-gradient-to-br from-[#FCFAF5] to-[#F3EBD5]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#9A7411]">
              HomeLinker · South Africa
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {heading}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Search rooms, apartments,
              flats and houses across South
              Africa. Find a place that suits
              your needs and budget.
            </p>
          </div>

          <PropertySearchBar />
        </div>
      </section>

      {/* PROPERTIES */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Available Properties
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            {properties.length}{" "}
            {properties.length === 1
              ? "property"
              : "properties"}{" "}
            found
          </p>
        </div>

        {/* ACTIVE SEARCH FILTERS */}

        {hasFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-600">
              Your search:
            </span>

            {listingType && (
              <span className="rounded-full border border-[#C9A227]/40 bg-white px-3 py-1">
                {listingType === "rent"
                  ? "For Rent"
                  : "For Sale"}
              </span>
            )}

            {params.province && (
              <span className="rounded-full border border-[#C9A227]/40 bg-white px-3 py-1">
                {params.province}
              </span>
            )}

            {params.city && (
              <span className="rounded-full border border-[#C9A227]/40 bg-white px-3 py-1">
                {params.city}
              </span>
            )}

            {params.type && (
              <span className="rounded-full border border-[#C9A227]/40 bg-white px-3 py-1">
                {params.type}
              </span>
            )}

            {minPrice !== undefined && (
              <span className="rounded-full border border-[#C9A227]/40 bg-white px-3 py-1">
                From{" "}
                {formatPrice(minPrice)}
              </span>
            )}

            {maxPrice !== undefined && (
              <span className="rounded-full border border-[#C9A227]/40 bg-white px-3 py-1">
                Up to{" "}
                {formatPrice(maxPrice)}
              </span>
            )}

            <Link
              href="/properties"
              className="ml-1 font-semibold text-[#8A6810] underline underline-offset-4 transition hover:text-black"
            >
              Clear search
            </Link>
          </div>
        )}

        {/* NO RESULTS */}

        {properties.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F6F1]">
              <Search className="h-6 w-6 text-[#9A7411]" />
            </div>

            <h3 className="mt-5 text-xl font-bold">
              No properties found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Try another city or suburb,
              choose a different property
              type, or adjust your price
              range.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00]"
            >
              View all properties
            </Link>
          </div>
        ) : (
          /* PROPERTY GRID */

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(
              (property) => {
                const image =
                  property.image_urls?.find(
                    (
                      url:
                        | string
                        | null
                    ) => Boolean(url)
                  ) ||
                  property.image_url;

                const rental =
                  isRental(
                    property.listing_type
                  );

                const location = [
                  property.suburb,
                  property.city,
                  property.province,
                ]
                  .filter(Boolean)
                  .filter(
                    (
                      value,
                      index,
                      values
                    ) =>
                      values.indexOf(
                        value
                      ) === index
                  )
                  .join(", ");

                const propertyHref =
                  property.slug
                    ? `/properties/${property.slug}`
                    : `/properties/${property.id}`;

                const verified =
                  property.verified ===
                    true ||
                  String(
                    property.verification_status ||
                      ""
                  ).toLowerCase() ===
                    "verified";

                const promotionBadge =
                  getPromotionBadge(
                    property,
                    now
                  );

                return (
                  <article
                    key={property.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link
                      href={propertyHref}
                      className="block"
                      aria-label={`View ${property.title}`}
                    >
                      {/* IMAGE */}

                      <div className="relative h-56 overflow-hidden bg-slate-100">
                        {image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={image}
                            alt={
                              property.title
                            }
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                            <MapPin className="h-8 w-8" />

                            <span className="text-sm">
                              Photo unavailable
                            </span>
                          </div>
                        )}

                        {/* RENT / SALE */}

                        <span className="absolute left-3 top-3 rounded-lg bg-black/80 px-3 py-1.5 text-xs font-bold text-white">
                          {getListingLabel(
                            property.listing_type
                          )}
                        </span>

                        {/* PAID PROMOTION */}

                        {promotionBadge && (
                          <span
                            className={`absolute right-3 top-3 rounded-lg px-3 py-1.5 text-xs font-extrabold shadow-sm ${getPromotionBadgeClass(
                              promotionBadge
                            )}`}
                          >
                            {promotionBadge}
                          </span>
                        )}

                        {/* VERIFIED */}

                        {verified && (
                          <span className="absolute bottom-3 left-3 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
                            Verified
                          </span>
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="p-5">
                        <p className="text-xl font-extrabold text-[#96700B]">
                          {formatPrice(
                            Number(
                              property.price
                            )
                          )}

                          {rental && (
                            <span className="text-sm font-medium text-slate-500">
                              {" "}
                              / month
                            </span>
                          )}
                        </p>

                        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-6 transition group-hover:text-[#96700B]">
                          {property.title}
                        </h3>

                        {/* LOCATION */}

                        {location && (
                          <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A227]" />

                            <span>
                              {location}
                            </span>
                          </p>
                        )}

                        {/* PROPERTY TYPE */}

                        {property.property_type && (
                          <p className="mt-3 text-sm font-medium text-slate-600">
                            {
                              property.property_type
                            }
                          </p>
                        )}

                        {/* PROPERTY FEATURES */}

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
                          {property.bedrooms !=
                            null && (
                            <span className="flex items-center gap-1.5">
                              <BedDouble className="h-4 w-4 text-[#9A7411]" />

                              {
                                property.bedrooms
                              }{" "}
                              beds
                            </span>
                          )}

                          {property.bathrooms !=
                            null && (
                            <span className="flex items-center gap-1.5">
                              <Bath className="h-4 w-4 text-[#9A7411]" />

                              {
                                property.bathrooms
                              }{" "}
                              baths
                            </span>
                          )}

                          {property.parking !=
                            null && (
                            <span className="flex items-center gap-1.5">
                              <CarFront className="h-4 w-4 text-[#9A7411]" />

                              {
                                property.parking
                              }{" "}
                              parking
                            </span>
                          )}
                        </div>

                        {/* VIEW PROPERTY */}

                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                          <span className="text-xs font-medium text-slate-500">
                            Listed on
                            HomeLinker
                          </span>

                          <span className="text-sm font-bold text-[#96700B]">
                            View property →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}