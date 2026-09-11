import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { displayName, getMember } from "@/lib/member";

export const metadata: Metadata = {
  title: "Your profile",
};

const TABS = [
  { label: "Profile", href: "/profile", current: true },
  { label: "Settings", href: "/profile/settings", current: false },
];

async function ProfileBody() {
  const result = await getMember();

  // No cookie at all: they are simply not signed in.
  if (result.status === "signed-out") redirect("/login");

  // We had a token and Wix rejected it. Say so instead of bouncing back to
  // the login page, which looks like "login did nothing".
  if (result.status === "no-permission") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold">Member access is not enabled yet</h1>
        <p className="mt-3 text-muted">
          Sign-in worked, but Wix will not let this app read member profiles. In
          the Wix dashboard open{" "}
          <strong>Settings → Headless Settings → OAuth apps</strong>, edit the
          app, and grant it the <strong>Read Members</strong> permission.
        </p>
        <form action="/api/auth/logout" method="post" className="mt-6">
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

  if (result.status === "unauthorized") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold">We could not load your profile</h1>
        <p className="mt-3 text-muted">
          You are signed in, but Wix would not accept the session. Signing in
          again usually fixes it.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-surface p-4 text-xs text-muted">
          {result.detail}
        </pre>
        <form action="/api/auth/logout" method="post" className="mt-6">
          <button
            type="submit"
            className="rounded-md bg-brand px-6 py-3 font-semibold text-brand-contrast hover:bg-brand-dark"
          >
            Sign in again
          </button>
        </form>
      </div>
    );
  }

  const member = result.member;
  const name = displayName(member);

  return (
    <>
      <nav aria-label="Profile" className="border-b border-border">
        <ul className="mx-auto flex max-w-5xl gap-2 px-4">
          {TABS.map((tab) => (
            <li key={tab.href}>
              <a
                href={tab.href}
                aria-current={tab.current ? "page" : undefined}
                className={`inline-block border-b-2 px-4 py-4 font-semibold ${
                  tab.current
                    ? "border-brand text-brand"
                    : "border-transparent text-muted hover:text-brand"
                }`}
              >
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          {member.pictureUrl ? (
            <Image
              src={member.pictureUrl}
              alt=""
              width={128}
              height={128}
              className="size-28 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-28 items-center justify-center rounded-full bg-brand text-4xl font-bold text-brand-contrast"
            >
              {name.charAt(0).toUpperCase()}
            </span>
          )}

          <div>
            <h1 className="text-3xl font-bold text-brand">{name}</h1>
            {member.email ? (
              <p className="mt-1 text-muted">
                {member.email}
                {member.emailVerified ? (
                  <span className="ml-2 rounded-md bg-brand-light px-2 py-0.5 text-xs font-semibold text-brand">
                    Verified
                  </span>
                ) : (
                  <span className="ml-2 rounded-md border border-border px-2 py-0.5 text-xs text-muted">
                    Not verified
                  </span>
                )}
              </p>
            ) : null}
            {member.createdDate ? (
              <p className="mt-1 text-sm text-muted">
                Member since{" "}
                {new Date(member.createdDate).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            ) : null}
          </div>

          <form action="/api/auth/logout" method="post" className="sm:ml-auto">
            <button
              type="submit"
              className="rounded-md border border-border px-5 py-2.5 font-semibold text-muted hover:border-brand hover:text-brand"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="h-28 w-28 animate-pulse rounded-full bg-surface" />
        </div>
      }
    >
      <ProfileBody />
    </Suspense>
  );
}
