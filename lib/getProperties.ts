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

/**
 * A paid promotion only counts while:
 *
 * - the listing is active
 * - is_promoted is true
 * - the promotion came from Premium or Pro
 * - the promotion has not expired
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

/**
 * HomeLinker search ranking:
 *
 * 3 = Pro Priority
 * 2 = Premium / Pro promoted
 * 1 = Normal listing
 */
function getRankingScore(
  property: Property,
  now: number
): number {
  const activePromotion =
    hasActivePaidPromotion(property, now);

  if (
    activePromotion &&
    property.promotion_source === "pro" &&
    property.is_priority === true
  ) {
    return 3;
  }

  if (activePromotion) {
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

  const time = new Date(
    property.created_at
  ).getTime();

  return Number.isFinite(time)
    ? time
    : 0;
}

function getPromotionStartTime(
  property: Property
): number {
  if (!property.promotion_starts_at) {
    return 0;
  }

  const time = new Date(
    property.promotion_starts_at
  ).getTime();

  return Number.isFinite(time)
    ? time
    : 0;
}

export async function getProperties(
  filters?: PropertyFilters
) {
  unstable_noStore();

  /*
   * ============================================
   * PUBLIC PROPERTY QUERY
   * ============================================
   *
   * Never use select("*") here.
   *
   * Sensitive fields deliberately excluded:
   * - contact_phone
   * - contact_number
   * - payment_reference
   * - stripe_session_id
   *
   * Promotion fields are intentionally public
   * because HomeLinker uses them for ranking,
   * placement and badges.
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
      payment_status,
      expires_at,
      featured_until,
      published_at,
      listing_type,
      deposit,
      available_from,
      floor_size,
      land_size,
      condition,
      rates,
      levies,
      furnished,
      pet_friendly,
      is_promoted,
      is_priority,
      promotion_source,
      promotion_starts_at,
      promotion_expires_at,
      legacy_popular,
      show_contact_phone
    `);

  /*
   * ============================================
   * PUBLIC INVENTORY
   * ============================================
   *
   * Only active listings are allowed into public
   * search results.
   *
   * Pending, sold, rented and other inactive
   * listings remain in the database/dashboard
   * but do not appear in public property search.
   */

  query = query.eq("status", "active");

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
    query = query.ilike(
      "listing_type",
      filters.listingType
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

  /*
   * ============================================
   * DATABASE ORDER
   * ============================================
   *
   * Fetch newest first.
   *
   * Final paid ranking happens below after
   * promotion expiry is validated.
   */

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
  // NORMALISE PROPERTY DATA
  // ============================================

  const properties: Property[] = (
    data || []
  ).map((property) => {
    const typedProperty =
      property as Property;

    return {
      ...typedProperty,

      slug: createPropertySlug(
        typedProperty.title,
        typedProperty.city ?? "",
        typedProperty.id
      ),

      image_urls:
        typedProperty.image_urls?.length
          ? typedProperty.image_urls
          : typedProperty.image_url
            ? [typedProperty.image_url]
            : [],

      owner_name: "HomeLinker User",

      owner_verified:
        typedProperty.verified === true,
    };
  });

  /*
   * ============================================
   * HOMELINKER SEARCH RANKING
   * ============================================
   *
   * Ranking happens AFTER the user's filters.
   *
   * Paying for promotion improves placement only
   * among properties that genuinely match the
   * user's search.
   *
   * ORDER:
   *
   * 1. Active Pro Priority
   * 2. Active Premium / Pro promoted
   * 3. Normal listings
   *
   * Expired promotions automatically return to
   * normal ranking.
   */

  const now = Date.now();

  properties.sort((a, b) => {
    const aScore =
      getRankingScore(a, now);

    const bScore =
      getRankingScore(b, now);

    // Higher paid ranking first.
    if (aScore !== bScore) {
      return bScore - aScore;
    }

    /*
     * Within paid tiers, newer promotions are
     * placed ahead of older promotions.
     */
    if (aScore > 1) {
      const aPromotionStart =
        getPromotionStartTime(a);

      const bPromotionStart =
        getPromotionStartTime(b);

      if (
        aPromotionStart !==
        bPromotionStart
      ) {
        return (
          bPromotionStart -
          aPromotionStart
        );
      }
    }

    /*
     * Within the same ranking level,
     * newer listings come first.
     */
    return (
      getCreatedTime(b) -
      getCreatedTime(a)
    );
  });

  return properties;
}