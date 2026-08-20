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

  if (filters?.province) {
    query = query.eq("province", filters.province);
  }

  if (filters?.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  if (filters?.type) {
    query = query.eq("property_type", filters.type);
  }

  if (filters?.maxPrice) {
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