export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date, e.g. "2026-08-25"
  readingTime: string; // e.g. "5 min read"
  content: {
    heading: string;
    body: string[]; // array of paragraphs
  }[];
};

// Add new posts here. Each post automatically gets a page at
// /blog/[slug], shows up on /blog, and is included in the sitemap.
export const blogPosts: BlogPost[] = [
  {
    slug: "cheapest-suburbs-to-rent-in-johannesburg",
    title: "Cheapest Suburbs to Rent in Johannesburg (2026 Guide)",
    description:
      "A practical guide to the most affordable Johannesburg suburbs for renters in 2026, covering typical rent, transport links, and what to expect in each area.",
    publishedAt: "2026-08-25",
    readingTime: "6 min read",
    content: [
      {
        heading: "Why rent prices vary so much across Johannesburg",
        body: [
          "Johannesburg is spread across dozens of suburbs and townships, and rent prices can differ significantly even between areas that are only a few kilometres apart. Distance from the CBD, access to public transport, security levels, and the age of the housing stock all play a role in what landlords charge.",
          "For renters working with a tight budget, understanding these differences can mean the gap between a room costing R2,500 a month and a similar space costing R6,000 or more.",
        ],
      },
      {
        heading: "Affordable areas worth considering",
        body: [
          "Areas such as Tembisa, Soweto, and parts of Roodepoort tend to offer some of the more affordable rental options in greater Johannesburg, with rooms and small apartments often available at lower monthly rates than the northern suburbs.",
          "Johannesburg CBD itself has also become more affordable in recent years as new residential conversions have added supply, though it's worth researching building security and management before committing.",
          "Randburg and parts of Florida offer a middle ground — generally more affordable than Sandton or Rosebank, while still being reasonably well connected by road and taxi routes.",
        ],
      },
      {
        heading: "What to check before signing a lease",
        body: [
          "Regardless of area, it's worth confirming a few things before renting: whether utilities (water, electricity) are included in the rent, whether the property has any security features like access control, and how far the property is from reliable public transport if you don't have a car.",
          "It's also worth asking to see the property in person, or requesting a video call walkthrough, before paying any deposit — this is one of the simplest ways to avoid rental scams.",
        ],
      },
      {
        heading: "Finding rooms and apartments in these areas",
        body: [
          "HomeLinker lists rental properties across Johannesburg by suburb, including Tembisa, Soweto, Randburg, Roodepoort and Johannesburg CBD, making it easier to compare prices and property types in one place before contacting an owner directly.",
        ],
      },
    ],
  },
];