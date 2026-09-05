"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { isActive } from "@/components/desktop-nav";
import type { NavLink } from "@/lib/content";

type Props = {
  links: NavLink[];
  phone?: string;
  phoneHref?: string;
};

export function MobileNav({ links, phone, phoneHref }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="-ml-2 flex size-10 items-center justify-center rounded-md text-foreground hover:bg-surface"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="size-6"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      <nav
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-background shadow-sm"
      >
        <ul className="px-4 py-2">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`block border-l-2 py-3 pl-3 text-base font-medium ${
                    active
                      ? "border-brand text-brand"
                      : "border-transparent text-foreground hover:text-brand"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {phone ? (
            <li className="border-t border-border">
              <a
                href={phoneHref ?? `tel:${phone}`}
                className="block py-3 text-base font-semibold text-brand"
              >
                {phone}
              </a>
            </li>
          ) : null}
        </ul>
      </nav>
    </div>
  );
}
