import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";
import { createPropertySlug } from "@/lib/property-slug";
import { blogPosts } from "@/lib/blog-posts";

// Must match metadataBase in app/layout.tsx and SITE_URL in the property
// detail page — using the same www domain everywhere avoids splitting
// SEO signals between two URL versions of the same site.
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

    const { data: properties, error } = await supabase
    .from("properties")
    .select("id, title, city, created_at, slug")
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
   * Each city gets BOTH:
   *
   * /rent/city
   * /sale/city
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
      .filter((property) => property.id && property.title)
      .map((property) => ({
        url: `${BASE_URL}/properties/${
          property.slug ||
          createPropertySlug(
            property.title,
            property.city || "",
            property.id
          )
        }`,
        lastModified: property.created_at
          ? new Date(property.created_at)
          : now,
        changeFrequency: "daily",
        priority: 0.8,
      }));


  /*
   * --------------------------------------------------
   * BLOG POST PAGES
   * --------------------------------------------------
   */

  const blogPostPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
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
    ...blogPostPages,
  ];
}