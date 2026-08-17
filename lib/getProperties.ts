import type { Property } from "@/app/types/property";
import { unstable_noStore } from "next/cache";
import { supabase } from "./supabase";
import { createPropertySlug } from "./property-slug";

export async function getProperties() {
  unstable_noStore();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

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