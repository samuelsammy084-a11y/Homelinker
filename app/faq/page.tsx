import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.homelinker.co.za";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | HomeLinker",
  description:
    "Answers to common questions about renting, buying, and listing property on HomeLinker, South Africa's property marketplace.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "Frequently Asked Questions | HomeLinker",
    description:
      "Answers to common questions about renting, buying, and listing property on HomeLinker, South Africa's property marketplace.",
    url: `${SITE_URL}/faq`,
    siteName: "HomeLinker",
    locale: "en_ZA",
    type: "website",
  },
};

// Keep FAQ content in one array so the visible page and the JSON-LD
// schema always stay in sync — Google penalizes schema that doesn't
// match what's actually shown on the page.
const faqs = [
  {
    question: "What is HomeLinker?",
    answer:
      "HomeLinker is a South African property marketplace where people can search for rooms, apartments, flats and houses to rent or buy, and where property owners can list their properties directly.",
  },
  {
    question: "Is it free to use HomeLinker?",
    answer:
      "Yes. Browsing and searching listings is free for renters and buyers. Property owners can also post listings for free.",
  },
  {
    question: "How do I contact a property owner about a listing?",
    answer:
      "Each listing has a contact option, including WhatsApp, so you can message the property owner directly to ask questions or arrange a viewing.",
  },
  {
    question: "How do I list my property on HomeLinker?",
    answer:
      "Create a HomeLinker account, then use the \"Post Property\" button to add your listing with photos, pricing, location and contact details.",
  },
  {
    question: "What does a \"Verified\" badge mean on a listing?",
    answer:
      "A Verified badge means the listing has passed HomeLinker's verification checks. Listings marked \"Pending Verification\" are still being reviewed.",
  },
  {
    question: "Which areas of South Africa does HomeLinker cover?",
    answer:
      "HomeLinker lists properties across South Africa, including Johannesburg, Pretoria, Cape Town, Durban, and their surrounding suburbs and townships.",
  },
  {
    question: "Can I search for both rentals and properties for sale?",
    answer:
      "Yes. HomeLinker lists both rental properties and properties for sale, searchable by city, suburb, property type and price.",
  },
  {
    question: "How do I report a suspicious or incorrect listing?",
    answer:
      "Every property page has a \"Report Listing\" button. Use it to flag a listing that looks incorrect, misleading or fraudulent so our team can review it.",
  },
];

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
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
          FAQ
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Frequently asked questions
        </h1>

        <p className="mt-6 leading-8 text-slate-600">
          Answers to common questions about using HomeLinker to find, rent,
          buy or list property in South Africa.
        </p>

        <div className="mt-10 space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-[#E8D8A5] p-6"
            >
              <h2 className="text-lg font-bold text-[#1B1B1B]">
                {faq.question}
              </h2>
              <p className="mt-2 leading-7 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/properties"
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-black transition hover:bg-[#A67C00]"
          >
            Browse properties
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-[#1B1B1B] px-6 py-3 font-bold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
          >
            Still have questions? Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}