import { NextResponse } from "next/server";
import { getMember } from "@/lib/member";
import { ACCESS_COOKIE } from "@/lib/wix-auth";

const BACK = "/profile/settings/about";

export async function POST(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${ACCESS_COOKIE}=`))
    ?.slice(ACCESS_COOKIE.length + 1);

  const fail = (message: string) => {
    const url = new URL(BACK, request.url);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url, 303);
  };

  if (!token) return fail("Your session expired. Please sign in again.");

  const result = await getMember();
  if (result.status !== "ok") {
    return fail("We could not confirm your account.");
  }

  const form = await request.formData();
  const profile = {
    nickname: String(form.get("nickname") ?? "").trim(),
    firstName: String(form.get("firstName") ?? "").trim(),
    lastName: String(form.get("lastName") ?? "").trim(),
  };

  try {
    const response = await fetch(
      `https://www.wixapis.com/members/v1/members/${result.member.id}`,
      {
        method: "PATCH",
        headers: {
          authorization: decodeURIComponent(token),
          "content-type": "application/json",
        },
        body: JSON.stringify({ member: { profile } }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return fail(`Wix would not save the changes (${response.status}).`);
    }
  } catch {
    return fail("We could not reach Wix. Please try again.");
  }

  const url = new URL(BACK, request.url);
  url.searchParams.set("saved", "1");
  return NextResponse.redirect(url, 303);
}
