import type { Metadata } from "next";
import { Suspense } from "react";
import { SubmitButton } from "@/components/submit-button";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Enter the code we emailed you to finish creating your account.",
};

async function VerifyError({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;
  return (
    <output className="mb-6 block rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
      {error}
    </output>
  );
}

export default function VerifyPage({ searchParams }: PageProps<"/verify">) {
  return (
    <div className="mx-auto max-w-md px-4 py-16 md:py-24">
      <Suspense fallback={null}>
        <VerifyError searchParams={searchParams} />
      </Suspense>

      <h1 className="text-3xl font-bold sm:text-4xl">Check your email</h1>
      <p className="mt-3 text-muted">
        We sent a verification code to your email address. Enter it below to
        finish creating your account.
      </p>

      <form action="/api/auth/verify" method="post" className="mt-8">
        <label htmlFor="code" className="block text-sm font-medium">
          Verification code
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          placeholder="123456"
          className="mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 text-lg tracking-widest outline-none focus:border-brand"
        />

        <SubmitButton
          pendingLabel="Verifying"
          className="mt-5 w-full rounded-md bg-brand px-8 py-3 text-lg font-semibold text-brand-contrast hover:bg-brand-dark"
        >
          Verify
        </SubmitButton>
      </form>

      <p className="mt-6 text-sm text-muted">
        The code can take a minute to arrive. Check your spam folder if you do
        not see it.
      </p>
    </div>
  );
}
