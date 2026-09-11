import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Log In or Sign Up",
  description: "Log in to your account or create a new one.",
};

const FIELD =
  "mt-2 w-full rounded-md border border-border bg-surface px-4 py-3 outline-none focus:border-brand";

async function Messages({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;
  if (!error && !notice) return null;

  return (
    <output
      className={`mb-8 block rounded-md border px-4 py-3 text-sm ${
        error
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-border bg-brand-light text-foreground"
      }`}
    >
      {error ?? notice}
    </output>
  );
}

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
      <Suspense fallback={null}>
        <Messages searchParams={searchParams} />
      </Suspense>

      <div className="grid gap-12 md:grid-cols-2 md:gap-0">
        {/* Existing members */}
        <section className="md:pr-12">
          <p className="text-lg uppercase tracking-wide text-muted">Member</p>
          <h1 className="text-4xl font-bold sm:text-5xl">Login</h1>

          <form action="/api/auth/login" method="post" className="mt-6">
            <label htmlFor="identifier" className="sr-only">
              Screen name or email address
            </label>
            <input
              id="identifier"
              name="identifier"
              autoComplete="username"
              required
              placeholder="Screen name or email address"
              className={FIELD}
            />

            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              className={FIELD}
            />

            <p className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-brand hover:underline"
              >
                Forgot your password?
              </Link>
            </p>

            <div className="mt-4 flex items-center justify-between gap-4">
              <label
                htmlFor="remember"
                className="flex items-center gap-2 text-sm"
              >
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="size-4 accent-[var(--brand)]"
                />
                Remember Me
              </label>

              <button
                type="submit"
                className="rounded-md bg-brand px-8 py-2.5 text-lg font-semibold text-brand-contrast hover:bg-brand-dark"
              >
                Log In
              </button>
            </div>
          </form>
        </section>

        {/* New members */}
        <section className="border-border md:border-l md:pl-12">
          <p className="text-lg uppercase tracking-wide text-muted">
            New Member
          </p>
          <h2 className="text-4xl font-bold sm:text-5xl">SignUp</h2>

          <form action="/api/auth/signup" method="post" className="mt-6">
            <label htmlFor="screenName" className="sr-only">
              Create your screen name
            </label>
            <input
              id="screenName"
              name="screenName"
              required
              minLength={6}
              maxLength={15}
              pattern="[A-Za-z0-9]+"
              placeholder="Create your screen name"
              aria-describedby="screenName-help"
              className={FIELD}
            />
            <p id="screenName-help" className="mt-2 text-sm text-muted">
              Use 6 to 15 letters and/or numbers. Your screen name is displayed
              when you ask or answer questions or participate in discussions.
            </p>

            <label htmlFor="signup-email" className="sr-only">
              Email address
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              className={FIELD}
            />

            <label htmlFor="signup-password" className="sr-only">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="Password"
              className={FIELD}
            />

            <button
              type="submit"
              className="mt-5 rounded-md bg-brand px-8 py-2.5 text-lg font-semibold text-brand-contrast hover:bg-brand-dark"
            >
              Get Started
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
