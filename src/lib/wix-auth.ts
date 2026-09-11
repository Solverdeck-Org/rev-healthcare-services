/**
 * Wix member authentication (custom login).
 *
 * The visitor never sees a Wix-hosted login page: they submit our own form and
 * we run the exchange server-side. Wix still requires an OAuth app client ID —
 * it authorizes the login call and issues the member's tokens.
 *
 *   WIX_CLIENT_ID — from the project's Headless Settings (not a secret)
 *
 * Flow: visitor token -> login/register -> sessionToken -> redirect session
 * -> authorization code -> member access + refresh tokens.
 */

const IAM = "https://www.wixapis.com/_api/iam";
const OAUTH_TOKEN = "https://www.wixapis.com/oauth2/token";
const REDIRECT_SESSION =
  "https://www.wixapis.com/_api/redirects-api/v1/redirect-session";

export const ACCESS_COOKIE = "wix_member_access";
export const REFRESH_COOKIE = "wix_member_refresh";
export const PKCE_COOKIE = "wix_auth_pkce";
export const STATE_COOKIE = "wix_auth_state_token";
/** Small marker proving the callback ran, even if the token cookies were dropped. */
export const SESSION_MARKER = "wix_auth_ok";

export function clientId(): string {
  const id = process.env.WIX_CLIENT_ID;
  if (!id) {
    throw new Error(
      "Wix auth is not configured: set WIX_CLIENT_ID (Headless Settings -> OAuth apps).",
    );
  }
  return id;
}

async function post<T>(url: string, body: unknown, token?: string): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: token } : {}),
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Wix auth ${response.status}: ${text}`);
  }
  return JSON.parse(text) as T;
}

/** Anonymous token that authorizes the login and register calls. */
export async function visitorToken(): Promise<string> {
  const data = await post<{ access_token: string }>(OAUTH_TOKEN, {
    clientId: clientId(),
    grantType: "anonymous",
  });
  return data.access_token;
}

type AuthState = {
  state: "SUCCESS" | "REQUIRE_EMAIL_VERIFICATION" | "REQUIRE_OWNER_APPROVAL";
  sessionToken?: string;
  stateToken?: string;
};

export async function login(
  email: string,
  password: string,
): Promise<AuthState> {
  return post<AuthState>(
    `${IAM}/authentication/v2/login`,
    { loginId: { email }, password },
    await visitorToken(),
  );
}

export async function register(
  email: string,
  password: string,
  profile?: Record<string, unknown>,
): Promise<AuthState> {
  return post<AuthState>(
    `${IAM}/authentication/v2/register`,
    { loginId: { email }, password, ...(profile ? { profile } : {}) },
    await visitorToken(),
  );
}

/** Completes a login that stopped at REQUIRE_EMAIL_VERIFICATION. */
export async function verifyCode(
  code: string,
  stateToken: string,
): Promise<AuthState> {
  return post<AuthState>(
    `${IAM}/verification/v1/auth/verify`,
    { code, stateToken },
    await visitorToken(),
  );
}

export async function sendRecoveryEmail(
  email: string,
  redirectUrl: string,
): Promise<void> {
  await post(
    `${IAM}/recovery/v1/send-email`,
    { email, redirect: { url: redirectUrl, clientId: clientId() } },
    await visitorToken(),
  );
}

/* --- PKCE ---------------------------------------------------------------- */

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return btoa(String.fromCharCode(...view))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function randomString(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function pkce(): Promise<{ verifier: string; challenge: string }> {
  const verifier = randomString();
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return { verifier, challenge: base64url(digest) };
}

export function oauthState(): string {
  return randomString();
}

/**
 * Turns a session token into the Wix URL that hands back an authorization
 * code at `redirectUri`.
 */
export async function authorizeUrl(opts: {
  sessionToken: string;
  challenge: string;
  state: string;
  redirectUri: string;
}): Promise<string> {
  const data = await post<{ redirectSession: { fullUrl: string } }>(
    REDIRECT_SESSION,
    {
      auth: {
        authRequest: {
          clientId: clientId(),
          codeChallenge: opts.challenge,
          codeChallengeMethod: "S256",
          responseMode: "query",
          responseType: "code",
          scope: "offline_access",
          state: opts.state,
          sessionToken: opts.sessionToken,
          redirectUri: opts.redirectUri,
        },
      },
    },
    await visitorToken(),
  );
  return data.redirectSession.fullUrl;
}

export async function memberTokens(
  code: string,
  codeVerifier: string,
  redirectUri: string,
): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  return post(OAUTH_TOKEN, {
    clientId: clientId(),
    grantType: "authorization_code",
    code,
    codeVerifier,
    redirectUri,
  });
}

export async function logoutUrl(postFlowUrl: string): Promise<string> {
  const data = await post<{ redirectSession: { fullUrl: string } }>(
    REDIRECT_SESSION,
    { logout: { clientId: clientId() }, callbacks: { postFlowUrl } },
    await visitorToken(),
  );
  return data.redirectSession.fullUrl;
}
