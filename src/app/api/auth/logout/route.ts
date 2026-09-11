import { NextResponse } from "next/server";
import { ACCESS_COOKIE, logoutUrl, REFRESH_COOKIE } from "@/lib/wix-auth";

export async function POST(request: Request) {
  const home = new URL("/", request.url).toString();

  let target = home;
  try {
    target = await logoutUrl(home);
  } catch {
    // Wix unreachable — still clear our cookies and send them home.
  }

  const response = NextResponse.redirect(target, 303);
  response.cookies.delete(ACCESS_COOKIE);
  response.cookies.delete(REFRESH_COOKIE);
  return response;
}
