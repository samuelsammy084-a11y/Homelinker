import type { Property } from "@/app/types/property";
import { unstable_noStore } from "next/cache";
import { supabase } from "./supabase";
import { createPropertySlug } from "./property-slug";

export async function getProperties() {
  unstable_noStore();

  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      profiles:owner_id (
        full_name,
        phone_number,
        avatar_url,
        is_verified
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return [];
  }

  return (data || []).map((property: any) => {
    const profile = property.profiles;

    return {
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

      owner_name:
        profile?.full_name || "HomeLinker User",

      owner_phone:
        profile?.phone_number || null,

      owner_avatar:
        profile?.avatar_url || null,

      owner_verified:
        profile?.is_verified === true,
    };
  });
}