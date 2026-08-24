import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.homelinker.co.za";

export const metadata: Metadata = {
  title: "About HomeLinker | South Africa's Property Marketplace",
  description:
    "HomeLinker is a South African property marketplace connecting renters and buyers with rooms, apartments, flats and houses across the country. Learn how it works.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About HomeLinker | South Africa's Property Marketplace",
    description:
      "HomeLinker is a South African property marketplace connecting renters and buyers with rooms, apartments, flats and houses across the country.",
    url: `${SITE_URL}/about`,
    siteName: "HomeLinker",
    locale: "en_ZA",
    type: "website",
  },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#aboutpage`,
    url: `${SITE_URL}/about`,
    name: "About HomeLinker",
    isPartOf: {
      "@type": "WebSite",
      name: "HomeLinker",
      url: SITE_URL,
    },
    mainEntity: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
          About HomeLinker
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Find your next home with confidence.
        </h1>

        {/* Plain-language definition — the sentence most likely to be
            lifted directly by Google AI Overviews / ChatGPT / Perplexity
            when someone asks "what is HomeLinker". Keep it factual and
            self-contained, since it may be quoted without surrounding
            context. */}
        <p className="mt-6 text-lg leading-8 text-slate-700">
          HomeLinker is a South African property marketplace where people can
          search for rooms, apartments, flats and houses to rent or buy, and
          where property owners can list their properties directly, for
          free.
        </p>

        <h2 className="mt-10 text-2xl font-black text-black">
          What HomeLinker does
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker brings South African rental and sale listings together
          in one place. Whether someone is looking for an affordable room in
          Tembisa, a flat in Mayfair West, or a family house in Pretoria,
          HomeLinker helps them search by city, suburb, province, price and
          property type — and contact the property owner directly.
        </p>

        <h2 className="mt-10 text-2xl font-black text-black">
          How it works
        </h2>

        <ul className="mt-4 space-y-3 leading-8 text-slate-600">
          <li>
            <span className="font-semibold text-[#1B1B1B]">
              For renters and buyers:
            </span>{" "}
            browse listings by location, view photos and property details,
            and contact the owner directly through WhatsApp or the site.
          </li>
          <li>
            <span className="font-semibold text-[#1B1B1B]">
              For property owners:
            </span>{" "}
            create an account and post a property listing for free, with
            photos, pricing, and contact details.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-black text-black">
          Where HomeLinker operates
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker lists properties across South Africa, including major
          cities such as Johannesburg, Pretoria, Cape Town and Durban, as
          well as their surrounding suburbs and townships.
        </p>

        <h2 className="mt-10 text-2xl font-black text-black">Our approach</h2>

        <p className="mt-4 leading-8 text-slate-600">
          We are building HomeLinker with simplicity, trust and
          accessibility at the centre of the experience — making it easier
          for South Africans to find a place to live, and for property
          owners to reach people looking for a home.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/properties"
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-black transition hover:bg-[#A67C00]"
          >
            Browse properties
          </Link>

          <Link
            href="/faq"
            className="rounded-xl border border-[#1B1B1B] px-6 py-3 font-bold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
          >
            Frequently asked questions
          </Link>
        </div>
      </div>
    </main>
  );
}