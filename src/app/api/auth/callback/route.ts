import { NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  memberTokens,
  PKCE_COOKIE,
  REFRESH_COOKIE,
  SESSION_MARKER,
} from "@/lib/wix-auth";
import { backToLogin, SECURE_COOKIE } from "../shared";

/** Wix sends the member back here with an authorization code. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const raw = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${PKCE_COOKIE}=`))
    ?.slice(PKCE_COOKIE.length + 1);

  if (!code || !state || !raw) {
    return NextResponse.redirect(backToLogin(request, "Sign-in expired."), 303);
  }

  let stored: { verifier: string; state: string };
  try {
    stored = JSON.parse(decodeURIComponent(raw));
  } catch {
    return NextResponse.redirect(backToLogin(request, "Sign-in expired."), 303);
  }

  // Guards against CSRF: the state must match the one we issued.
  if (stored.state !== state) {
    return NextResponse.redirect(
      backToLogin(request, "Sign-in could not be verified."),
      303,
    );
  }

  try {
    const redirectUri = new URL("/api/auth/callback", request.url).toString();
    const tokens = await memberTokens(code, stored.verifier, redirectUri);

    const response = NextResponse.redirect(
      new URL("/profile", request.url),
      303,
    );
    response.cookies.set(ACCESS_COOKIE, tokens.access_token, {
      ...SECURE_COOKIE,
      maxAge: tokens.expires_in,
    });
    response.cookies.set(REFRESH_COOKIE, tokens.refresh_token, {
      ...SECURE_COOKIE,
      maxAge: 60 * 60 * 24 * 180,
    });
    // Browsers silently drop cookies over ~4KB. This marker is tiny, so if it
    // survives and the token cookies do not, we know that is what happened.
    response.cookies.set(SESSION_MARKER, "1", {
      ...SECURE_COOKIE,
      httpOnly: false,
      maxAge: tokens.expires_in,
    });
    response.cookies.delete(PKCE_COOKIE);
    return response;
  } catch {
    return NextResponse.redirect(
      backToLogin(request, "We could not complete sign-in."),
      303,
    );
  }
}
