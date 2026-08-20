import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { createPropertySlug } from "@/lib/property-slug";

const BASE_URL = "https://homelinker.co.za";

function createCitySlug(city: string) {
  return city
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, title, city, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Sitemap property fetch error:", error);
  }

  const safeProperties = properties ?? [];

  /*
   * --------------------------------------------------
   * STATIC PAGES
   * --------------------------------------------------
   */

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/properties`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  /*
   * --------------------------------------------------
   * SOUTH AFRICAN CITY PAGES
   *
   * Automatically generated from cities that
   * actually have properties on HomeLinker.
   *
   * Each city gets BOTH:
   *
   * /rent/city
   * /sale/city
   *
   * This allows HomeLinker to target both rental
   * and property-for-sale searches across SA.
   * --------------------------------------------------
   */

  const cityMap = new Map<
    string,
    {
      city: string;
      lastModified: Date;
    }
  >();

  for (const property of safeProperties) {
    const city = property.city?.trim();

    if (!city) continue;

    const slug = createCitySlug(city);

    if (!slug) continue;

    const createdAt = property.created_at
      ? new Date(property.created_at)
      : now;

    const existing = cityMap.get(slug);

    if (!existing || createdAt > existing.lastModified) {
      cityMap.set(slug, {
        city,
        lastModified: createdAt,
      });
    }
  }

  /*
   * RENT CITY PAGES
   *
   * Example:
   * /rent/midrand
   * /rent/johannesburg
   * /rent/cape-town
   */

  const rentCityPages: MetadataRoute.Sitemap =
    Array.from(cityMap.entries()).map(
      ([slug, city]) => ({
        url: `${BASE_URL}/rent/${slug}`,
        lastModified: city.lastModified,
        changeFrequency: "daily",
        priority: 0.8,
      })
    );

  /*
   * SALE CITY PAGES
   *
   * Example:
   * /sale/midrand
   * /sale/johannesburg
   * /sale/cape-town
   */

  const saleCityPages: MetadataRoute.Sitemap =
    Array.from(cityMap.entries()).map(
      ([slug, city]) => ({
        url: `${BASE_URL}/sale/${slug}`,
        lastModified: city.lastModified,
        changeFrequency: "daily",
        priority: 0.8,
      })
    );

  /*
   * --------------------------------------------------
   * INDIVIDUAL PROPERTY PAGES
   * --------------------------------------------------
   */

  const propertyPages: MetadataRoute.Sitemap =
    safeProperties
      .filter(
        (property) =>
          property.id &&
          property.title &&
          property.city
      )
      .map((property) => ({
        url: `${BASE_URL}/properties/${createPropertySlug(
          property.title,
          property.city,
          property.id
        )}`,
        lastModified: property.created_at
          ? new Date(property.created_at)
          : now,
        changeFrequency: "daily",
        priority: 0.8,
      }));

  /*
   * --------------------------------------------------
   * FINAL SITEMAP
   * --------------------------------------------------
   */

  return [
    ...staticPages,
    ...rentCityPages,
    ...saleCityPages,
    ...propertyPages,
  ];
}