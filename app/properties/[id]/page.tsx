import type { Metadata } from "next";
import type { Property } from "@/app/types/property";

import { redirect } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import {
  createPropertySlug,
  getPropertyIdFromSlug,
} from "@/lib/property-slug";

import {
  BedDouble,
  Bath,
  CarFront,
  Home as HomeIcon,
} from "lucide-react";

import PropertyMap from "@/app/components/PropertyMap";
import PropertyGallery from "@/app/components/PropertyGallery";
import FavoriteButton from "@/app/components/FavoriteButton";
import ReportListingButton from "@/app/components/ReportListingButton";
import ContactOwner from "@/app/components/ContactOwner";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

type PropertyDetails = Property & {
  street_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  show_contact_phone?: boolean;
  published_at?: string | null;
};

const SITE_URL = "https://www.homelinker.co.za";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

/*
 * Public-safe property query.
 *
 * IMPORTANT:
 * Do not add contact_phone or contact_number here.
 *
 * Phone numbers must not automatically be returned
 * with a public property page.
 */
async function getPropertyBySlugOrId(
  slug: string
): Promise<PropertyDetails | null> {
  const numericId = getPropertyIdFromSlug(slug);

  if (numericId == null) {
    return null;
  }

  const { data: property, error } = await supabase
    .from("properties")
    .select(`
      id,
      title,
      description,
      price,
      province,
      city,
      location,
      property_type,
      bedrooms,
      bathrooms,
      parking,
      image_url,
      featured,
      verified,
      created_at,
      user_id,
      image_urls,
      latitude,
      longitude,
      street_address,
      suburb,
      status,
      plan,
      payment_status,
      expires_at,
      featured_until,
      published_at,
      listing_type,
      deposit,
      available_from,
      floor_size,
      land_size,
      condition,
      rates,
      levies,
      furnished,
      pet_friendly,
      is_promoted,
      show_contact_phone
    `)
    .eq("id", numericId)
    .maybeSingle();

  if (error) {
    console.error("Property fetch error:", error);
    return null;
  }

  return property as PropertyDetails | null;
}

/*
 * Clean text before it is used in SEO metadata.
 *
 * We intentionally do not use the advertiser's full
 * property description as the meta description.
 */
function cleanMetaText(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createMetaDescription(property: PropertyDetails) {
  const propertyType =
    cleanMetaText(property.property_type) || "property";

  const city =
    cleanMetaText(property.city) || "South Africa";

  const province =
    cleanMetaText(property.province) || "South Africa";

  const suburb = cleanMetaText(property.suburb);

  const location = suburb
    ? `${suburb}, ${city}, ${province}`
    : `${city}, ${province}`;

  const formattedPrice = Number.isFinite(
    Number(property.price)
  )
    ? `R${Number(property.price).toLocaleString("en-ZA")}`
    : null;

  if (property.listing_type === "sale") {
    return `View this ${propertyType} for sale in ${location}${
      formattedPrice ? ` for ${formattedPrice}` : ""
    }. See photos, property details and location on HomeLinker.`;
  }

  return `View this ${propertyType} for rent in ${location}${
    formattedPrice ? ` for ${formattedPrice} per month` : ""
  }. See photos, property details and location on HomeLinker.`;
}

function makeAbsoluteImageUrl(url?: string | null) {
  if (!url) {
    return DEFAULT_OG_IMAGE;
  }

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${SITE_URL}${url}`;
  }

  return `${SITE_URL}/${url}`;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const property = await getPropertyBySlugOrId(id);

  if (!property) {
    return {
      title: "Property Not Found | HomeLinker",
      description:
        "The requested property could not be found on HomeLinker.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const isSale = property.listing_type === "sale";

  const propertyType =
    cleanMetaText(property.property_type) || "Property";

  const city =
    cleanMetaText(property.city) || "South Africa";

  const title = isSale
    ? `${property.title} for Sale in ${city} | HomeLinker`
    : `${property.title} for Rent in ${city} | HomeLinker`;

  const description = createMetaDescription(property);

  const propertyImages = Array.isArray(property.image_urls)
    ? property.image_urls.filter(
        (url): url is string =>
          typeof url === "string" &&
          url.trim().length > 0
      )
    : [];

  const image = makeAbsoluteImageUrl(
    propertyImages[0] || property.image_url
  );

  const canonicalSlug = createPropertySlug(
    property.title,
    property.city,
    property.id
  );

  const canonicalUrl =
    `${SITE_URL}/properties/${canonicalSlug}`;

  const keywords = [
    property.title,
    `${propertyType} ${
      isSale ? "for sale" : "for rent"
    } in ${city}`,
    property.suburb
      ? `${propertyType} ${
          isSale ? "for sale" : "for rent"
        } in ${property.suburb}`
      : null,
    `${
      isSale ? "property for sale" : "property for rent"
    } ${city}`,
    `${
      isSale ? "property for sale" : "property for rent"
    } South Africa`,
    property.province,
    "HomeLinker",
  ].filter(
    (keyword): keyword is string =>
      typeof keyword === "string" &&
      keyword.trim().length > 0
  );

  const shouldIndex =
    property.status === "active" ||
    property.status == null;

  return {
    title,
    description,
    keywords,

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: shouldIndex,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "HomeLinker",
      type: "website",
      locale: "en_ZA",

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${property.title} in ${city}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function PropertyDetails({
  params,
}: Props) {
  const { id } = await params;

  const property = await getPropertyBySlugOrId(id);

  if (!property) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-12 text-center shadow-lg">
          <h1 className="text-4xl font-black text-black">
            Property not found
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            The listing you requested could not be found.
          </p>

          <Link
            href="/properties"
            className="mt-8 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Browse Properties
          </Link>
        </div>
      </main>
    );
  }

  /*
   * PROPERTY IMAGES
   */
  const propertyImages = Array.isArray(property.image_urls)
    ? property.image_urls.filter(
        (url): url is string =>
          typeof url === "string" &&
          url.trim().length > 0
      )
    : [];

  const images =
    propertyImages.length > 0
      ? propertyImages
      : [property.image_url || "/og-image.png"];

  /*
   * CANONICAL PROPERTY URL
   */
  const canonicalSlug = createPropertySlug(
    property.title,
    property.city,
    property.id
  );

  const canonicalUrl =
    `${SITE_URL}/properties/${canonicalSlug}`;

  /*
   * Redirect old numeric or incorrect URLs.
   */
  if (id !== canonicalSlug) {
    redirect(canonicalUrl);
  }

  /*
   * ADDRESS
   */
  const streetAddress =
    property.street_address ||
    property.address ||
    "";

  /*
   * IMPORTANT:
   *
   * The public property query intentionally does NOT
   * retrieve contact_phone or contact_number.
   *
   * ContactOwner is responsible for retrieving any
   * publicly available contact number through the
   * protected contact flow.
   */
  const contactNumber: string | null = null;

  /*
   * Do not infer private user information.
   */
  const contactName =
    property.owner_name || "Advertiser";

  const isVerified = property.verified === true;

  /*
   * STRUCTURED DATA
   */
  const normalizedPropertyType =
    property.property_type?.toLowerCase().trim();

  const propertySchemaType =
    normalizedPropertyType === "house"
      ? "SingleFamilyResidence"
      : normalizedPropertyType === "apartment" ||
          normalizedPropertyType === "flat"
        ? "Apartment"
        : "Residence";

  const isSale =
    property.listing_type === "sale";

  const schemaAvailability =
    property.status === "sold" ||
    property.status === "rented"
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock";

  const schemaDescription =
    createMetaDescription(property);

  const schemaImages = images.map(
    makeAbsoluteImageUrl
  );

  const schema = {
    "@context": "https://schema.org",

    "@graph": [
      {
        "@type": "BreadcrumbList",

        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "Properties",
            item: `${SITE_URL}/properties`,
          },

          {
            "@type": "ListItem",
            position: 3,
            name: property.title,
            item: canonicalUrl,
          },
        ],
      },

      {
        "@type": "RealEstateListing",
        "@id": `${canonicalUrl}#listing`,
        url: canonicalUrl,
        name: property.title,
        description: schemaDescription,
        image: schemaImages,

        datePosted:
          property.published_at ||
          property.created_at ||
          undefined,

        about: {
          "@type": propertySchemaType,
          name: property.title,

          numberOfRooms:
            property.bedrooms ?? undefined,

          numberOfBathroomsTotal:
            property.bathrooms ?? undefined,

          address: {
            "@type": "PostalAddress",

            ...(streetAddress
              ? {
                  streetAddress,
                }
              : {}),

            ...(property.suburb
              ? {
                  addressLocality:
                    property.suburb,
                }
              : {
                  addressLocality:
                    property.city,
                }),

            ...(property.province
              ? {
                  addressRegion:
                    property.province,
                }
              : {}),

            addressCountry: "ZA",
          },

          ...(property.latitude != null &&
          property.longitude != null
            ? {
                geo: {
                  "@type":
                    "GeoCoordinates",

                  latitude:
                    property.latitude,

                  longitude:
                    property.longitude,
                },
              }
            : {}),
        },

        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "ZAR",
          availability: schemaAvailability,
          url: canonicalUrl,

          businessFunction: isSale
            ? "http://purl.org/goodrelations/v1#Sell"
            : "http://purl.org/goodrelations/v1#LeaseOut",
        },
      },
    ],
  };

  const formattedPrice =
    `R${Number(property.price).toLocaleString("en-ZA")}`;

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        {/* BREADCRUMB */}

        <nav
          aria-label="Breadcrumb"
          className="mb-4 hidden text-sm text-slate-500 sm:block"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/"
                className="hover:text-[#C9A227]"
              >
                Home
              </Link>
            </li>

            <li>/</li>

            <li>
              <Link
                href="/properties"
                className="hover:text-[#C9A227]"
              >
                Properties
              </Link>
            </li>

            <li>/</li>

            <li
              className="text-slate-700"
              aria-current="page"
            >
              {property.title}
            </li>
          </ol>
        </nav>

        {/* GALLERY */}

        <PropertyGallery
          images={images}
          altText={`${property.title} — ${property.city}, ${property.province}`}
        />

        {/* MAIN GRID */}

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          {/* LEFT */}

          <div className="lg:col-span-2">
            {/* TITLE */}

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold leading-tight text-[#1B1B1B] sm:text-3xl lg:text-4xl">
                  {property.title}
                </h1>

                <p className="mt-2 text-sm text-slate-600 sm:text-base">
                  {streetAddress
                    ? `${streetAddress}, `
                    : ""}

                  {property.suburb
                    ? `${property.suburb}, `
                    : ""}

                  {property.city},{" "}
                  {property.province}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FavoriteButton
                  propertyId={property.id}
                  className="rounded-full border border-[#E8D8A5] bg-white p-2.5 text-[#C9A227] shadow-sm transition hover:scale-105 sm:p-3"
                />

                <ReportListingButton
                  propertyId={property.id}
                />
              </div>
            </div>

            {/* BADGES */}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(property.status === "sold" ||
                property.status === "rented") && (
                <span className="rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {property.status === "sold"
                    ? "Sold"
                    : "Rented"}
                </span>
              )}

              {isVerified && (
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  ✔ Verified Property
                </span>
              )}

              {property.user_id ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Registered Advertiser
                </span>
              ) : null}
            </div>

            {/* MOBILE PRICE */}

            <p className="mt-5 text-3xl font-bold text-[#C9A227] lg:hidden">
              {formattedPrice}

              {!isSale && (
                <span className="ml-1 text-base font-medium text-slate-500">
                  / month
                </span>
              )}
            </p>

            {/* DETAILS */}

            <div className="mt-6 grid grid-cols-4 gap-2 rounded-2xl border border-[#E8D8A5] bg-white p-4 sm:gap-4 sm:p-5">
              <div className="text-center">
                <BedDouble
                  size={20}
                  className="mx-auto text-[#C9A227]"
                />

                <p className="mt-1.5 text-base font-bold text-[#1B1B1B] sm:text-lg">
                  {property.bedrooms ?? 0}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Beds
                </p>
              </div>

              <div className="text-center">
                <Bath
                  size={20}
                  className="mx-auto text-[#C9A227]"
                />

                <p className="mt-1.5 text-base font-bold text-[#1B1B1B] sm:text-lg">
                  {property.bathrooms ?? 0}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Baths
                </p>
              </div>

              <div className="text-center">
                <CarFront
                  size={20}
                  className="mx-auto text-[#C9A227]"
                />

                <p className="mt-1.5 text-base font-bold text-[#1B1B1B] sm:text-lg">
                  {property.parking ?? 0}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Parking
                </p>
              </div>

              <div className="text-center">
                <HomeIcon
                  size={20}
                  className="mx-auto text-[#C9A227]"
                />

                <p className="mt-1.5 truncate text-base font-bold capitalize text-[#1B1B1B] sm:text-lg">
                  {property.property_type ||
                    "—"}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Type
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-8">
              <h2 className="mb-3 text-xl font-bold text-[#1B1B1B] sm:text-2xl">
                Description
              </h2>

              <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-8">
                {property.description ||
                  "No description provided."}
              </p>
            </div>

            {/* MOBILE CONTACT */}

            <div className="mt-8 lg:hidden">
              <ContactOwner
                propertyId={property.id}
                title={property.title}
                contactNumber={contactNumber}
                contactName={contactName}
                ownerId={
                  property.user_id ?? null
                }
                createdAt={
                  property.created_at ?? null
                }
              />
            </div>

            {/* MAP */}

            {property.latitude != null &&
            property.longitude != null ? (
              <div className="mt-8">
                <h2 className="mb-3 text-xl font-bold text-[#1B1B1B] sm:text-2xl">
                  Location
                </h2>

                <PropertyMap
                  latitude={property.latitude}
                  longitude={property.longitude}
                  title={property.title}
                />
              </div>
            ) : null}

            {/* BACK */}

            <div className="mt-8">
              <Link
                href="/properties"
                className="inline-flex rounded-xl border border-[#1B1B1B] px-6 py-3 text-sm font-semibold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
              >
                ← Back to all properties
              </Link>
            </div>
          </div>

          {/* DESKTOP SIDEBAR */}

          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-6 rounded-2xl border border-[#E8D8A5] bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold text-[#C9A227]">
                {formattedPrice}

                {!isSale && (
                  <span className="ml-1 text-base font-medium text-slate-500">
                    / month
                  </span>
                )}
              </p>

              <div className="mt-4 space-y-1 border-t border-[#F0EAD2] pt-4 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-[#1B1B1B]">
                    Location:
                  </span>{" "}
                  {property.city},{" "}
                  {property.province}
                </p>

                <p>
                  <span className="font-semibold text-[#1B1B1B]">
                    Property type:
                  </span>{" "}
                  <span className="capitalize">
                    {property.property_type ||
                      "Property"}
                  </span>
                </p>
              </div>

              <div className="mt-5">
                <ContactOwner
                  propertyId={property.id}
                  title={property.title}
                  contactNumber={contactNumber}
                  contactName={contactName}
                  ownerId={
                    property.user_id ?? null
                  }
                  createdAt={
                    property.created_at ?? null
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}