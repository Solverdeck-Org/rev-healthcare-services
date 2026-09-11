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

/**
 * The REST API returns bare keys (`id`, `createdDate`) while the JavaScript
 * SDK returns underscored ones (`_id`, `_createdDate`). Accept either, so a
 * shape change on Wix's side cannot silently blank the profile again.
 */
type WixMemberRecord = {
  id?: string;
  _id?: string;
  loginEmail?: string;
  loginEmailVerified?: boolean;
  createdDate?: string;
  _createdDate?: string;
  profile?: {
    nickname?: string;
    firstName?: string;
    lastName?: string;
    photo?: { url?: string };
  };
};

type WixMember = { member?: WixMemberRecord };

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
    // Wix answers a missing permission with 403 and an empty body.
    if (response.status === 403) return { status: "no-permission" };
    return {
      status: "unauthorized",
      detail: `Wix rejected the session (${response.status}).`,
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

  const id = member?.id ?? member?._id;
  if (!id) {
    // Authenticated, but this identity has no site-member record yet.
    return {
      status: "unauthorized",
      detail: "Wix returned no member record for this account.",
    };
  }

  return {
    status: "ok",
    member: {
      id,
      nickname: member?.profile?.nickname,
      firstName: member?.profile?.firstName,
      lastName: member?.profile?.lastName,
      email: member?.loginEmail,
      emailVerified: member?.loginEmailVerified,
      pictureUrl: member?.profile?.photo?.url,
      createdDate: member?.createdDate ?? member?._createdDate,
    },
  };
}

export function displayName(member: Member): string {
  const full = [member.firstName, member.lastName].filter(Boolean).join(" ");
  return member.nickname || full || member.email || "Member";
}
