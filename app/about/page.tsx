import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.homelinker.co.za";
const CONTACT_EMAIL = "noreplyhomelinker@gmail.com";

export const metadata: Metadata = {
  title: "About HomeLinker | South Africa's Property Marketplace",
  description:
    "Learn about HomeLinker, a South African property marketplace helping people discover rooms, flats, apartments and houses to rent or buy.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About HomeLinker | South Africa's Property Marketplace",
    description:
      "HomeLinker helps people across South Africa discover properties to rent or buy and helps property advertisers reach people looking for a home.",
    url: `${SITE_URL}/about`,
    siteName: "HomeLinker",
    locale: "en_ZA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${SITE_URL}/about#aboutpage`,
    url: `${SITE_URL}/about`,
    name: "About HomeLinker",
    description:
      "HomeLinker is a South African property marketplace helping people discover properties to rent or buy.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
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

        <h1 className="mt-3 text-4xl font-black leading-tight text-black sm:text-5xl">
          Making property discovery simpler for South Africans.
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-700">
          HomeLinker is a South African property marketplace where people can
          search for rooms, flats, apartments and houses to rent or buy, while
          property owners and authorised advertisers can publish properties
          and connect with people looking for a home.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Our goal is simple: make it easier to discover available properties,
          compare important information and connect with property advertisers
          without making the process unnecessarily complicated.
        </p>

        {/* WHAT HOMELINKER DOES */}
        <h2 className="mt-10 text-2xl font-black text-black">
          What HomeLinker Does
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker brings rental and sale property listings together in one
          place. People searching for property can browse available listings,
          view photos and important property information, compare options and
          contact advertisers using the contact features available on the
          platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Property owners and authorised advertisers can create listings with
          information such as pricing, location, photographs, bedrooms,
          bathrooms, property features and contact details.
        </p>

        {/* WHO IT IS FOR */}
        <h2 className="mt-10 text-2xl font-black text-black">
          Who HomeLinker Is For
        </h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-black text-black">
              Renters & Buyers
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Search available properties by location and property type, view
              important listing details and contact property advertisers about
              homes that interest you.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-6">
            <h3 className="text-lg font-black text-black">
              Property Advertisers
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Create property listings and reach people actively searching for
              places to rent or buy. HomeLinker offers a free listing option
              together with optional paid visibility features.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <h2 className="mt-10 text-2xl font-black text-black">
          How HomeLinker Works
        </h2>

        <div className="mt-6 space-y-5">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF3C4] font-black text-[#8A6800]">
              1
            </div>

            <div>
              <h3 className="font-bold text-black">
                Discover properties
              </h3>

              <p className="mt-1 leading-7 text-slate-600">
                Browse rental and sale listings and narrow your search using
                property information such as location, type and price.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF3C4] font-black text-[#8A6800]">
              2
            </div>

            <div>
              <h3 className="font-bold text-black">
                Review the details
              </h3>

              <p className="mt-1 leading-7 text-slate-600">
                View photographs, pricing, property features, location
                information and other details supplied with the listing.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF3C4] font-black text-[#8A6800]">
              3
            </div>

            <div>
              <h3 className="font-bold text-black">
                Contact the advertiser
              </h3>

              <p className="mt-1 leading-7 text-slate-600">
                Use the available HomeLinker contact features to ask questions,
                arrange a viewing or discuss the property directly with the
                advertiser.
              </p>
            </div>
          </div>
        </div>

        {/* SOUTH AFRICA */}
        <h2 className="mt-10 text-2xl font-black text-black">
          Built for the South African Property Market
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is focused on property in South Africa. Listings can
          include properties from major cities, suburbs, townships and other
          communities across the country.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          As the marketplace grows, our aim is to make it easier to discover
          both affordable and traditional housing options across different
          parts of South Africa.
        </p>

        {/* TRUST */}
        <h2 className="mt-10 text-2xl font-black text-black">
          Trust and Safer Property Searching
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Finding a home can involve important financial decisions. HomeLinker
          provides features designed to help users understand listings and
          report suspicious or inappropriate content.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          However, HomeLinker is a marketplace and does not guarantee every
          property, advertiser or transaction simply because it appears on the
          platform. Users should perform appropriate checks before transferring
          money, paying a deposit or entering into an agreement.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Our{" "}
          <Link
            href="/blog/how-to-avoid-rental-scams-south-africa"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            guide to avoiding rental scams
          </Link>{" "}
          provides practical information for people searching for rental
          property.
        </p>

        {/* MARKETPLACE */}
        <h2 className="mt-10 text-2xl font-black text-black">
          HomeLinker Is a Marketplace
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Unless specifically stated otherwise, HomeLinker is not the owner,
          landlord, estate agent, property practitioner, buyer, tenant or
          seller of properties advertised by users.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker provides technology that helps property advertisers and
          people searching for property discover and communicate with each
          other.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users remain responsible for evaluating properties, advertisers and
          transactions before making financial or legal commitments. More
          information is available in our{" "}
          <Link
            href="/terms"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Terms & Conditions
          </Link>
          .
        </p>

        {/* OUR APPROACH */}
        <h2 className="mt-10 text-2xl font-black text-black">
          Our Approach
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is being built around simplicity, accessibility and
          useful property information. We want the platform to be easy to use
          whether someone is searching from a computer or a mobile phone.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          We also believe useful property platforms should provide more than
          listings. Our{" "}
          <Link
            href="/blog"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            property guides
          </Link>{" "}
          provide practical information about renting, property searches,
          affordability, viewings and safer property decisions in South
          Africa.
        </p>

        {/* CONTACT */}
        <div className="mt-10 rounded-2xl border border-[#C9A227]/30 bg-[#FFF9E8] p-6 sm:p-8">
          <h2 className="text-2xl font-black text-black">
            Questions about HomeLinker?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            If you have a question, need help with the platform or want to
            report a problem, you can contact HomeLinker at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-xl border border-[#C9A227] px-5 py-3 text-sm font-bold text-[#8A6800] transition hover:bg-white"
          >
            Contact HomeLinker
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-black text-black">
            Start exploring HomeLinker
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Browse available properties or learn more about using HomeLinker.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/properties"
              className="rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-black transition hover:bg-[#A67C00]"
            >
              Browse Properties
            </Link>

            <Link
              href="/post-listing"
              className="rounded-xl border border-[#C9A227] px-6 py-3 font-bold text-[#8A6800] transition hover:bg-[#FFF9E8]"
            >
              List a Property
            </Link>

            <Link
              href="/faq"
              className="rounded-xl border border-[#1B1B1B] px-6 py-3 font-bold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
            >
              Read the FAQ
            </Link>
          </div>
        </div>

        {/* POLICIES */}
        <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm font-semibold">
          <Link
            href="/privacy"
            className="text-[#A67C00] hover:text-[#C9A227]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="text-[#A67C00] hover:text-[#C9A227]"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/cookie-policy"
            className="text-[#A67C00] hover:text-[#C9A227]"
          >
            Cookie Policy
          </Link>

          <Link
            href="/contact"
            className="text-[#A67C00] hover:text-[#C9A227]"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}