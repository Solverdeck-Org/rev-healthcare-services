/**
 * Adds the fields required by the section types introduced after the initial
 * seed (splitImageText, stats, team, featureList, jobList). Run once:
 *
 *   bun scripts/add-fields.ts
 *
 * Safe to re-run: fields that already exist are skipped.
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

const NEW_FIELDS: [collection: string, key: string, type: string][] = [
  // Which side the image sits on in a splitImageText section ("left" | "right").
  ["Sections", "imagePosition", "TEXT"],
  // Team role, job location — the secondary line under an item's title.
  ["SectionItems", "subtitle", "TEXT"],
  // Job type (Full-time, Contract) — the third line on a jobList row.
  ["SectionItems", "meta", "TEXT"],
  // Heading above the second column of a featurePanel section.
  ["Sections", "secondaryHeading", "TEXT"],
  // Lead-capture form in the third column of a featurePanel section.
  ["Sections", "formHeading", "TEXT"],
  ["Sections", "formQuestion", "TEXT"],
  ["Sections", "formSubmitLabel", "TEXT"],
  ["Sections", "formDisclaimer", "TEXT"],
  // articleGrid: which card an item belongs to, plus each card's footer link.
  ["SectionItems", "group", "TEXT"],
  ["SectionItems", "ctaLabel", "TEXT"],
  ["SectionItems", "ctaHref", "TEXT"],
];

for (const [dataCollectionId, key, type] of NEW_FIELDS) {
  const response = await fetch(
    "https://www.wixapis.com/wix-data/v2/collections/create-field",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        dataCollectionId,
        field: { key, displayName: key, type },
      }),
    },
  );

  if (response.ok) {
    console.log(`  + ${dataCollectionId}.${key}`);
    continue;
  }

  const body = await response.text();
  if (response.status === 409 || /already exists/i.test(body)) {
    console.log(`  = ${dataCollectionId}.${key} exists, skipping`);
    continue;
  }
  throw new Error(
    `Failed to add ${dataCollectionId}.${key} (${response.status}): ${body}`,
  );
}

console.log("\nDone.");

export {};
