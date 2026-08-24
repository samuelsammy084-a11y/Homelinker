import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-posts";

const SITE_URL = "https://www.homelinker.co.za";

type Props = {
  params: Promise<{ slug: string }>;
};

function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {
      title: "Guide Not Found | HomeLinker Blog",
    };
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | HomeLinker Blog`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: "HomeLinker",
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: canonicalUrl,
          },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        url: canonicalUrl,
        author: {
          "@type": "Organization",
          name: "HomeLinker",
          url: SITE_URL,
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-[#C9A227]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-[#C9A227]">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-slate-700" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>

        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {formatDate(post.publishedAt)} · {post.readingTime}
        </p>

        <h1 className="mt-3 text-3xl font-black leading-tight text-black sm:text-4xl">
          {post.title}
        </h1>

        <p className="mt-4 text-lg leading-8 text-slate-600">
          {post.description}
        </p>

        <div className="mt-10 space-y-8 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          {post.content.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-[#1B1B1B] sm:text-2xl">
                {section.heading}
              </h2>

              <div className="mt-3 space-y-4">
                {section.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className="leading-8 text-slate-700 sm:text-[17px]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
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
            href="/blog"
            className="rounded-xl border border-[#1B1B1B] px-6 py-3 font-bold text-[#1B1B1B] transition hover:bg-[#1B1B1B] hover:text-white"
          >
            More guides
          </Link>
        </div>
      </article>
    </main>
  );
}