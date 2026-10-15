import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.homelinker.co.za";
const CONTACT_EMAIL = "noreplyhomelinker@gmail.com";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | HomeLinker",
  description:
    "Answers to common questions about finding, renting, buying and listing property on HomeLinker, South Africa's property marketplace.",
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    title: "Frequently Asked Questions | HomeLinker",
    description:
      "Find answers about property listings, accounts, payments, verification, safety and using HomeLinker in South Africa.",
    url: `${SITE_URL}/faq`,
    siteName: "HomeLinker",
    locale: "en_ZA",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const faqs = [
  {
    question: "What is HomeLinker?",
    answer:
      "HomeLinker is a South African property marketplace where people can search for rooms, flats, apartments and houses to rent or buy, while property owners and authorised advertisers can publish property listings and connect with people searching for a home.",
  },
  {
    question: "Is it free to use HomeLinker?",
    answer:
      "Browsing and searching property listings on HomeLinker is free. HomeLinker also offers a free property listing option for advertisers, together with optional paid features that may provide additional visibility or promotion.",
  },
  {
    question: "Do I need an account to browse properties?",
    answer:
      "You can browse available property listings without needing to create an account. Certain features, such as publishing or managing your own property listings, may require a HomeLinker account.",
  },
  {
    question: "How do I contact someone about a property?",
    answer:
      "Property listings may include contact options that allow interested users to communicate with the advertiser. Depending on the listing, this may include a WhatsApp or other supported contact option.",
  },
  {
    question: "Is HomeLinker the landlord or estate agent?",
    answer:
      "Generally, no. HomeLinker is a property marketplace that helps people discover property listings and connect with advertisers. Unless specifically stated otherwise, HomeLinker is not the owner, landlord, estate agent, property practitioner, buyer, tenant or seller of properties advertised by users.",
  },
  {
    question: "How do I list my property on HomeLinker?",
    answer:
      "Create a HomeLinker account and use the property listing feature to provide information such as the property type, location, price, photographs, features and contact information. You should only advertise a property if you own it or are authorised to advertise it.",
  },
  {
    question: "Can I list a property for free?",
    answer:
      "HomeLinker offers a free listing option. Optional paid listing or promotion features may also be available for advertisers who want additional visibility. Available plans, pricing and benefits are shown during the listing or purchase process.",
  },
  {
    question: "What are featured or promoted listings?",
    answer:
      "Featured or promoted listings are optional visibility features that may give a property additional exposure on HomeLinker. Paying for promotion does not guarantee a specific number of views, enquiries, tenants, buyers, sales or rental agreements.",
  },
  {
    question: "What does a Verified badge mean?",
    answer:
      "Where HomeLinker displays a verification indicator, it means that certain information or checks associated with the listing or advertiser have been reviewed according to the verification process available at that time. Verification is not a guarantee that a property, person or transaction is risk-free, and users should still perform their own checks.",
  },
  {
    question: "What does Pending Verification mean?",
    answer:
      "Pending Verification means that a listing or relevant information has not yet completed the applicable HomeLinker verification process. Users should not treat a pending listing as verified.",
  },
  {
    question: "Does HomeLinker guarantee that listings are genuine?",
    answer:
      "No property marketplace can remove every risk. HomeLinker may provide moderation, reporting and verification features, but the appearance of a listing on HomeLinker does not by itself guarantee the property, advertiser or transaction. Users should perform appropriate checks before paying money or signing an agreement.",
  },
  {
    question: "How can I avoid property and rental scams?",
    answer:
      "Be cautious when an advertiser pressures you to send money quickly, refuses reasonable property checks, provides inconsistent information or asks for payment before you are comfortable that the property and advertiser are legitimate. Never rely only on a listing or verification indicator when making a financial decision.",
  },
  {
    question: "Should I pay a deposit before viewing a property?",
    answer:
      "Users should be cautious about transferring money before performing appropriate checks on the property, advertiser and transaction. Before paying a deposit, make sure you understand who you are paying, why the payment is required and the terms that apply.",
  },
  {
    question: "Which areas of South Africa does HomeLinker cover?",
    answer:
      "HomeLinker is designed for property listings across South Africa, including major cities, suburbs, townships and other communities. The number of available listings in a particular area depends on properties currently advertised on the platform.",
  },
  {
    question: "Can I search for both rentals and properties for sale?",
    answer:
      "Yes. HomeLinker can display both rental and sale listings. Available search and filtering options may include location, property type, price and other property information.",
  },
  {
    question: "What should I do if a property is no longer available?",
    answer:
      "Property advertisers should update or deactivate listings when a property is no longer available. If you find an outdated or inaccurate listing, you can use the available reporting feature or contact HomeLinker.",
  },
  {
    question: "How do I report a suspicious or incorrect listing?",
    answer:
      "Where a Report Listing option is available on the property page, you can use it to report information that appears suspicious, fraudulent, misleading, inaccurate or inappropriate. HomeLinker may review the report and take action where appropriate.",
  },
  {
    question: "Will reporting a listing automatically remove it?",
    answer:
      "No. A report may be reviewed before action is taken. HomeLinker may consider the information available and may restrict, hide, remove or leave the listing available depending on the circumstances.",
  },
  {
    question: "How are payments for HomeLinker services processed?",
    answer:
      "Payments for certain paid HomeLinker services may be processed through third-party payment providers such as Stripe. The price and relevant benefits of a paid service are presented during the purchase process.",
  },
  {
    question: "Can I get a refund for a paid HomeLinker service?",
    answer:
      "Refund eligibility depends on the circumstances, the service purchased, whether it has already been activated and applicable South African consumer protection laws. Payment or refund enquiries can be sent to HomeLinker for review.",
  },
  {
    question: "Does HomeLinker handle rental deposits between users?",
    answer:
      "Unless HomeLinker expressly introduces and identifies such a service, rental deposits, rent payments and property transaction payments between users are not handled by HomeLinker. Users should carefully verify payment instructions before transferring money to another person.",
  },
  {
    question: "How does HomeLinker use my personal information?",
    answer:
      "HomeLinker handles personal information according to its Privacy Policy. Information may be used for purposes such as providing accounts, operating property listings, communicating with users, maintaining security, processing applicable services and complying with legal obligations.",
  },
  {
    question: "Does HomeLinker use cookies?",
    answer:
      "HomeLinker may use cookies, browser storage and similar technologies for functions such as authentication, security, preferences, analytics and advertising. More information is available in the HomeLinker Cookie Policy.",
  },
  {
    question: "How can I contact HomeLinker?",
    answer:
      `You can contact HomeLinker through the Contact page or by email at ${CONTACT_EMAIL}.`,
  },
];

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faqpage`,
    url: `${SITE_URL}/faq`,
    name: "HomeLinker Frequently Asked Questions",
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
          HomeLinker Help
        </p>

        <h1 className="mt-3 text-4xl font-black leading-tight text-black sm:text-5xl">
          Frequently Asked Questions
        </h1>

        <p className="mt-6 text-lg leading-8 text-slate-600">
          Find answers to common questions about searching for property,
          publishing listings, payments, verification, safety and using
          HomeLinker in South Africa.
        </p>

        {/* QUICK LINKS */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/properties"
            className="rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#A67C00]"
          >
            Browse Properties
          </Link>

          <Link
            href="/post-listing"
            className="rounded-xl border border-[#C9A227] px-5 py-3 text-sm font-bold text-[#8A6800] transition hover:bg-[#FFF9E8]"
          >
            List a Property
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Contact HomeLinker
          </Link>
        </div>

        {/* FAQS */}
        <div className="mt-10 space-y-5">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-2xl border border-[#E8D8A5] bg-white p-6 transition hover:border-[#C9A227]"
            >
              <h2 className="text-lg font-black text-[#1B1B1B]">
                {faq.question}
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>

        {/* SAFETY */}
        <section className="mt-10 rounded-2xl border border-[#C9A227]/30 bg-[#FFF9E8] p-6 sm:p-8">
          <h2 className="text-2xl font-black text-black">
            Stay careful when searching for property
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Property transactions can involve significant amounts of money.
            Before paying a deposit or entering into an agreement, perform
            appropriate checks on the property, advertiser and payment
            instructions.
          </p>

          <Link
            href="/blog/how-to-avoid-rental-scams-south-africa"
            className="mt-5 inline-flex font-bold text-[#8A6800] hover:text-[#C9A227]"
          >
            Read our rental scam safety guide →
          </Link>
        </section>

        {/* MORE HELP */}
        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-black text-black">
            Still need help?
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            If your question is not answered here, contact HomeLinker at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            or send us a message through the Contact page.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-[#1B1B1B] px-6 py-3 font-bold text-white transition hover:bg-black"
            >
              Contact HomeLinker
            </Link>

            <Link
              href="/blog"
              className="rounded-xl border border-[#1B1B1B] px-6 py-3 font-bold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
            >
              Read Property Guides
            </Link>
          </div>
        </section>

        {/* POLICIES */}
        <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm font-semibold">
          <Link
            href="/about"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            About HomeLinker
          </Link>

          <Link
            href="/privacy"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/cookie-policy"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </main>
  );
}