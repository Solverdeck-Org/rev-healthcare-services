import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberGate, MemberGateFallback } from "@/components/member-gate";
import { SettingsTabs } from "@/components/profile-tabs";
import { getMember } from "@/lib/member";

export const metadata: Metadata = { title: "Privacy" };

async function Body() {
  const result = await getMember();
  const email = result.status === "ok" ? result.member.email : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SettingsTabs />

      <h1 className="mt-8 text-2xl font-bold">Privacy</h1>
      <p className="mt-2 text-muted">
        How your information is used and how to remove it.
      </p>

      <div className="mt-6 space-y-4 text-muted">
        <p>
          Your account details are stored by Wix, which hosts our membership
          system. We use your email address to sign you in and to contact you
          about care enquiries you make.
        </p>
        <p>
          To request a copy of your data, or to have your account and details
          deleted, email us at{" "}
          <a
            href="mailto:ebizuofa@gmail.com"
            className="text-brand underline underline-offset-4"
          >
            ebizuofa@gmail.com
          </a>
          {email ? ` from ${email}` : null}. We will confirm once it is done.
        </p>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<MemberGateFallback />}>
      <MemberGate>
        <Body />
      </MemberGate>
    </Suspense>
  );
}
