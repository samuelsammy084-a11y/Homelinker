import type { Property } from "@/app/types/property";
import { unstable_noStore } from "next/cache";
import { supabase } from "./supabase";
import { createPropertySlug } from "./property-slug";

export type PropertyFilters = {
  province?: string;
  city?: string;
  type?: string;
  listingType?: "rent" | "sale";
  minPrice?: number;
  maxPrice?: number;
};

function normalizeText(
  value: string | null | undefined
) {
  return (value || "").trim().toLowerCase();
}

function isPubliclyActive(
  status: string | null | undefined
) {
  return normalizeText(status) === "active";
}

function hasActivePaidPromotion(
  property: Property,
  now: number
): boolean {
  if (!isPubliclyActive(property.status)) {
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

function getRankingScore(
  property: Property,
  now: number
): number {
  const paid =
    hasActivePaidPromotion(property, now);

  if (
    paid &&
    property.promotion_source === "pro" &&
    property.is_priority === true
  ) {
    return 3;
  }

  if (paid) {
    return 2;
  }

  return 1;
}

function getCreatedTime(
  property: Property
): number {
  if (!property.created_at) {
    return 0;
  }

  const value = new Date(
    property.created_at
  ).getTime();

  return Number.isFinite(value)
    ? value
    : 0;
}

function getPromotionStartTime(
  property: Property
): number {
  if (!property.promotion_starts_at) {
    return 0;
  }

  const value = new Date(
    property.promotion_starts_at
  ).getTime();

  return Number.isFinite(value)
    ? value
    : 0;
}

export async function getProperties(
  filters?: PropertyFilters
): Promise<Property[]> {
  unstable_noStore();

  /*
   * IMPORTANT:
   *
   * We deliberately fetch the public listing data
   * first and filter active listings in application
   * code.
   *
   * This restores compatibility with HomeLinker's
   * existing listings while still preventing
   * pending/sold/rented listings from being returned.
   */

  let query = supabase
    .from("properties")
    .select(`
      id,
      title,
      description,
      price,
      province,
      city,
      location,
      property_type,
      bedrooms,
      bathrooms,
      parking,
      image_url,
      featured,
      verified,
      created_at,
      user_id,
      image_urls,
      latitude,
      longitude,
      street_address,
      suburb,
      status,
      plan,
      listing_type,
      deposit,
      available_from,
      floor_size,
      land_size,
      furnished,
      pet_friendly,
      is_promoted,
      is_priority,
      promotion_source,
      promotion_starts_at,
      promotion_expires_at,
      legacy_popular
    `);

  // ============================================
  // PROVINCE
  // ============================================

  if (filters?.province?.trim()) {
    query = query.ilike(
      "province",
      filters.province.trim()
    );
  }

  // ============================================
  // CITY / SUBURB / LOCATION / STREET
  // ============================================

  if (filters?.city?.trim()) {
    const searchLocation =
      filters.city
        .trim()
        .replace(/[%_]/g, "\\$&");

    query = query.or(
      `city.ilike.%${searchLocation}%,suburb.ilike.%${searchLocation}%,location.ilike.%${searchLocation}%,street_address.ilike.%${searchLocation}%`
    );
  }

  // ============================================
  // PROPERTY TYPE
  // ============================================

  if (filters?.type?.trim()) {
    query = query.ilike(
      "property_type",
      filters.type.trim()
    );
  }

  // ============================================
  // RENT / SALE
  // ============================================

  if (filters?.listingType) {
    const listingType =
      filters.listingType === "sale"
        ? ["sale", "for sale"]
        : ["rent", "for rent"];

    query = query.in(
      "listing_type",
      listingType
    );
  }

  // ============================================
  // MINIMUM PRICE
  // ============================================

  if (
    typeof filters?.minPrice === "number" &&
    Number.isFinite(filters.minPrice) &&
    filters.minPrice >= 0
  ) {
    query = query.gte(
      "price",
      filters.minPrice
    );
  }

  // ============================================
  // MAXIMUM PRICE
  // ============================================

  if (
    typeof filters?.maxPrice === "number" &&
    Number.isFinite(filters.maxPrice) &&
    filters.maxPrice >= 0
  ) {
    query = query.lte(
      "price",
      filters.maxPrice
    );
  }

  const { data, error } =
    await query.order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "SUPABASE PROPERTY SEARCH ERROR:",
      error
    );

    return [];
  }

  // ============================================
  // NORMALISE + ACTIVE ONLY
  // ============================================

  const properties: Property[] = (
    data || []
  )
    .map((row) => {
      const property =
        row as Property;

      return {
        ...property,

        slug: createPropertySlug(
          property.title,
          property.city ?? "",
          property.id
        ),

        image_urls:
          property.image_urls?.length
            ? property.image_urls
            : property.image_url
              ? [property.image_url]
              : [],

        owner_name: "HomeLinker User",

        owner_verified:
          property.verified === true,
      };
    })
    .filter((property) =>
      isPubliclyActive(property.status)
    );

  // ============================================
  // PAID SEARCH RANKING
  // ============================================

  const now = Date.now();

  properties.sort((a, b) => {
    const aScore =
      getRankingScore(a, now);

    const bScore =
      getRankingScore(b, now);

    // Priority > paid > normal
    if (aScore !== bScore) {
      return bScore - aScore;
    }

    // Newer paid promotion first
    if (aScore > 1) {
      const aPromotion =
        getPromotionStartTime(a);

      const bPromotion =
        getPromotionStartTime(b);

      if (
        aPromotion !== bPromotion
      ) {
        return (
          bPromotion - aPromotion
        );
      }
    }

    // Newer property first
    return (
      getCreatedTime(b) -
      getCreatedTime(a)
    );
  });

  return properties;
}