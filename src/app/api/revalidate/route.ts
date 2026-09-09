import { revalidateTag } from "next/cache";

/**
 * Point a Wix automation / webhook at POST /api/revalidate so content edits
 * show up without a redeploy.
 *
 *   POST /api/revalidate?secret=...        -> refreshes everything
 *   POST /api/revalidate?secret=...&slug=x -> refreshes one page
 */
async function revalidate(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  const url = new URL(request.url);

  if (!secret || url.searchParams.get("secret") !== secret) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  const slug = url.searchParams.get("slug");
  const tag = slug ? `page:${slug}` : "site";
  revalidateTag(tag, "max");

  return Response.json({ revalidated: true, tag });
}

/** For webhooks (Wix automations, scripts). */
export async function POST(request: Request) {
  return revalidate(request);
}

/**
 * For humans: bookmark
 *   https://<site>/api/revalidate?secret=...
 * and open it after editing in Wix to publish the change immediately.
 */
export async function GET(request: Request) {
  return revalidate(request);
}
