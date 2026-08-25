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
  {
    slug: "how-to-avoid-rental-scams-south-africa",
    title: "How to Avoid Rental Scams in South Africa",
    description:
      "Practical, easy-to-follow tips for spotting and avoiding rental scams when searching for a room, flat or house in South Africa.",
    publishedAt: "2026-08-25",
    readingTime: "5 min read",
    content: [
      {
        heading: "Why rental scams are common",
        body: [
          "South Africa's high demand for affordable rental housing, combined with a large amount of property searching happening online, has made rental scams a persistent problem. Scammers typically post fake listings — often using real photos taken from other properties — at prices that seem unusually good, then ask for a deposit before the renter has seen the property in person.",
          "Understanding the common warning signs can help you avoid losing money to a scam, and still move quickly on legitimate listings.",
        ],
      },
      {
        heading: "Warning signs to watch for",
        body: [
          "A price significantly below similar properties in the same area is one of the most common red flags — scammers use low prices to attract as many interested renters as possible.",
          "Be cautious if the person listing the property is unavailable to show it in person or refuses a video call walkthrough, or if they pressure you to pay a deposit quickly because \"someone else is interested.\"",
          "Requests to pay via untraceable methods, or requests to pay before signing any lease agreement or meeting the landlord, are strong warning signs.",
        ],
      },
      {
        heading: "Steps to protect yourself",
        body: [
          "Always view the property in person, or request a live video call walkthrough if you can't visit before paying anything.",
          "Ask for the landlord or agent's ID and confirm they are the actual owner or an authorised agent for the property — you can ask to see a recent utility bill or title deed reference as further confirmation.",
          "Never send money via untraceable payment methods, and be wary of any landlord who refuses to provide a written lease agreement.",
          "If a listing's photos appear elsewhere online under a different address or price, treat that as a strong sign it may be fraudulent.",
        ],
      },
      {
        heading: "Reporting a suspicious listing",
        body: [
          "If you come across a listing on HomeLinker that looks suspicious, incorrect, or fraudulent, use the \"Report Listing\" button on the property page so our team can review it.",
        ],
      },
    ],
  },
  {
    slug: "room-flat-or-house-which-rental-is-right-for-you",
    title: "Room, Flat or House: Which Rental Is Right for You?",
    description:
      "A comparison of renting a room, a flat/apartment, or a full house in South Africa — covering cost, privacy, and what to expect from each option.",
    publishedAt: "2026-08-25",
    readingTime: "5 min read",
    content: [
      {
        heading: "Renting a room",
        body: [
          "Renting a room in a shared house or apartment is typically the most affordable option, particularly in cities like Johannesburg, Pretoria and Cape Town. It's a common choice for students, young professionals, or anyone looking to minimise monthly costs.",
          "The trade-off is shared common spaces — kitchen, bathroom and living areas are usually shared with other tenants, and privacy is more limited than renting your own unit.",
        ],
      },
      {
        heading: "Renting a flat or apartment",
        body: [
          "A flat or apartment offers a self-contained living space, usually with its own kitchen and bathroom, while still often being more affordable than a full house. Apartment complexes may also offer additional security, such as access control or on-site management.",
          "This option suits individuals, couples, or small families who want more privacy than a shared room but don't need the space of a full house.",
        ],
      },
      {
        heading: "Renting a house",
        body: [
          "A full house offers the most space and privacy, often including a garden or yard, and is generally the best option for families or those wanting more independence from neighbours.",
          "Houses typically come at a higher monthly rent than rooms or flats, and may also involve additional responsibilities, such as garden maintenance, depending on the lease agreement.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "Consider your budget first, since rooms are typically the most affordable and houses the least. Then weigh how much privacy and space you actually need against how much you're willing to spend.",
          "It's also worth thinking about location — a room or flat closer to work, transport links or amenities may work out better overall than a larger house further away, once you factor in commuting time and cost.",
        ],
      },
      {
        heading: "Browse all three on HomeLinker",
        body: [
          "HomeLinker lists rooms, flats and houses to rent across South Africa, so you can compare all three options side by side by city, suburb and price before contacting an owner directly.",
        ],
      },
    ],
  },
];