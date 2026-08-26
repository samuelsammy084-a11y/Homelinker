import type { Metadata } from "next";
import Link from "next/link";
import AIAssistant from "@/app/components/AIAssistant";

export const metadata: Metadata = {
  title: "HomeLinker AI | Find Your Home",
  description:
    "Use HomeLinker AI to find rooms, apartments, houses and properties to rent or buy across South Africa.",
  alternates: {
    canonical: "https://homelinker.co.za/ai",
  },
};

export default function AIPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      {/* HERO */}
      <section className="border-b border-[#E8DDBE] bg-[#111111] px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-2 text-sm font-bold text-[#E5C65B]">
            <span>✨</span>
            Powered by AI
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
            Find your next home
            <span className="block text-[#C9A227]">
              with AI.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Tell HomeLinker AI what you're looking for in your own words.
            We'll help you narrow down the perfect property.
          </p>
        </div>
      </section>

      {/* AI */}
      <section className="px-4 py-10 sm:px-6 sm:py-16">
        <AIAssistant />
      </section>

      {/* BACK TO PROPERTIES */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm text-gray-500">
            Want to browse properties yourself?
          </p>

          <Link
            href="/properties"
            className="mt-3 inline-flex items-center rounded-xl bg-[#111111] px-6 py-3 font-bold text-white transition hover:bg-[#C9A227]"
          >
            Browse Properties
          </Link>
        </div>
      </section>
    </main>
  );
}