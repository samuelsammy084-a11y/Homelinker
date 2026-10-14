import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { createPropertySlug } from "@/lib/property-slug";
import { blogPosts } from "@/lib/blog-posts";

const BASE_URL = "https://www.homelinker.co.za";

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

  /*
   * --------------------------------------------------
   * FETCH ACTIVE PROPERTIES
   * --------------------------------------------------
   *
   * There is intentionally NO "slug" column here.
   * Property slugs are generated from title + city + id.
   */

  const { data: properties, error } = await supabase
    .from("properties")
    .select("id, title, city, created_at, listing_type")
    .eq("status", "active")
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
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
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
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
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
    {
      url: `${BASE_URL}/cookie-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  /*
   * --------------------------------------------------
   * CITY INFORMATION
   * --------------------------------------------------
   */

  const cityMap = new Map<
    string,
    {
      city: string;
      lastModified: Date;
      hasRent: boolean;
      hasSale: boolean;
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

    const listingType = property.listing_type
      ?.trim()
      .toLowerCase();

    const existing = cityMap.get(slug);

    if (!existing) {
      cityMap.set(slug, {
        city,
        lastModified: createdAt,
        hasRent: listingType === "rent",
        hasSale: listingType === "sale",
      });

      continue;
    }

    if (createdAt > existing.lastModified) {
      existing.lastModified = createdAt;
    }

    if (listingType === "rent") {
      existing.hasRent = true;
    }

    if (listingType === "sale") {
      existing.hasSale = true;
    }
  }

  /*
   * --------------------------------------------------
   * RENT CITY PAGES
   * --------------------------------------------------
   *
   * Only include a rent city URL when that city actually
   * has at least one active rental listing.
   */

  const rentCityPages: MetadataRoute.Sitemap = Array.from(
    cityMap.entries()
  )
    .filter(([, city]) => city.hasRent)
    .map(([slug, city]) => ({
      url: `${BASE_URL}/rent/${slug}`,
      lastModified: city.lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  /*
   * --------------------------------------------------
   * SALE CITY PAGES
   * --------------------------------------------------
   *
   * Only include a sale city URL when that city actually
   * has at least one active sale listing.
   */

  const saleCityPages: MetadataRoute.Sitemap = Array.from(
    cityMap.entries()
  )
    .filter(([, city]) => city.hasSale)
    .map(([slug, city]) => ({
      url: `${BASE_URL}/sale/${slug}`,
      lastModified: city.lastModified,
      changeFrequency: "daily",
      priority: 0.8,
    }));

  /*
   * --------------------------------------------------
   * INDIVIDUAL PROPERTY PAGES
   * --------------------------------------------------
   */

  const propertyPages: MetadataRoute.Sitemap = safeProperties
    .filter(
      (property) =>
        property.id !== null &&
        property.id !== undefined &&
        Boolean(property.title?.trim())
    )
    .map((property) => {
      const propertySlug = createPropertySlug(
        property.title,
        property.city || "",
        property.id
      );

      return {
        url: `${BASE_URL}/properties/${propertySlug}`,
        lastModified: property.created_at
          ? new Date(property.created_at)
          : now,
        changeFrequency: "daily" as const,
        priority: 0.8,
      };
    });

  /*
   * --------------------------------------------------
   * BLOG POSTS
   * --------------------------------------------------
   */

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map(
    (post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

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
    ...blogPostPages,
  ];
}