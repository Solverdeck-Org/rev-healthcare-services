import { NextResponse } from "next/server";
import { authorizeUrl, oauthState, PKCE_COOKIE, pkce } from "@/lib/wix-auth";

/** Cookies are httpOnly so member tokens never reach client JavaScript. */
export const SECURE_COOKIE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;

export function stashPkce(
  response: NextResponse,
  verifier: string,
  state: string,
) {
  response.cookies.set(PKCE_COOKIE, JSON.stringify({ verifier, state }), {
    ...SECURE_COOKIE,
    maxAge: 600,
  });
}

/** Distinguishes "not configured yet" from a genuine credential failure. */
export function isConfigured(): boolean {
  return Boolean(process.env.WIX_CLIENT_ID);
}

export const NOT_CONFIGURED =
  "Sign-in is not available yet: WIX_CLIENT_ID is not set.";

export function backToLogin(request: Request, message: string): URL {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", message);
  return url;
}

/**
 * Shared tail of every successful authentication: mint PKCE, ask Wix for an
 * authorization URL, and send the browser there. The callback route swaps the
 * resulting code for member tokens.
 */
export async function completeLogin(
  request: Request,
  sessionToken: string,
): Promise<NextResponse> {
  const { verifier, challenge } = await pkce();
  const state = oauthState();
  const redirectUri = new URL("/api/auth/callback", request.url).toString();

  const url = await authorizeUrl({
    sessionToken,
    challenge,
    state,
    redirectUri,
  });

  const response = NextResponse.redirect(url, 303);
  stashPkce(response, verifier, state);
  return response;
}
