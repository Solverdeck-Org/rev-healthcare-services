import { revalidateTag } from "next/cache";

/**
 * Point a Wix automation / webhook at POST /api/revalidate so content edits
 * show up without a redeploy.
 *
 *   POST /api/revalidate?secret=...        -> refreshes everything
 *   POST /api/revalidate?secret=...&slug=x -> refreshes one page
 */
export async function POST(request: Request) {
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
