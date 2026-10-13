
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

export async function getProperties(filters?: PropertyFilters) {
  unstable_noStore();

  let query = supabase.from("properties").select("*");

  if (filters?.province?.trim()) {
    query = query.ilike("province", filters.province.trim());
  }

  if (filters?.city?.trim()) {
    const location = filters.city.trim().replace(/[%_]/g, "\\$&");

    query = query.or(
      `city.ilike.%${location}%,suburb.ilike.%${location}%,address.ilike.%${location}%,street_address.ilike.%${location}%`
    );
  }

  if (filters?.type?.trim()) {
    query = query.ilike("property_type", filters.type.trim());
  }

  if (filters?.listingType) {
    query = query.ilike("listing_type", filters.listingType);
  }

  if (
    typeof filters?.minPrice === "number" &&
    Number.isFinite(filters.minPrice) &&
    filters.minPrice >= 0
  ) {
    query = query.gte("price", filters.minPrice);
  }

  if (
    typeof filters?.maxPrice === "number" &&
    Number.isFinite(filters.maxPrice) &&
    filters.maxPrice >= 0
  ) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("SUPABASE PROPERTY SEARCH ERROR:", error);
    return [];
  }

  return (data || []).map((property: Property) => ({
    ...property,
    slug: createPropertySlug(
      property.title,
      property.city ?? "",
      property.id
    ),
    image_urls: property.image_urls?.length
      ? property.image_urls
      : property.image_url
        ? [property.image_url]
        : [],
    owner_name: property.contact_name || "HomeLinker User",
    owner_phone: property.contact_phone || null,
    owner_verified:
      property.verified === true ||
      property.verification_status === "verified",
  }));
}
