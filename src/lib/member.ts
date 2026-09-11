import { cookies } from "next/headers";
import { ACCESS_COOKIE, SESSION_MARKER } from "@/lib/wix-auth";

export type Member = {
  id: string;
  nickname?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  emailVerified?: boolean;
  pictureUrl?: string;
  createdDate?: string;
};

/**
 * Why we could not show a profile. `signed-out` means no cookie at all;
 * `unauthorized` means we had a token and Wix rejected it — very different
 * problems, and collapsing them caused a redirect loop.
 */
export type MemberResult =
  | { status: "ok"; member: Member }
  | { status: "signed-out" }
  | { status: "unauthorized"; detail: string }
  /** Authenticated fine, but the OAuth app cannot read members. */
  | { status: "no-permission" };

type WixMember = {
  member?: {
    _id?: string;
    loginEmail?: string;
    loginEmailVerified?: boolean;
    _createdDate?: string;
    profile?: {
      nickname?: string;
      firstName?: string;
      lastName?: string;
      photo?: { url?: string };
    };
  };
};

/**
 * Wix access tokens wrap a JWT. Peeking at the payload tells us whether the
 * caller is a member or still a visitor — the difference between "no member
 * record" and "we stored the wrong token".
 */
function describeToken(token: string): string {
  try {
    const jwt = token.split(".").find((part) => part.startsWith("eyJ"));
    if (!jwt) return "token: unrecognised format";
    const json = JSON.parse(
      Buffer.from(jwt, "base64").toString("utf8").replace(/\0/g, ""),
    ) as Record<string, unknown>;
    const data =
      typeof json.data === "string"
        ? (JSON.parse(json.data) as Record<string, unknown>)
        : json;
    return `token identity: ${JSON.stringify(data).slice(0, 240)}`;
  } catch {
    return "token: could not decode";
  }
}

const MY_MEMBER =
  "https://www.wixapis.com/members/v1/members/my?fieldsets=FULL";

async function fetchMe(authorization: string) {
  return fetch(MY_MEMBER, {
    headers: { authorization },
    cache: "no-store",
  });
}

export async function getMember(): Promise<MemberResult> {
  const jar = await cookies();
  const token = jar.get(ACCESS_COOKIE)?.value;

  if (!token) {
    // The callback ran, but the token cookie is gone: almost always the 4KB
    // per-cookie limit. Report it rather than looping back to /login.
    if (jar.get(SESSION_MARKER)) {
      return {
        status: "unauthorized",
        detail:
          "Sign-in completed, but the session cookie was not stored (it may exceed the 4KB browser limit).",
      };
    }
    return { status: "signed-out" };
  }

  // Wix accepts the raw token on its IAM endpoints; some gateways expect the
  // standard Bearer form. Try raw, fall back to Bearer before giving up.
  let response = await fetchMe(token);
  if (response.status === 401 || response.status === 403) {
    response = await fetchMe(`Bearer ${token}`);
  }

  if (!response.ok) {
    const body = await response.text();
    // Wix answers a missing permission with 403 and an empty body.
    if (response.status === 403) return { status: "no-permission" };
    return {
      status: "unauthorized",
      detail: `${response.status} ${body.slice(0, 300)}`,
    };
  }

  const raw = await response.text();
  let parsed: WixMember;
  try {
    parsed = JSON.parse(raw) as WixMember;
  } catch {
    return {
      status: "unauthorized",
      detail: `Unreadable response: ${raw.slice(0, 300)}`,
    };
  }

  const member = parsed.member;
  // Same permission failure, but delivered as 200 with an empty envelope.
  if (!member && raw.includes('"details":{}')) {
    return { status: "no-permission" };
  }
  if (!member?._id) {
    // Authenticated, but this identity has no site-member record yet.
    return {
      status: "unauthorized",
      detail: [
        `Wix returned no member. Response: ${raw.slice(0, 200)}`,
        describeToken(token),
      ].join("\n\n"),
    };
  }

  return {
    status: "ok",
    member: {
      id: member._id,
      nickname: member.profile?.nickname,
      firstName: member.profile?.firstName,
      lastName: member.profile?.lastName,
      email: member.loginEmail,
      emailVerified: member.loginEmailVerified,
      pictureUrl: member.profile?.photo?.url,
      createdDate: member._createdDate,
    },
  };
}

export function displayName(member: Member): string {
  const full = [member.firstName, member.lastName].filter(Boolean).join(" ");
  return member.nickname || full || member.email || "Member";
}
