import type { Property } from "@/app/types/property";
import { unstable_noStore } from "next/cache";
import { supabase } from "./supabase";
import { createPropertySlug } from "./property-slug";

export type PropertyFilters = {
  province?: string;
  city?: string;
  type?: string;
  maxPrice?: number;
};

export async function getProperties(filters?: PropertyFilters) {
  unstable_noStore();

  let query = supabase
    .from("properties")
    .select("*");

  // Province filter
  if (filters?.province?.trim()) {
    query = query.eq("province", filters.province.trim());
  }

  // City filter
  if (filters?.city?.trim()) {
    query = query.ilike("city", `%${filters.city.trim()}%`);
  }

  // Property type filter
  // ilike makes "Room", "room", "ROOM", etc. match correctly.
  if (filters?.type?.trim()) {
    query = query.ilike("property_type", filters.type.trim());
  }

  // Maximum price
  if (
    typeof filters?.maxPrice === "number" &&
    !Number.isNaN(filters.maxPrice)
  ) {
    query = query.lte("price", filters.maxPrice);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("SUPABASE ERROR:", error);
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