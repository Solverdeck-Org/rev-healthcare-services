import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "We could not find the page you were looking for.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-start px-4 py-20 md:py-28">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
        We could not find that page
      </h1>
      <p className="mt-4 text-lg text-muted">
        The page may have moved, or the link may be out of date. If you were
        looking for care, the quickest route is to call us.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-md bg-brand px-6 py-3 font-semibold text-brand-contrast hover:bg-brand-dark"
        >
          Back to home
        </Link>
        <Link
          href="/services"
          className="rounded-md border border-border px-6 py-3 font-semibold hover:border-brand hover:text-brand"
        >
          Home care services
        </Link>
        <Link
          href="/find-a-location"
          className="rounded-md border border-border px-6 py-3 font-semibold hover:border-brand hover:text-brand"
        >
          Find a location
        </Link>
      </div>
    </div>
  );
}
