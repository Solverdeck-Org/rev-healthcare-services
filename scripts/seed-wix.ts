/**
 * Creates the five CMS collections this site reads from, and fills them with
 * the starting content. Run once:
 *
 *   bun scripts/seed-wix.ts
 *
 * Safe to re-run: existing collections and items are skipped, not overwritten.
 * After seeding, all editing happens in the Wix CMS — not in this file.
 */

const API_KEY = process.env.WIX_API_KEY;
const SITE_ID = process.env.WIX_SITE_ID;

if (!API_KEY || !SITE_ID) {
  console.error("Set WIX_API_KEY and WIX_SITE_ID in .env.local first.");
  process.exit(1);
}

const headers = {
  Authorization: API_KEY,
  "wix-site-id": SITE_ID,
  "Content-Type": "application/json",
};

type FieldType = "TEXT" | "NUMBER" | "IMAGE";

async function createCollection(
  id: string,
  displayName: string,
  fields: [key: string, type: FieldType][],
) {
  const response = await fetch(
    "https://www.wixapis.com/wix-data/v2/collections",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        collection: {
          id,
          displayName,
          fields: fields.map(([key, type]) => ({
            key,
            displayName: key,
            type,
          })),
          permissions: {
            insert: "ADMIN",
            update: "ADMIN",
            remove: "ADMIN",
            read: "ANYONE",
          },
        },
      }),
    },
  );

  if (response.ok) {
    console.log(`  created collection ${id}`);
    return;
  }

  const body = await response.text();
  if (response.status === 409 || body.includes("ALREADY_EXISTS")) {
    console.log(`  collection ${id} already exists, skipping`);
    return;
  }
  throw new Error(`Failed to create ${id} (${response.status}): ${body}`);
}

async function insertItem(
  dataCollectionId: string,
  id: string,
  data: Record<string, unknown>,
) {
  const response = await fetch("https://www.wixapis.com/wix-data/v2/items", {
    method: "POST",
    headers,
    body: JSON.stringify({ dataCollectionId, dataItem: { id, data } }),
  });

  if (response.ok) {
    console.log(`  + ${dataCollectionId}/${id}`);
    return;
  }

  const body = await response.text();
  if (response.status === 409 || body.includes("ALREADY_EXISTS")) {
    console.log(`  = ${dataCollectionId}/${id} exists, skipping`);
    return;
  }
  throw new Error(
    `Failed to insert ${dataCollectionId}/${id} (${response.status}): ${body}`,
  );
}

// --- Schema ---------------------------------------------------------------

const SCHEMA: [string, string, [string, FieldType][]][] = [
  [
    "SiteSettings",
    "Site Settings",
    [
      ["siteName", "TEXT"],
      ["logo", "IMAGE"],
      ["logoAlt", "TEXT"],
      ["phone", "TEXT"],
      ["phoneHref", "TEXT"],
      ["ctaLabel", "TEXT"],
      ["ctaHref", "TEXT"],
      ["footerText", "TEXT"],
      ["footerNote", "TEXT"],
    ],
  ],
  [
    "NavLinks",
    "Navigation Links",
    [
      ["label", "TEXT"],
      ["href", "TEXT"],
      ["location", "TEXT"],
      ["group", "TEXT"],
      ["order", "NUMBER"],
    ],
  ],
  [
    "Pages",
    "Pages",
    [
      ["slug", "TEXT"],
      ["title", "TEXT"],
      ["seoDescription", "TEXT"],
    ],
  ],
  [
    "Sections",
    "Page Sections",
    [
      ["pageSlug", "TEXT"],
      ["sectionKey", "TEXT"],
      ["order", "NUMBER"],
      ["type", "TEXT"],
      ["eyebrow", "TEXT"],
      ["heading", "TEXT"],
      ["subheading", "TEXT"],
      ["body", "TEXT"],
      ["image", "IMAGE"],
      ["imageAlt", "TEXT"],
      ["ctaLabel", "TEXT"],
      ["ctaHref", "TEXT"],
      ["inputLabel", "TEXT"],
      ["inputPlaceholder", "TEXT"],
    ],
  ],
  [
    "SectionItems",
    "Section Items",
    [
      ["sectionKey", "TEXT"],
      ["order", "NUMBER"],
      ["title", "TEXT"],
      ["description", "TEXT"],
      ["href", "TEXT"],
      ["image", "IMAGE"],
      ["imageAlt", "TEXT"],
    ],
  ],
];

// --- Starting content -----------------------------------------------------

const SETTINGS = {
  siteName: "Rev Healthcare Services",
  logoAlt: "Rev Healthcare Services",
  phone: "(800) 555-0142",
  phoneHref: "tel:+18005550142",
  ctaLabel: "Login",
  ctaHref: "/login",
  footerText:
    "Connecting families with trusted in-home care and senior housing.",
  footerNote: "© Rev Healthcare Services. All rights reserved.",
};

const NAV: [string, Record<string, unknown>][] = [
  [
    "nav-find-care",
    { label: "Find Care", href: "/find-care", location: "header", order: 1 },
  ],
  [
    "nav-resources",
    { label: "Resources", href: "/resources", location: "header", order: 2 },
  ],
  [
    "nav-forum",
    { label: "Forum", href: "/forum", location: "header", order: 3 },
  ],
  [
    "foot-in-home",
    {
      label: "In-Home Care",
      href: "/find-care",
      location: "footer",
      group: "Services",
      order: 1,
    },
  ],
  [
    "foot-housing",
    {
      label: "Senior Housing",
      href: "/find-care",
      location: "footer",
      group: "Services",
      order: 2,
    },
  ],
  [
    "foot-guides",
    {
      label: "Care Guides",
      href: "/resources",
      location: "footer",
      group: "Resources",
      order: 3,
    },
  ],
  [
    "foot-cost",
    {
      label: "Cost of Care",
      href: "/resources",
      location: "footer",
      group: "Resources",
      order: 4,
    },
  ],
  [
    "foot-about",
    {
      label: "About Us",
      href: "/about",
      location: "footer",
      group: "Company",
      order: 5,
    },
  ],
  [
    "foot-contact",
    {
      label: "Contact",
      href: "/contact",
      location: "footer",
      group: "Company",
      order: 6,
    },
  ],
];

const PAGES: [string, Record<string, unknown>][] = [
  [
    "page-home",
    {
      slug: "home",
      title: "Find trusted home care in your area",
      seoDescription: "Get connected to quality care near you.",
    },
  ],
];

const SECTIONS: [string, Record<string, unknown>][] = [
  [
    "home-hero",
    {
      pageSlug: "home",
      sectionKey: "home-hero",
      order: 1,
      type: "hero",
      heading: "Find trusted home care in your area",
      subheading: "Get connected to quality care near you.",
      inputLabel: "ZIP code where care is needed:",
      inputPlaceholder: "Enter ZIP code",
      ctaLabel: "Find Care",
      ctaHref: "/find-care",
    },
  ],
  [
    "home-featured",
    {
      pageSlug: "home",
      sectionKey: "home-featured",
      order: 2,
      type: "richText",
      eyebrow: "Featured Article",
      heading: "Signs a Senior Needs Help at Home",
      body: "Your aging parents think they can still take care of themselves, but if you're noticing these red flags, it is time to consider in-home care.",
    },
  ],
  [
    "home-cities",
    {
      pageSlug: "home",
      sectionKey: "home-cities",
      order: 3,
      type: "links",
      heading: "Popular Cities for In-Home Care",
    },
  ],
  [
    "home-services",
    {
      pageSlug: "home",
      sectionKey: "home-services",
      order: 4,
      type: "cards",
      heading: "How we help",
      subheading: "Care options tailored to what your family needs today.",
    },
  ],
  [
    "home-cta",
    {
      pageSlug: "home",
      sectionKey: "home-cta",
      order: 5,
      type: "cta",
      heading: "Free, no-obligation care finder",
      body: "Tell us what you need and an advisor will follow up with local options.",
      ctaLabel: "Get started",
      ctaHref: "/find-care",
    },
  ],
];

const CITIES = [
  "Atlanta, GA",
  "Houston, TX",
  "Miami, FL",
  "New York, NY",
  "Phoenix, AZ",
  "Chicago, IL",
  "Orlando, FL",
  "San Diego, CA",
];

const SECTION_ITEMS: [string, Record<string, unknown>][] = [
  ...CITIES.map((city, index): [string, Record<string, unknown>] => [
    `city-${index + 1}`,
    {
      sectionKey: "home-cities",
      order: index + 1,
      title: city,
      href: `/find-care/${city
        .toLowerCase()
        .replace(/[^a-z]+/g, "-")
        .replace(/-$/, "")}`,
    },
  ]),
  [
    "service-in-home",
    {
      sectionKey: "home-services",
      order: 1,
      title: "In-Home Care",
      description:
        "Caregivers who help with daily activities so loved ones can stay at home.",
      href: "/find-care",
    },
  ],
  [
    "service-housing",
    {
      sectionKey: "home-services",
      order: 2,
      title: "Senior Housing",
      description:
        "Assisted living and memory care communities matched to your budget.",
      href: "/find-care",
    },
  ],
  [
    "service-guidance",
    {
      sectionKey: "home-services",
      order: 3,
      title: "Care Guidance",
      description: "Free, no-obligation help from advisors who know your area.",
      href: "/resources",
    },
  ],
];

// --- Run ------------------------------------------------------------------

console.log("Creating collections...");
for (const [id, displayName, fields] of SCHEMA) {
  await createCollection(id, displayName, fields);
}

console.log("\nInserting content...");
await insertItem("SiteSettings", "site-settings", SETTINGS);
for (const [id, data] of NAV) await insertItem("NavLinks", id, data);
for (const [id, data] of PAGES) await insertItem("Pages", id, data);
for (const [id, data] of SECTIONS) await insertItem("Sections", id, data);
for (const [id, data] of SECTION_ITEMS) {
  await insertItem("SectionItems", id, data);
}

console.log("\nDone. Edit everything from here on in the Wix CMS.");

export {};
