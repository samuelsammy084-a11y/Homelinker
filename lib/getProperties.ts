import { supabase } from "./supabase";

export async function getProperties() {
  const { data, error } = await supabase
    .from("listings")
    .select(`
      *,
      listing_images (
        image_url,
        sort_order
      ),
      profiles (
        full_name,
        verified
      )
    `)
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return [];
  }

  return (data || []).map((listing: any) => ({
    ...listing,

    image_urls:
      listing.listing_images
        ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((img: any) => img.image_url) || [],

    owner_name: listing.profiles?.full_name || "HomeLinker User",

    owner_verified: listing.profiles?.verified || false,
  }));
}