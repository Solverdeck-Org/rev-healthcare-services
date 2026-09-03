/**
 * Minimal Wix Headless (Wix Data v2) REST client.
 *
 * Auth uses a Wix API key + site id, which is the server-to-server flow:
 *   WIX_API_KEY   - API key from Wix account settings (never exposed to the client)
 *   WIX_SITE_ID   - the site the collections live in
 *
 * See README.md for the collection shapes this template expects.
 */

const WIX_DATA_QUERY_URL = "https://www.wixapis.com/wix-data/v2/items/query";

export type WixItem = Record<string, unknown>;

type QueryOptions = {
  filter?: Record<string, unknown>;
  sort?: { fieldName: string; order: "ASC" | "DESC" }[];
  limit?: number;
};

export async function queryCollection(
  dataCollectionId: string,
  { filter, sort, limit = 100 }: QueryOptions = {},
): Promise<WixItem[]> {
  const apiKey = process.env.WIX_API_KEY;
  const siteId = process.env.WIX_SITE_ID;

  if (!apiKey || !siteId) {
    throw new Error(
      "Wix is not configured: set WIX_API_KEY and WIX_SITE_ID (see .env.example).",
    );
  }

  const response = await fetch(WIX_DATA_QUERY_URL, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "wix-site-id": siteId,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataCollectionId,
      query: {
        ...(filter ? { filter } : {}),
        ...(sort ? { sort } : {}),
        paging: { limit },
      },
      returnTotalCount: false,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Wix Data query failed for "${dataCollectionId}" (${response.status}): ${body}`,
    );
  }

  const data = (await response.json()) as { dataItems?: { data?: WixItem }[] };
  return (data.dataItems ?? []).map((item) => item.data ?? {});
}

/** Read a string field, tolerating Wix's null-vs-missing inconsistency. */
export function str(item: WixItem, field: string): string | undefined {
  const value = item[field];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function num(item: WixItem, field: string): number | undefined {
  const value = item[field];
  return typeof value === "number" ? value : undefined;
}

/**
 * Wix stores media as `wix:image://v1/<fileId>/<name>#originWidth=...`.
 * Turn that into a URL <Image> can load; pass plain URLs through untouched.
 */
export function mediaUrl(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (raw.startsWith("http")) return raw;
  const match = raw.match(/^wix:image:\/\/v1\/([^/]+)/);
  if (!match) return undefined;
  return `https://static.wixstatic.com/media/${match[1]}`;
}
