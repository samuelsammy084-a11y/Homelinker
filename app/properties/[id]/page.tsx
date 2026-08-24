import type { Metadata } from "next";
import type { Property } from "@/app/types/property";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  createPropertySlug,
  getPropertyIdFromSlug,
} from "@/lib/property-slug";
import Link from "next/link";
import { BedDouble, Bath, CarFront, Home as HomeIcon } from "lucide-react";
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

// Site-wide canonical domain — must match metadataBase in app/layout.tsx.
const SITE_URL = "https://www.homelinker.co.za";

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
        canonical: `${SITE_URL}/properties`,
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

  const canonicalUrl = `${SITE_URL}/properties/${canonicalSlug}`;

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

  const canonicalUrl = `${SITE_URL}/properties/${canonicalSlug}`;

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

  const isVerified =
    property.verified ||
    property.verification_status === "verified";

  /*
   * Structured data for Google.
   */
  const propertySchemaType =
    property.property_type?.toLowerCase() === "house"
      ? "SingleFamilyResidence"
      : property.property_type?.toLowerCase() === "apartment" ||
        property.property_type?.toLowerCase() === "flat"
      ? "Apartment"
      : "Residence";

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
        description: property.description || undefined,
        image: images,
        datePosted: property.created_at || undefined,

        about: {
          "@type": propertySchemaType,
          name: property.title,
          numberOfRooms: property.bedrooms ?? undefined,
          numberOfBathroomsTotal: property.bathrooms ?? undefined,

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
        },

        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "ZAR",
          availability: "https://schema.org/InStock",
          businessFunction:
            property.listing_type === "sale"
              ? "http://purl.org/goodrelations/v1#Sell"
              : "http://purl.org/goodrelations/v1#LeaseOut",
        },
      },
    ],
  };

  const formattedPrice = `R${Number(property.price).toLocaleString("en-ZA")}`;

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Breadcrumb — hidden on mobile to save space, visible from sm up */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 hidden text-sm text-slate-500 sm:block"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#C9A227]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/properties" className="hover:text-[#C9A227]">
                Properties
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-700" aria-current="page">
              {property.title}
            </li>
          </ol>
        </nav>

        {/* Gallery */}
        <PropertyGallery
          images={images}
          altText={`${property.title} — ${property.city}, ${property.province}`}
        />

        {/* ---------- MAIN GRID: content + sticky sidebar ---------- */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">

          {/* LEFT: main content */}
          <div className="lg:col-span-2">

            {/* Title + actions */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold leading-tight text-[#1B1B1B] sm:text-3xl lg:text-4xl">
                  {property.title}
                </h1>

                <p className="mt-2 text-sm text-slate-600 sm:text-base">
                  {streetAddress ? `${streetAddress}, ` : ""}
                  {property.suburb ? `${property.suburb}, ` : ""}
                  {property.city}, {property.province}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <FavoriteButton
                  propertyId={property.id}
                  className="rounded-full border border-[#E8D8A5] bg-white p-2.5 text-[#C9A227] shadow-sm transition hover:scale-105 sm:p-3"
                />

                <ReportListingButton propertyId={property.id} />
              </div>
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {isVerified ? (
                <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  ✔ Verified Property
                </span>
              ) : (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  ⏳ Pending Verification
                </span>
              )}

              {property.user_id ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Verified Landlord
                </span>
              ) : null}
            </div>

            {/* Price — visible here on mobile only, since sidebar is desktop-only */}
            <p className="mt-5 text-3xl font-bold text-[#C9A227] lg:hidden">
              {formattedPrice}
              {property.listing_type === "sale" ? "" : (
                <span className="ml-1 text-base font-medium text-slate-500">
                  / month
                </span>
              )}
            </p>

            {/* Key details */}
            <div className="mt-6 grid grid-cols-4 gap-2 rounded-2xl border border-[#E8D8A5] bg-white p-4 sm:gap-4 sm:p-5">
              <div className="text-center">
                <BedDouble size={20} className="mx-auto text-[#C9A227]" />
                <p className="mt-1.5 text-base font-bold text-[#1B1B1B] sm:text-lg">
                  {property.bedrooms ?? 0}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Beds
                </p>
              </div>

              <div className="text-center">
                <Bath size={20} className="mx-auto text-[#C9A227]" />
                <p className="mt-1.5 text-base font-bold text-[#1B1B1B] sm:text-lg">
                  {property.bathrooms ?? 0}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Baths
                </p>
              </div>

              <div className="text-center">
                <CarFront size={20} className="mx-auto text-[#C9A227]" />
                <p className="mt-1.5 text-base font-bold text-[#1B1B1B] sm:text-lg">
                  {property.parking ?? 0}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Parking
                </p>
              </div>

              <div className="text-center">
                <HomeIcon size={20} className="mx-auto text-[#C9A227]" />
                <p className="mt-1.5 truncate text-base font-bold capitalize text-[#1B1B1B] sm:text-lg">
                  {property.property_type || "—"}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                  Type
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="mb-3 text-xl font-bold text-[#1B1B1B] sm:text-2xl">
                Description
              </h2>

              <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700 sm:text-base sm:leading-8">
                {property.description || "No description provided."}
              </p>
            </div>

            {/* Contact — inline on mobile, since sidebar is desktop-only */}
            <div className="mt-8 lg:hidden">
              <ContactOwner
                propertyId={property.id}
                title={property.title}
                contactNumber={contactNumber}
                contactName={contactName}
                ownerId={property.user_id ?? null}
                createdAt={property.created_at ?? null}
              />
            </div>

            {/* Map */}
            {property.latitude != null && property.longitude != null ? (
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

            {/* Back */}
            <div className="mt-8">
              <Link
                href="/properties"
                className="inline-flex rounded-xl border border-[#1B1B1B] px-6 py-3 text-sm font-semibold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
              >
                ← Back to all properties
              </Link>
            </div>
          </div>

          {/* RIGHT: sticky price + contact sidebar (desktop only) */}
          <div className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-6 rounded-2xl border border-[#E8D8A5] bg-white p-6 shadow-sm">
              <p className="text-3xl font-bold text-[#C9A227]">
                {formattedPrice}
                {property.listing_type === "sale" ? "" : (
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
                  {property.city}, {property.province}
                </p>
                <p>
                  <span className="font-semibold text-[#1B1B1B]">
                    Property type:
                  </span>{" "}
                  <span className="capitalize">
                    {property.property_type || "Property"}
                  </span>
                </p>
              </div>

              <div className="mt-5">
                <ContactOwner
                  propertyId={property.id}
                  title={property.title}
                  contactNumber={contactNumber}
                  contactName={contactName}
                  ownerId={property.user_id ?? null}
                  createdAt={property.created_at ?? null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}