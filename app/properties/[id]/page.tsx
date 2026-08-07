import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { createPropertySlug, getPropertyIdFromSlug } from "@/lib/property-slug";
import Link from "next/link";
import PropertyGallery from "@/app/components/PropertyGallery";
import PropertyMap from "@/app/components/PropertyMap";
import FavoriteButton from "@/app/components/FavoriteButton";
import ReportListingButton from "@/app/components/ReportListingButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getPropertyBySlugOrId(slug: string) {
  const numericId = getPropertyIdFromSlug(slug);

  const query = supabase
    .from("properties")
    .select("*")
    .eq("id", numericId ?? -1)
    .maybeSingle();

  const { data: property, error } = await query;

  if (error) {
    console.error("Property fetch error", error);
    return null;
  }

  if (property) {
    return property;
  }

  return null;
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
    `View this ${property.property_type} in ${property.city}, ${property.province}. See photos, price and contact details on HomeLinker.`;
  const image =
    property.image_urls?.length > 0
      ? property.image_urls[0]
      : property.image_url || "/og-image.jpg";
  const canonicalSlug = createPropertySlug(property.title, property.city, property.id);
  const canonicalUrl = `https://homelinker.co.za/properties/${canonicalSlug}`;

  return {
    title,
    description,
    keywords: [
      property.title,
      property.city,
      property.province,
      property.property_type,
      "HomeLinker",
      "South Africa property",
    ],
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

export default async function PropertyDetails({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyBySlugOrId(id);

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F8F6F1]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black">Property not found</h1>
          <p className="mt-3 text-slate-600">The listing you requested could not be found.</p>
        </div>
      </main>
    );
  }

  const images =
    property.image_urls?.length
      ? property.image_urls
      : [
          property.image_url ||
            "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
        ];
  const canonicalSlug = createPropertySlug(property.title, property.city, property.id);
  const canonicalUrl = `https://homelinker.co.za/properties/${canonicalSlug}`;

  if (id !== canonicalSlug) {
    redirect(canonicalUrl);
  }

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
        description: property.description,
        image: images,
        url: canonicalUrl,
        address: {
          "@type": "PostalAddress",
          streetAddress: property.street_address,
          addressLocality: property.city,
          addressRegion: property.province,
          addressCountry: "ZA",
        },
        geo:
          property.latitude && property.longitude
            ? {
                "@type": "GeoCoordinates",
                latitude: property.latitude,
                longitude: property.longitude,
              }
            : undefined,
        offers: {
          "@type": "Offer",
          price: property.price,
          priceCurrency: "ZAR",
          availability: "https://schema.org/InStock",
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
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <PropertyGallery images={images} altText={property.title} />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-5xl font-bold text-black">
            {property.title}
          </h1>

          <div className="flex items-center gap-2">
            <FavoriteButton
              propertyId={property.id}
              className="rounded-full border border-[#E8D8A5] bg-white p-3 text-[#C9A227] shadow-sm transition hover:scale-105"
            />

            <ReportListingButton propertyId={property.id} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {property.verification_status === "verified" ? (
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

        <p className="text-[#C9A227] text-4xl font-bold mt-4">
          R{property.price.toLocaleString("en-ZA")} / month
        </p>

        <div className="mt-3 space-y-1">
          <p className="text-lg font-medium text-[#1B1B1B]">
            📍 {property.street_address}
          </p>

          <p className="text-[#1B1B1B]">
            {property.suburb}
          </p>

          <p className="text-[#1B1B1B]">
            {property.city}, {property.province}
          </p>
        </div>

        <div className="flex flex-wrap gap-8 mt-10 text-lg text-black">
          <div>🛏 {property.bedrooms} Bedrooms</div>
          <div>🛁 {property.bathrooms} Bathrooms</div>
          <div>🚗 {property.parking} Parking</div>
          <div>🏠 {property.property_type}</div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Description
          </h2>

          <p className="text-black leading-8 text-lg">
            {property.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-12">
          {property.contact_number ? (
            <>
              <a
                href={`tel:${property.contact_number}`}
                className="bg-[#C9A227] text-white px-8 py-4 rounded-xl font-semibold"
              >
                📞 Call
              </a>

              <a
                href={`https://wa.me/27${property.contact_number.replace(
                  /^0/,
                  ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold"
              >
                💬 WhatsApp
              </a>
            </>
          ) : (
            <div className="rounded-xl bg-yellow-100 px-8 py-4 font-semibold text-yellow-800">
              Contact number not available yet
            </div>
          )}

          <Link
            href="/properties"
            className="border border-black text-black px-8 py-4 rounded-xl"
          >
            ← Back
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <p className="font-semibold text-[#1B1B1B]">Property details</p>
          <p className="mt-2">Location: {property.city}, {property.province}</p>
          <p className="mt-1">Property type: {property.property_type}</p>
        </div>

        {property.latitude && property.longitude && (
          <PropertyMap
            latitude={property.latitude}
            longitude={property.longitude}
            title={property.title}
          />
        )}
      </div>
    </main>
  );
}