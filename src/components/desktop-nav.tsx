"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/lib/content";

/** A link is active on its own page and on anything nested under it. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const NAV_CLASS =
  "hidden flex-1 items-center gap-6 md:ml-10 md:flex lg:ml-20 lg:gap-8";
const LINK_CLASS =
  "relative py-5 text-base font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-md";

export function DesktopNav({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <nav className={NAV_CLASS}>
      {links.map((link) => {
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={`${link.href}-${link.label}`}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={`relative py-5 text-base font-medium transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full ${
              active
                ? "text-brand after:bg-brand"
                : "text-foreground hover:text-brand"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Rendered in the prerendered shell, before `usePathname` is available. */
export function DesktopNavFallback({ links }: { links: NavLink[] }) {
  return (
    <nav className={NAV_CLASS}>
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          className={`${LINK_CLASS} text-foreground hover:text-brand`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
