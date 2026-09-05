"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isActive } from "@/components/desktop-nav";
import type { NavLink } from "@/lib/content";

type Props = {
  links: NavLink[];
  phone?: string;
  phoneHref?: string;
  phonePrompt?: string;
  phoneLabel?: string;
};

export function MobileNav({
  links,
  phone,
  phoneHref,
  phonePrompt,
  phoneLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on Escape, and stop the page behind the sidebar from scrolling.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="-ml-2 flex size-10 items-center justify-center rounded-md text-brand hover:bg-surface"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-7"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {/* Dimmed backdrop; tapping it closes the sidebar. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 top-16 z-30 bg-foreground/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <nav
        id="mobile-menu"
        aria-label="Main"
        className={`fixed inset-y-0 top-16 left-0 z-40 flex w-[90%] max-w-sm flex-col overflow-y-auto bg-background shadow-xl transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <ul className="border-b border-border">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block border-b border-border px-5 py-5 text-xl font-medium uppercase tracking-wide ${
                    active ? "text-brand" : "text-muted hover:text-brand"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {phone ? (
          <div className="mt-auto bg-surface px-5 py-6">
            <a
              href={phoneHref ?? `tel:${phone}`}
              className="flex items-start gap-4"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mt-1 size-7 shrink-0 text-muted"
              >
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2Z" />
              </svg>
              <span>
                {phonePrompt ? (
                  <span className="block text-xl font-bold text-brand">
                    {phonePrompt}
                  </span>
                ) : null}
                <span className="block text-xl text-muted">
                  {phoneLabel ? `${phoneLabel} ` : null}
                  <span className="font-bold text-brand">{phone}</span>
                </span>
              </span>
            </a>
          </div>
        ) : null}
      </nav>
    </div>
  );
}

/**
 * Rendered in the prerendered shell while `usePathname` resolves. Matches the
 * real button's box so the header doesn't shift when the two swap.
 */
export function MobileNavFallback() {
  return (
    <div className="md:hidden">
      <div
        aria-hidden="true"
        className="-ml-2 flex size-10 items-center justify-center text-brand"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-7"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </div>
    </div>
  );
}
