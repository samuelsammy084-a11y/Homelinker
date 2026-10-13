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

export async function getProperties(
  filters?: PropertyFilters
) {
  unstable_noStore();

  /*
   * PUBLIC PROPERTY QUERY
   *
   * Never use select("*") here.
   *
   * Sensitive fields deliberately excluded:
   * - contact_phone
   * - contact_number
   * - payment_reference
   * - stripe_session_id
   */
  let query = supabase.from("properties").select(`
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
    show_contact_phone
  `);

  // Province
  if (filters?.province?.trim()) {
    query = query.ilike(
      "province",
      filters.province.trim()
    );
  }

  // City / suburb / location / street search
  if (filters?.city?.trim()) {
    const searchLocation = filters.city
      .trim()
      .replace(/[%_]/g, "\\$&");

    query = query.or(
      `city.ilike.%${searchLocation}%,suburb.ilike.%${searchLocation}%,location.ilike.%${searchLocation}%,street_address.ilike.%${searchLocation}%`
    );
  }

  // Property type
  if (filters?.type?.trim()) {
    query = query.ilike(
      "property_type",
      filters.type.trim()
    );
  }

  // Rent / Sale
  if (filters?.listingType) {
    query = query.ilike(
      "listing_type",
      filters.listingType
    );
  }

  // Minimum price
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

  // Maximum price
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

  const { data, error } = await query.order(
    "created_at",
    {
      ascending: false,
    }
  );

  if (error) {
    console.error(
      "SUPABASE PROPERTY SEARCH ERROR:",
      error
    );

    return [];
  }

  return (data || []).map((property) => {
    const typedProperty = property as Property;

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
}