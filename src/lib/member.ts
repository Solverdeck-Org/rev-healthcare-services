import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/wix-auth";

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
 * The signed-in member, or null. Reads the httpOnly cookie set by the auth
 * callback — never call this from a client component.
 */
export async function getCurrentMember(): Promise<Member | null> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return null;

  const response = await fetch(
    "https://www.wixapis.com/members/v1/members/my?fieldsets=FULL",
    {
      headers: { authorization: token },
      cache: "no-store",
    },
  );

  if (!response.ok) return null;

  const { member } = (await response.json()) as WixMember;
  if (!member?._id) return null;

  return {
    id: member._id,
    nickname: member.profile?.nickname,
    firstName: member.profile?.firstName,
    lastName: member.profile?.lastName,
    email: member.loginEmail,
    emailVerified: member.loginEmailVerified,
    pictureUrl: member.profile?.photo?.url,
    createdDate: member._createdDate,
  };
}

export function displayName(member: Member): string {
  const full = [member.firstName, member.lastName].filter(Boolean).join(" ");
  return member.nickname || full || member.email || "Member";
}
