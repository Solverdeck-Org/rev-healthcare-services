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
  | { status: "unauthorized"; detail: string };

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
    return {
      status: "unauthorized",
      detail: `${response.status} ${body.slice(0, 300)}`,
    };
  }

  const { member } = (await response.json()) as WixMember;
  if (!member?._id) {
    return { status: "unauthorized", detail: "Wix returned no member." };
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
