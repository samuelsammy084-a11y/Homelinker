export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  content: {
    heading: string;
    body: string[];
  }[];
};

// Add new posts here. Each post automatically gets a page at
// /blog/[slug], shows up on /blog, and is included in the sitemap.
export const blogPosts: BlogPost[] = [
  {
    slug: "cheapest-suburbs-to-rent-in-johannesburg",
    title: "Cheapest Suburbs to Rent in Johannesburg (2026 Guide)",
    description:
      "A practical guide to finding more affordable places to rent in Johannesburg, including areas to consider and what to check before choosing a home.",
    publishedAt: "2026-08-25",
    readingTime: "6 min read",
    content: [
      {
        heading: "Why rent prices vary across Johannesburg",
        body: [
          "Johannesburg covers a very large area, and rental prices can differ significantly from one suburb to another. Location, property size, security, access to transport, nearby employment areas and the condition of the property can all influence the monthly rent.",
          "Instead of choosing an area based only on the advertised rental price, renters should also consider transport costs, electricity, water and the distance they will need to travel to work or school.",
        ],
      },
      {
        heading: "Areas budget-conscious renters can consider",
        body: [
          "Renters searching on a limited budget often broaden their search beyond premium areas such as Sandton and Rosebank. Parts of Roodepoort, Johannesburg CBD, Soweto and other areas across greater Johannesburg may provide options at different price points.",
          "Prices can vary even within the same suburb, so compare individual listings rather than assuming that every property in a particular area will be affordable.",
        ],
      },
      {
        heading: "Think about transport as well as rent",
        body: [
          "A cheaper property is not always cheaper overall. If you need several taxis, buses or a long daily drive to reach work, your transport costs can quickly reduce the amount you save on rent.",
          "Before choosing a property, calculate the approximate monthly cost of both accommodation and commuting. A slightly more expensive home closer to work may sometimes be the better financial choice.",
        ],
      },
      {
        heading: "What to check before signing a lease",
        body: [
          "Ask whether water, electricity, parking or other services are included in the advertised rent. You should also understand the deposit requirements and any additional monthly charges before agreeing to rent the property.",
          "Whenever possible, view the property before paying money. If you cannot visit immediately, request a live video walkthrough and verify who you are dealing with before sending a deposit.",
        ],
      },
      {
        heading: "Compare Johannesburg rentals",
        body: [
          "HomeLinker allows property seekers to browse rental listings by location, property type and price so they can compare available options before contacting an owner.",
        ],
      },
    ],
  },

  {
    slug: "how-to-avoid-rental-scams-south-africa",
    title: "How to Avoid Rental Scams in South Africa",
    description:
      "Practical tips for identifying suspicious rental listings and protecting yourself when searching for a room, flat or house in South Africa.",
    publishedAt: "2026-08-25",
    readingTime: "6 min read",
    content: [
      {
        heading: "Why renters need to be careful",
        body: [
          "Property searches increasingly happen online, which makes finding accommodation easier but also creates opportunities for fake listings. A scammer may copy photographs from a genuine advertisement, advertise a property they do not control and then request money from interested renters.",
          "Being cautious does not mean every affordable listing is suspicious. It means verifying important details before paying money or sharing sensitive personal information.",
        ],
      },
      {
        heading: "Warning signs to watch for",
        body: [
          "Be cautious when a property appears unusually cheap compared with similar homes nearby, particularly when the person advertising it is also creating pressure to pay immediately.",
          "Other warning signs can include refusing to arrange a viewing, making excuses about why the property cannot be seen, providing inconsistent information about the address or requesting payment before basic details have been verified.",
        ],
      },
      {
        heading: "View the property",
        body: [
          "Whenever possible, physically view a rental before making a financial commitment. Confirm that the address and property match the advertisement.",
          "If distance makes an immediate viewing impossible, ask for a live video walkthrough rather than relying only on photographs or prerecorded videos.",
        ],
      },
      {
        heading: "Verify who you are dealing with",
        body: [
          "Ask the landlord or agent for enough information to establish who they are and why they are authorised to rent the property. If an agent is involved, verify the agency independently instead of relying only on contact details supplied in a message.",
          "Do not allow urgency to prevent you from checking basic information. A legitimate property transaction should give you an opportunity to understand what you are paying for.",
        ],
      },
      {
        heading: "Keep records",
        body: [
          "Keep copies of important messages, agreements and proof of payments connected to the rental. Written records are useful if there is later a disagreement about what was promised or paid.",
        ],
      },
      {
        heading: "Report suspicious HomeLinker listings",
        body: [
          "If a HomeLinker listing appears fraudulent, misleading or suspicious, use the Report Listing feature on the property page. Reports help HomeLinker identify listings that may require review.",
        ],
      },
    ],
  },

  {
    slug: "room-flat-or-house-which-rental-is-right-for-you",
    title: "Room, Flat or House: Which Rental Is Right for You?",
    description:
      "Compare renting a room, flat or full house in South Africa based on budget, privacy, space and everyday living costs.",
    publishedAt: "2026-08-25",
    readingTime: "5 min read",
    content: [
      {
        heading: "Renting a room",
        body: [
          "A room in a shared property can be one of the more affordable ways to find accommodation. It can work well for students, young professionals, people moving to a new city or anyone trying to reduce monthly housing costs.",
          "The main compromise is privacy. Kitchens, bathrooms or living spaces may be shared, so it is important to understand the household rules before moving in.",
        ],
      },
      {
        heading: "Renting a flat or apartment",
        body: [
          "A flat or apartment usually gives you a self-contained living space while requiring less maintenance than many standalone houses.",
          "Apartments can suit individuals, couples and smaller families who want their own kitchen and bathroom without necessarily needing a large property.",
        ],
      },
      {
        heading: "Renting a house",
        body: [
          "A house generally provides more space and may include features such as a private yard, additional bedrooms or more parking.",
          "The additional space can also mean higher rent and potentially higher electricity, water or maintenance-related costs, depending on the rental agreement.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "Start with your realistic monthly housing budget and then decide which features are essential. Consider privacy, number of occupants, transport, parking, security and the amount of space you actually need.",
          "The best property is not necessarily the largest one. It is the option that fits both your lifestyle and your finances.",
        ],
      },
      {
        heading: "Compare different property types",
        body: [
          "HomeLinker lets property seekers browse different types of homes and compare available listings before contacting an owner.",
        ],
      },
    ],
  },

  {
    slug: "documents-needed-to-rent-property-south-africa",
    title: "Documents You May Need to Rent a Property in South Africa",
    description:
      "A practical guide to documents landlords or rental agents may request when you apply to rent a property in South Africa.",
    publishedAt: "2026-10-01",
    readingTime: "6 min read",
    content: [
      {
        heading: "Prepare before you start applying",
        body: [
          "Finding a property you like is only part of the rental process. A landlord or rental agent may ask for information to confirm your identity and assess whether you can reasonably afford the rent.",
          "Having commonly requested documents ready can make the application process easier, especially when several people are interested in the same property.",
        ],
      },
      {
        heading: "Proof of identity",
        body: [
          "You may be asked to provide acceptable proof of identity as part of a rental application. The exact documents requested can depend on the landlord, agent and applicant.",
          "Ask how your personal documents will be used and handled before sending sensitive information.",
        ],
      },
      {
        heading: "Proof of income",
        body: [
          "Landlords and agents commonly want evidence that an applicant has enough income to meet the monthly rental obligation. Depending on your circumstances, they may request payslips, bank statements or other supporting information.",
          "Self-employed applicants may be asked for different documentation because they do not necessarily receive traditional monthly payslips.",
        ],
      },
      {
        heading: "References and previous rental information",
        body: [
          "Some applications may ask for contact information for a previous landlord or other references. A good rental history can help demonstrate that you have previously managed rental obligations responsibly.",
          "First-time renters should not assume they cannot apply simply because they have no previous landlord. Ask the property owner or agent what alternatives they accept.",
        ],
      },
      {
        heading: "Read the application requirements carefully",
        body: [
          "There is no reason to send every personal document you own to every person advertising a property. Confirm what is actually required and who you are dealing with before sharing sensitive information.",
          "Be particularly careful when someone requests extensive personal information before you have been able to verify that the property and person advertising it are legitimate.",
        ],
      },
    ],
  },

  {
    slug: "rental-deposits-south-africa-guide",
    title: "Rental Deposits in South Africa: What Renters Should Know",
    description:
      "Understand the practical questions to ask about a rental deposit before moving into a property in South Africa.",
    publishedAt: "2026-10-02",
    readingTime: "6 min read",
    content: [
      {
        heading: "Understand the deposit before paying",
        body: [
          "A rental deposit can represent a significant amount of money, so you should understand exactly what you are being asked to pay before transferring funds.",
          "Ask for the deposit amount, the monthly rent, any once-off charges and any other costs to be clearly explained before you commit to the property.",
        ],
      },
      {
        heading: "Get important terms in writing",
        body: [
          "Your lease or other written rental documentation should clearly explain the important financial terms of the arrangement. Read the documents carefully and ask questions about anything you do not understand.",
          "Avoid relying entirely on verbal promises about when money will be returned or which costs you are responsible for.",
        ],
      },
      {
        heading: "Record the condition of the property",
        body: [
          "Before moving in, document the condition of the property carefully. Photographs or videos can provide a useful record of marks, damage or defects that were already present.",
          "Keep these records together with your lease, payment confirmations and important communication with the landlord or agent.",
        ],
      },
      {
        heading: "Keep proof of payment",
        body: [
          "When paying a deposit or rent, keep proof of the transaction. Make sure you understand who you are paying and what the payment is for.",
          "If the banking details suddenly change, verify the change through a trusted contact method before transferring money.",
        ],
      },
      {
        heading: "Ask what happens when you move out",
        body: [
          "Before signing, ask how the move-out process works, what inspections may take place and how any deductions would be communicated.",
          "Rental arrangements can differ, so the written agreement and applicable South African law should be considered when determining the parties' rights and obligations.",
        ],
      },
    ],
  },

  {
    slug: "how-to-find-affordable-rentals-johannesburg",
    title: "How to Find Affordable Rentals in Johannesburg",
    description:
      "A practical strategy for finding affordable rooms, flats and houses to rent in Johannesburg without looking only at the advertised monthly price.",
    publishedAt: "2026-10-03",
    readingTime: "7 min read",
    content: [
      {
        heading: "Set your total housing budget",
        body: [
          "Start by deciding how much you can realistically spend every month. Your budget should account for more than the advertised rent.",
          "Depending on the property, you may also need to budget for electricity, water, transport, internet, parking and other living expenses.",
        ],
      },
      {
        heading: "Search more than one suburb",
        body: [
          "Searching only one Johannesburg suburb can severely limit your options. Consider surrounding areas that still provide reasonable access to your workplace, school or regular transport.",
          "Compare the complete cost of living in each location rather than automatically choosing the property with the lowest rent.",
        ],
      },
      {
        heading: "Consider different property types",
        body: [
          "If a one-bedroom apartment is outside your budget, a room, bachelor unit or shared property may provide a more affordable alternative.",
          "Being flexible about property type can significantly increase the number of options available to you.",
        ],
      },
      {
        heading: "Calculate your commuting costs",
        body: [
          "Johannesburg is geographically large. Moving further from work may reduce your rent but increase your transport expenses and daily travel time.",
          "Estimate what you will spend travelling each month before deciding that a distant property is genuinely cheaper.",
        ],
      },
      {
        heading: "Move quickly, but verify first",
        body: [
          "Affordable properties can attract interest quickly. Have your application information prepared so you can respond promptly when you find a suitable property.",
          "Moving quickly should never mean skipping basic verification. View the property and confirm who you are dealing with before paying money.",
        ],
      },
      {
        heading: "Use filters to narrow your search",
        body: [
          "On HomeLinker, you can browse property listings and narrow your search based on location, property type and price to focus on homes that better match your budget.",
        ],
      },
    ],
  },

  {
    slug: "how-to-find-affordable-rentals-pretoria",
    title: "How to Find Affordable Rentals in Pretoria",
    description:
      "Tips for comparing rental options in Pretoria based on rent, transport, property type and total monthly living costs.",
    publishedAt: "2026-10-04",
    readingTime: "6 min read",
    content: [
      {
        heading: "Start with where you need to travel",
        body: [
          "Before searching for accommodation, identify the places you need to reach most often. This could include your workplace, university, school or major transport routes.",
          "A property that fits your budget but creates an expensive daily commute may not be the most affordable option overall.",
        ],
      },
      {
        heading: "Compare multiple areas",
        body: [
          "Pretoria includes many different residential areas with different property types and price ranges. Expanding your search can help you discover options that you may miss when looking at only one suburb.",
          "Compare actual listings and their features instead of assuming that every property within an area will fall into the same price range.",
        ],
      },
      {
        heading: "Rooms and shared properties",
        body: [
          "For people prioritising affordability, rooms and shared accommodation may cost less than renting an entire apartment or house.",
          "Before moving into shared accommodation, ask how utilities are divided, how many people share common facilities and whether there are household rules you need to follow.",
        ],
      },
      {
        heading: "Check additional monthly costs",
        body: [
          "Ask whether electricity and water are included, prepaid or billed separately. Also check costs such as parking, internet or other services that may apply.",
          "These expenses can change the true monthly cost of a property considerably.",
        ],
      },
      {
        heading: "Verify before paying",
        body: [
          "Arrange a viewing whenever possible and make sure the property matches the advertisement. Understand the payment requirements and rental terms before transferring a deposit.",
        ],
      },
    ],
  },

  {
    slug: "questions-to-ask-before-renting-property",
    title: "12 Questions to Ask Before Renting a Property",
    description:
      "Important questions to ask a landlord or rental agent before signing a lease or paying for a rental property.",
    publishedAt: "2026-10-05",
    readingTime: "7 min read",
    content: [
      {
        heading: "1. What is included in the rent?",
        body: [
          "Ask whether the advertised price includes water, electricity, internet, parking or any other services. Knowing this makes it easier to calculate the real monthly cost.",
        ],
      },
      {
        heading: "2. How does electricity work?",
        body: [
          "Find out whether the property uses prepaid electricity or another billing arrangement and how you will be responsible for payment.",
        ],
      },
      {
        heading: "3. How is water charged?",
        body: [
          "Water arrangements differ between properties. Ask whether it is included, separately billed or handled in another way.",
        ],
      },
      {
        heading: "4. What deposit and upfront payments are required?",
        body: [
          "Ask for a clear breakdown of everything you need to pay before moving in so there are no unexpected costs later.",
        ],
      },
      {
        heading: "5. How long is the lease?",
        body: [
          "Understand the length of the rental agreement and what the agreement says about renewal, notice and ending the lease.",
        ],
      },
      {
        heading: "6. When is rent due?",
        body: [
          "Confirm the monthly due date, accepted payment method and the correct payment details.",
        ],
      },
      {
        heading: "7. Is parking available?",
        body: [
          "If you own a vehicle, confirm whether parking is included, whether it is secure and whether there are additional charges.",
        ],
      },
      {
        heading: "8. Are pets allowed?",
        body: [
          "Never assume a property is pet-friendly. Ask about pets before signing if you already own one or plan to get one.",
        ],
      },
      {
        heading: "9. Who handles maintenance problems?",
        body: [
          "Ask who you should contact when something breaks and understand the process for reporting maintenance issues.",
        ],
      },
      {
        heading: "10. What security features are available?",
        body: [
          "Check locks, gates, access control, lighting and other security features that are important to you.",
        ],
      },
      {
        heading: "11. Can I inspect the property properly?",
        body: [
          "Take time to look at the property rather than making a decision based only on photographs. Check the condition of important areas and raise concerns before moving in.",
        ],
      },
      {
        heading: "12. Can I read the agreement before paying?",
        body: [
          "You should understand what you are agreeing to. Read important documents carefully and ask questions if any condition is unclear.",
        ],
      },
    ],
  },

  {
    slug: "how-to-list-property-for-rent-south-africa",
    title: "How to List a Property for Rent in South Africa",
    description:
      "A step-by-step guide for property owners creating an online rental listing, from photographs and pricing to descriptions and enquiries.",
    publishedAt: "2026-10-06",
    readingTime: "7 min read",
    content: [
      {
        heading: "Start with accurate property information",
        body: [
          "A useful rental listing gives potential tenants enough information to decide whether the property could suit them before making contact.",
          "Prepare details such as the property type, suburb, monthly rent, number of bedrooms and bathrooms, parking, availability and important features.",
        ],
      },
      {
        heading: "Take clear photographs",
        body: [
          "Photographs are one of the most important parts of an online property listing. Clean and organise the space before taking pictures and use natural light where possible.",
          "Show the main rooms and important features honestly. Avoid photographs that make it difficult to understand the actual condition or layout of the property.",
        ],
      },
      {
        heading: "Write a useful title",
        body: [
          "A title should quickly tell property seekers what is being offered. Include useful information such as the property type, number of bedrooms or location when appropriate.",
          "Avoid titles made entirely from promotional words such as 'AMAZING DEAL' because they provide little information to the person searching.",
        ],
      },
      {
        heading: "Write an honest description",
        body: [
          "Explain the property's most important features in plain language. Mention useful details such as parking, furnishing, access, nearby transport or pet rules where relevant.",
          "Accurate descriptions help reduce unsuitable enquiries and build trust with potential tenants.",
        ],
      },
      {
        heading: "Choose a realistic rental price",
        body: [
          "Compare similar properties in the surrounding area when deciding on an asking price. Property size, condition, location and included services can all affect what prospective tenants are willing to pay.",
        ],
      },
      {
        heading: "Respond to enquiries clearly",
        body: [
          "Be ready to answer questions about viewings, deposits, utilities, availability and the application process. Clear communication can make the process easier for both sides.",
        ],
      },
      {
        heading: "Create your listing on HomeLinker",
        body: [
          "HomeLinker allows property owners to create a listing with property details, photographs and contact information so interested property seekers can discover the property and make contact.",
        ],
      },
    ],
  },

  {
    slug: "renting-vs-buying-south-africa",
    title: "Renting vs Buying a Home in South Africa",
    description:
      "A practical comparison of renting and buying a home, including flexibility, upfront costs, long-term plans and financial responsibility.",
    publishedAt: "2026-10-07",
    readingTime: "7 min read",
    content: [
      {
        heading: "There is no single correct answer",
        body: [
          "Buying a home is often described as the automatic next step after renting, but the better choice depends on your finances, lifestyle and long-term plans.",
          "For some people, ownership can provide long-term stability. For others, renting provides flexibility that is more valuable at their current stage of life.",
        ],
      },
      {
        heading: "Why people choose to rent",
        body: [
          "Renting can make it easier to move when your job, family situation or preferred location changes. It can also avoid some of the responsibilities that come with owning a property.",
          "The amount needed upfront can also differ from the amount required when purchasing a property, although renters still need to plan for deposits and moving costs.",
        ],
      },
      {
        heading: "Why people choose to buy",
        body: [
          "Home ownership can provide greater control over the property and may suit people planning to remain in one place for a longer period.",
          "Buying also introduces additional financial responsibilities. The purchase price is not the only cost that prospective homeowners should consider.",
        ],
      },
      {
        heading: "Consider your financial stability",
        body: [
          "Before buying, think about whether your income is stable enough to support the long-term financial commitment and the other costs associated with owning a home.",
          "Before renting, consider whether the monthly rent and associated living costs comfortably fit within your budget.",
        ],
      },
      {
        heading: "Think about the next few years",
        body: [
          "If you expect to relocate for work or make major lifestyle changes, flexibility may be especially important. If you are financially prepared and want longer-term stability, ownership may become more attractive.",
          "The decision should be based on your individual circumstances rather than pressure to choose one option simply because other people are doing so.",
        ],
      },
    ],
  },

  {
    slug: "first-time-renter-checklist-south-africa",
    title: "First-Time Renter Checklist for South Africa",
    description:
      "A practical checklist for first-time renters covering budgeting, property searches, viewings, agreements, deposits and moving in.",
    publishedAt: "2026-10-08",
    readingTime: "8 min read",
    content: [
      {
        heading: "1. Work out your budget",
        body: [
          "Decide what you can afford before you start contacting landlords. Include rent, electricity, water, food, transport, internet and other regular expenses.",
          "Leaving some room in your budget for unexpected expenses is safer than choosing a property that uses nearly all of your available income.",
        ],
      },
      {
        heading: "2. Choose suitable locations",
        body: [
          "Think about work, school, transport, shops and the places you visit regularly. Location affects both convenience and monthly transport costs.",
        ],
      },
      {
        heading: "3. Compare multiple listings",
        body: [
          "Do not judge the market based on one advertisement. Compare several properties to understand what different budgets can provide in your preferred area.",
        ],
      },
      {
        heading: "4. Arrange a viewing",
        body: [
          "Seeing the property gives you an opportunity to check its condition, surroundings and whether the advertisement accurately represents it.",
        ],
      },
      {
        heading: "5. Ask about all costs",
        body: [
          "Confirm the deposit, rent and any other charges. Ask how electricity and water are handled and whether services such as parking are included.",
        ],
      },
      {
        heading: "6. Understand the agreement",
        body: [
          "Read the rental agreement carefully. Pay attention to the rental amount, payment dates, lease period, responsibilities and other important conditions.",
        ],
      },
      {
        heading: "7. Document the property's condition",
        body: [
          "Take clear photographs or videos when you move in and keep them safely. Recording existing defects can help establish the condition of the property at the beginning of your tenancy.",
        ],
      },
      {
        heading: "8. Keep important records",
        body: [
          "Keep your agreement, proof of payments and important communication organised so you can find them if questions arise later.",
        ],
      },
    ],
  },

  {
    slug: "how-much-rent-can-you-afford-south-africa",
    title: "How Much Rent Can You Afford in South Africa?",
    description:
      "Learn how to build a realistic rental budget using income, transport, utilities, food, debt and other monthly expenses.",
    publishedAt: "2026-10-09",
    readingTime: "7 min read",
    content: [
      {
        heading: "Start with your actual take-home income",
        body: [
          "A rental budget should be based on the money you actually have available rather than only your salary before deductions.",
          "If your income changes from month to month, use a cautious estimate rather than building your budget around your best month.",
        ],
      },
      {
        heading: "List your essential monthly expenses",
        body: [
          "Write down recurring expenses such as food, transport, debt repayments, insurance, mobile data, family responsibilities and other necessities.",
          "This gives you a clearer idea of how much remains for housing without making the rest of your budget impossible to manage.",
        ],
      },
      {
        heading: "Remember utilities",
        body: [
          "The advertised rent may not include electricity, water or internet. Ask how these services are charged before deciding whether a property fits your budget.",
        ],
      },
      {
        heading: "Transport can change the calculation",
        body: [
          "A cheaper home located far from work may require significantly more money for transport. Compare rent and commuting costs together.",
          "This is particularly important when comparing properties across a large metropolitan area.",
        ],
      },
      {
        heading: "Plan for upfront costs",
        body: [
          "Moving can require more than the first month's rent. Depending on the arrangement, you may need money for a deposit, transport, household essentials and other setup costs.",
        ],
      },
      {
        heading: "Leave yourself some breathing room",
        body: [
          "A budget that works only when absolutely nothing goes wrong can be difficult to sustain. Where possible, leave room for unexpected expenses and savings.",
          "There is no single rental percentage that works perfectly for every household. Your other financial responsibilities matter when deciding what is affordable for you.",
        ],
      },
    ],
  },

  {
    slug: "what-to-check-property-viewing-south-africa",
    title: "What to Check During a Property Viewing",
    description:
      "A room-by-room guide to inspecting a rental property before you decide to move in.",
    publishedAt: "2026-10-10",
    readingTime: "7 min read",
    content: [
      {
        heading: "Do not rush the viewing",
        body: [
          "A property can look attractive in photographs while hiding problems that become obvious when you visit. Give yourself enough time to inspect the home and ask questions.",
          "If possible, view the property in daylight so that you can see the rooms and exterior clearly.",
        ],
      },
      {
        heading: "Check doors and windows",
        body: [
          "Look at the condition of doors, windows and locks. Make sure you understand how access to the property works and identify any obvious damage.",
        ],
      },
      {
        heading: "Look for signs of water problems",
        body: [
          "Check ceilings, walls, cupboards and areas around plumbing for obvious signs of leaks, dampness or previous water damage.",
          "If you notice something concerning, ask about it before committing to the property.",
        ],
      },
      {
        heading: "Check the bathroom",
        body: [
          "Look at the general condition of the toilet, basin, shower or bath. Ask about any visible defects rather than assuming they will automatically be repaired later.",
        ],
      },
      {
        heading: "Inspect the kitchen",
        body: [
          "Check the available storage, work surfaces and the general condition of installed fixtures. If appliances form part of the rental, clarify which ones are included.",
        ],
      },
      {
        heading: "Understand electricity and water",
        body: [
          "Ask how electricity and water are supplied and charged. This can have a meaningful effect on your monthly living costs.",
        ],
      },
      {
        heading: "Look at the surroundings",
        body: [
          "The property itself is only part of the decision. Consider access to transport, shops, parking and other facilities that matter to your daily routine.",
        ],
      },
      {
        heading: "Record existing defects",
        body: [
          "If you decide to rent the property, make sure existing defects are properly documented. Keep photographs or videos showing the condition when you move in.",
        ],
      },
    ],
  },

  {
    slug: "how-to-prepare-property-for-new-tenant",
    title: "How to Prepare Your Property for a New Tenant",
    description:
      "A practical checklist for landlords preparing a rental property before a new tenant moves in.",
    publishedAt: "2026-10-11",
    readingTime: "6 min read",
    content: [
      {
        heading: "Start with a thorough inspection",
        body: [
          "Walk through the property before advertising it or handing it over to a new tenant. Look for obvious maintenance problems, damaged fixtures and areas that need attention.",
          "Addressing problems early can create a better experience for the incoming tenant and reduce avoidable disputes.",
        ],
      },
      {
        heading: "Clean the property",
        body: [
          "A clean property creates a stronger first impression during viewings and gives the incoming tenant a clear starting condition.",
          "Pay attention to kitchens, bathrooms, floors, cupboards, windows and other frequently used areas.",
        ],
      },
      {
        heading: "Check essential fixtures",
        body: [
          "Check the condition of locks, taps, toilets, lights and other important fixtures. If the property includes appliances or other equipment, make sure their condition is understood before handover.",
        ],
      },
      {
        heading: "Prepare useful information",
        body: [
          "Have important information ready for the tenant, including how utilities work, how maintenance issues should be reported and any property-specific access instructions.",
        ],
      },
      {
        heading: "Document the condition",
        body: [
          "Keep a clear record of the property's condition around the time the tenant moves in. Photographs, videos and written notes can help both parties understand the starting condition.",
        ],
      },
      {
        heading: "Communicate clearly",
        body: [
          "Make sure the tenant understands key arrangements such as rent payment, contact procedures and property rules. Clear expectations from the beginning can prevent unnecessary confusion later.",
        ],
      },
    ],
  },

  {
    slug: "moving-house-checklist-south-africa",
    title: "Moving House Checklist: What to Do Before Moving Day",
    description:
      "A practical moving checklist to help renters organise packing, utilities, documents and the first few days in a new home.",
    publishedAt: "2026-10-12",
    readingTime: "7 min read",
    content: [
      {
        heading: "Plan before moving day",
        body: [
          "Moving becomes much easier when important tasks are handled before the final day. Create a simple list of what needs to be packed, transported, cancelled, updated or purchased.",
          "If you are using a moving company or hiring transport, confirm the arrangements ahead of time rather than leaving them until the last minute.",
        ],
      },
      {
        heading: "Pack by category or room",
        body: [
          "Label boxes clearly so you know where they belong at the new property. Keep frequently needed items separate from things you may not unpack immediately.",
          "Important documents, medication, chargers, basic toiletries and a change of clothing should remain easy to access.",
        ],
      },
      {
        heading: "Prepare for electricity and water",
        body: [
          "Understand how utilities work at the new property before moving in. If electricity is prepaid, find out how the meter works and how to purchase electricity.",
          "Ask the landlord or agent any utility-related questions before moving day where possible.",
        ],
      },
      {
        heading: "Keep important documents together",
        body: [
          "Keep your rental agreement, proof of payments, contact details and other important documents somewhere secure and accessible.",
        ],
      },
      {
        heading: "Record the condition when you arrive",
        body: [
          "Take photographs or videos showing the condition of the property when you move in, particularly any existing defects or damage.",
          "Store the records safely along with your rental documentation.",
        ],
      },
      {
        heading: "Learn the area",
        body: [
          "Locate nearby shops, transport options and other services you are likely to use. Understanding your surroundings can make the first few days in a new home much easier.",
        ],
      },
    ],
  },
];