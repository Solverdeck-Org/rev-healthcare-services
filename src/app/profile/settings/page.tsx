import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberGate, MemberGateFallback } from "@/components/member-gate";
import { SettingsTabs } from "@/components/profile-tabs";
import { getMember } from "@/lib/member";

export const metadata: Metadata = { title: "My account" };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-4 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-sm font-semibold text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

async function Body() {
  const result = await getMember();
  if (result.status !== "ok") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted">We could not load your account details.</p>
      </div>
    );
  }

  const member = result.member;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SettingsTabs />

      <h1 className="mt-8 text-2xl font-bold">My Account</h1>
      <p className="mt-2 text-muted">
        The details Wix holds for your membership.
      </p>

      <dl className="mt-6">
        <Row label="Login email" value={member.email ?? "—"} />
        <Row
          label="Email verified"
          value={
            member.emailVerified ? (
              <span className="rounded-md bg-brand-light px-2 py-0.5 text-sm font-semibold text-brand">
                Verified
              </span>
            ) : (
              <span className="rounded-md border border-border px-2 py-0.5 text-sm text-muted">
                Not verified
              </span>
            )
          }
        />
        <Row label="Screen name" value={member.nickname ?? "—"} />
        <Row
          label="Member since"
          value={
            member.createdDate
              ? new Date(member.createdDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—"
          }
        />
      </dl>

      <form action="/api/auth/logout" method="post" className="mt-8">
        <button
          type="submit"
          className="rounded-md border border-border px-5 py-2.5 font-semibold text-muted hover:border-brand hover:text-brand"
        >
          Log out
        </button>
      </form>
    </div>
  );
}

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<MemberGateFallback />}>
      <MemberGate>
        <Body />
      </MemberGate>
    </Suspense>
  );
}
