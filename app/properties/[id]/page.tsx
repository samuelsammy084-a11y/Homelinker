import type { Metadata } from "next";
import type { Property } from "@/app/types/property";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  createPropertySlug,
  getPropertyIdFromSlug,
} from "@/lib/property-slug";
import Link from "next/link";
import PropertyMap from "@/app/components/PropertyMap";
import FavoriteButton from "@/app/components/FavoriteButton";
import ReportListingButton from "@/app/components/ReportListingButton";
import ContactOwner from "@/app/components/ContactOwner";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/*
 * Some of these fields may exist in Supabase even though
 * they are not currently included in the main Property type.
 */
type PropertyDetails = Property & {
  street_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  verification_status?: string | null;
  contact_number?: string | null;
  contact_name?: string | null;
};

async function getPropertyBySlugOrId(
  slug: string
): Promise<PropertyDetails | null> {
  const numericId = getPropertyIdFromSlug(slug);

  if (numericId == null) {
    return null;
  }

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", numericId)
    .maybeSingle();

  if (error) {
    console.error("Property fetch error:", error);
    return null;
  }

  return property as PropertyDetails | null;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyBySlugOrId(id);

  if (!property) {
    return {
      title: "Property Not Found | HomeLinker",
      description: "The requested property could not be found.",
      alternates: {
        canonical: "https://homelinker.co.za/properties",
      },
    };
  }

  const title = `${property.title} in ${property.city} | HomeLinker`;

  const description =
    property.description?.trim() ||
    `View this ${
      property.property_type || "property"
    } in ${property.city}, ${property.province}. See photos, price and contact details on HomeLinker.`;

  const images = Array.isArray(property.image_urls)
    ? property.image_urls.filter(
        (url): url is string =>
          typeof url === "string" && url.length > 0
      )
    : [];

  const image =
    images.length > 0
      ? images[0]
      : property.image_url || "/og-image.jpg";

  const canonicalSlug = createPropertySlug(
    property.title,
    property.city,
    property.id
  );

  const canonicalUrl = `https://homelinker.co.za/properties/${canonicalSlug}`;

  const keywords = [
    property.title,
    property.city,
    property.province,
    property.property_type,
    "HomeLinker",
    "South Africa property",
    "property for rent South Africa",
    "houses for rent South Africa",
    "apartments for rent South Africa",
  ].filter((keyword): keyword is string => Boolean(keyword));

  return {
    title,
    description,

    keywords,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "HomeLinker",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: property.title,
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
   * Property images
   */
  const propertyImages = Array.isArray(
    property.image_urls
  )
    ? property.image_urls.filter(
        (url): url is string =>
          typeof url === "string" && url.length > 0
      )
    : [];

  const images =
    propertyImages.length > 0
      ? propertyImages
      : [
          property.image_url || "/og-image.jpg",
        ];

  /*
   * Canonical property URL
   */
  const canonicalSlug = createPropertySlug(
    property.title,
    property.city,
    property.id
  );

  const canonicalUrl = `https://homelinker.co.za/properties/${canonicalSlug}`;

  /*
   * Redirect old numeric/incorrect URLs
   */
  if (id !== canonicalSlug) {
    redirect(canonicalUrl);
  }

  /*
   * Optional fields
   */
  const streetAddress =
    property.street_address ||
    property.address ||
    "";

  const contactNumber =
    property.contact_number ?? null;

  const contactName =
    property.contact_name ??
    property.owner_name ??
    null;

  /*
   * Structured data for Google
   */
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
            item: "https://homelinker.co.za",
          },

          {
            "@type": "ListItem",
            position: 2,
            name: "Properties",
            item: "https://homelinker.co.za/properties",
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
        "@type": "Residence",

        name: property.title,

        description:
          property.description || undefined,

        image: images,

        url: canonicalUrl,

        address: {
          "@type": "PostalAddress",
          streetAddress: streetAddress,
          addressLocality: property.city,
          addressRegion: property.province,
          addressCountry: "ZA",
        },

        ...(property.latitude != null &&
        property.longitude != null
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: property.latitude,
                longitude: property.longitude,
              },
            }
          : {}),

        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "ZAR",
          availability:
            "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-5xl font-bold text-black">
            {property.title}
          </h1>

          <div className="flex items-center gap-2">
            <FavoriteButton
              propertyId={property.id}
              className="rounded-full border border-[#E8D8A5] bg-white p-3 text-[#C9A227] shadow-sm transition hover:scale-105"
            />

            <ReportListingButton
              propertyId={property.id}
            />
          </div>
        </div>

        {/* Verification */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {property.verified ||
          property.verification_status ===
            "verified" ? (
            <span className="rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
              ✔ Verified Property
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
              ⏳ Pending Verification
            </span>
          )}

          {property.user_id ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              Verified Landlord
            </span>
          ) : null}
        </div>

        {/* Price */}
        <p className="mt-4 text-4xl font-bold text-[#C9A227]">
          R
          {Number(property.price).toLocaleString(
            "en-ZA"
          )}
          {property.listing_type === "sale"
            ? ""
            : " / month"}
        </p>

        {/* Location */}
        <div className="mt-3 space-y-1">
          {streetAddress ? (
            <p className="text-lg font-medium text-[#1B1B1B]">
              📍 {streetAddress}
            </p>
          ) : null}

          {property.suburb ? (
            <p className="text-[#1B1B1B]">
              {property.suburb}
            </p>
          ) : null}

          <p className="text-[#1B1B1B]">
            {property.city},{" "}
            {property.province}
          </p>
        </div>

        {/* Property details */}
        <div className="mt-10 flex flex-wrap gap-8 text-lg text-black">
          <div>
            🛏 {property.bedrooms ?? 0} Bedrooms
          </div>

          <div>
            🛁 {property.bathrooms ?? 0} Bathrooms
          </div>

          <div>
            🚗 {property.parking ?? 0} Parking
          </div>

          <div>
            🏠{" "}
            {property.property_type ||
              "Property"}
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <h2 className="mb-4 text-3xl font-bold text-black">
            Description
          </h2>

          <p className="text-lg leading-8 text-black">
            {property.description ||
              "No description provided."}
          </p>
        </div>

        {/* Contact Owner */}
        <ContactOwner
          propertyId={property.id}
          title={property.title}
          contactNumber={contactNumber}
          contactName={contactName}
          ownerId={property.user_id ?? null}
          createdAt={property.created_at ?? null}
        />

        {/* Back */}
        <div className="mt-8">
          <Link
            href="/properties"
            className="inline-flex rounded-xl border border-black px-8 py-4 text-black transition hover:bg-black hover:text-white"
          >
            ← Back
          </Link>
        </div>

        {/* Property details box */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <p className="font-semibold text-[#1B1B1B]">
            Property details
          </p>

          <p className="mt-2">
            Location: {property.city},{" "}
            {property.province}
          </p>

          <p className="mt-1">
            Property type:{" "}
            {property.property_type ||
              "Property"}
          </p>
        </div>

        {/* Map */}
        {property.latitude != null &&
        property.longitude != null ? (
          <PropertyMap
            latitude={property.latitude}
            longitude={property.longitude}
            title={property.title}
          />
        ) : null}

      </div>
    </main>
  );
}