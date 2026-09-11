import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberGate, MemberGateFallback } from "@/components/member-gate";
import { SettingsTabs } from "@/components/profile-tabs";
import { SubmitButton } from "@/components/submit-button";
import { getMember } from "@/lib/member";

export const metadata: Metadata = { title: "About me" };

const FIELD =
  "mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 outline-none focus:border-brand";

async function Body({
  searchParams,
}: Pick<PageProps<"/profile/settings/about">, "searchParams">) {
  const [result, params] = await Promise.all([getMember(), searchParams]);
  if (result.status !== "ok") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-muted">We could not load your details.</p>
      </div>
    );
  }

  const member = result.member;
  const saved = params.saved === "1";
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SettingsTabs />

      <h1 className="mt-8 text-2xl font-bold">About Me</h1>
      <p className="mt-2 text-muted">
        This is how your name appears on the site.
      </p>

      {saved ? (
        <output className="mt-6 block rounded-md border border-border bg-brand-light px-4 py-3 text-sm">
          Your details were saved.
        </output>
      ) : null}
      {error ? (
        <output className="mt-6 block rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </output>
      ) : null}

      <form action="/api/member/profile" method="post" className="mt-6">
        <label htmlFor="nickname" className="block text-sm font-semibold">
          Screen name
        </label>
        <input
          id="nickname"
          name="nickname"
          defaultValue={member.nickname ?? ""}
          className={FIELD}
        />

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold">
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              defaultValue={member.firstName ?? ""}
              className={FIELD}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold">
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              defaultValue={member.lastName ?? ""}
              className={FIELD}
            />
          </div>
        </div>

        <SubmitButton
          pendingLabel="Saving"
          className="mt-6 rounded-md bg-brand px-8 py-2.5 font-semibold text-brand-contrast hover:bg-brand-dark"
        >
          Save changes
        </SubmitButton>
      </form>
    </div>
  );
}

export default function AboutMePage({
  searchParams,
}: PageProps<"/profile/settings/about">) {
  return (
    <Suspense fallback={<MemberGateFallback />}>
      <MemberGate>
        <Body searchParams={searchParams} />
      </MemberGate>
    </Suspense>
  );
}
