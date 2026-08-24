import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";

const SITE_URL = "https://www.homelinker.co.za";

export const metadata: Metadata = {
  title: "Property Guides & Tips | HomeLinker Blog",
  description:
    "Guides and tips on renting, buying and finding property in South Africa — suburb breakdowns, budgeting advice, and how to avoid rental scams.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: "Property Guides & Tips | HomeLinker Blog",
    description:
      "Guides and tips on renting, buying and finding property in South Africa.",
    url: `${SITE_URL}/blog`,
    siteName: "HomeLinker",
    locale: "en_ZA",
    type: "website",
  },
};

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
          HomeLinker Blog
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Property guides &amp; tips
        </h1>

        <p className="mt-4 max-w-2xl leading-8 text-slate-600">
          Practical guides on renting, buying and finding property in South
          Africa — suburb breakdowns, budgeting advice, and tips to help you
          search with confidence.
        </p>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="flex flex-col rounded-2xl border border-[#E8D8A5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {formatDate(post.publishedAt)} · {post.readingTime}
                </p>

                <h2 className="mt-3 text-xl font-bold text-[#1B1B1B]">
                  {post.title}
                </h2>

                <p className="mt-3 flex-1 leading-7 text-slate-600">
                  {post.description}
                </p>

                <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#C9A227]">
                  Read guide →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-slate-600">
            No guides published yet — check back soon.
          </p>
        )}
      </div>
    </main>
  );
}