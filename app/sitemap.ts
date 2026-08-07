import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { createPropertySlug } from "@/lib/property-slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://homelinker.co.za";

  const { data: properties } = await supabase
    .from("properties")
    .select("id, title, city, updated_at")
    .order("updated_at", { ascending: false });

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
      url: `${baseUrl}/properties/${createPropertySlug(property.title, property.city, property.id)}`,
      lastModified: property.updated_at
        ? new Date(property.updated_at)
        : new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    })) ?? [];

  return [...staticPages, ...propertyPages];
}