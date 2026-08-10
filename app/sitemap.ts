import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { createPropertySlug } from "@/lib/property-slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://homelinker.co.za";

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, title, city, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Sitemap property fetch error:", error);
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const propertyPages: MetadataRoute.Sitemap =
    properties?.map((property) => ({
      url: `${baseUrl}/properties/${createPropertySlug(
        property.title,
        property.city,
        property.id
      )}`,
      lastModified: property.created_at
        ? new Date(property.created_at)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    })) ?? [];

  return [...staticPages, ...propertyPages];
}