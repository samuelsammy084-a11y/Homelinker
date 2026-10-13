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
   * IMPORTANT:
   * Do not use select("*") here.
   *
   * This function powers public property browsing.
   * Private owner information such as contact_phone
   * must never be returned with every listing.
   */
  let query = supabase.from("properties").select(`
    id,
    title,
    description,
    price,
    city,
    province,
    suburb,
    address,
    street_address,
    property_type,
    bedrooms,
    bathrooms,
    parking,
    image_url,
    image_urls,
    featured,
    verified,
    is_promoted,
    user_id,
    latitude,
    longitude,
    property_condition,
    pet_friendly,
    listing_type,
    bond_price,
    verification_status,
    created_at,
    contact_name
  `);

  if (filters?.province?.trim()) {
    query = query.ilike(
      "province",
      filters.province.trim()
    );
  }

  if (filters?.city?.trim()) {
    const location = filters.city
      .trim()
      .replace(/[%_]/g, "\\$&");

    query = query.or(
      `city.ilike.%${location}%,suburb.ilike.%${location}%,address.ilike.%${location}%,street_address.ilike.%${location}%`
    );
  }

  if (filters?.type?.trim()) {
    query = query.ilike(
      "property_type",
      filters.type.trim()
    );
  }

  if (filters?.listingType) {
    query = query.ilike(
      "listing_type",
      filters.listingType
    );
  }

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

      owner_name:
        typedProperty.contact_name ||
        "HomeLinker User",

      owner_verified:
        typedProperty.verified === true ||
        typedProperty.verification_status ===
          "verified",
    };
  });
}