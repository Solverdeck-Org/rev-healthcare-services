"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/nav-icon";
import type { NavLink } from "@/lib/content";

/** A link is active on its own page and on anything nested under it. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const NAV_CLASS =
  "hidden flex-1 items-center gap-4 md:ml-4 md:flex lg:ml-8 lg:gap-6 xl:ml-14 xl:gap-9";
const LINK_CLASS =
  "relative flex items-center gap-2 whitespace-nowrap py-5 text-sm font-bold uppercase tracking-wide transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-md xl:text-base 2xl:text-lg";

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
            className={`${LINK_CLASS} ${
              active
                ? "text-brand after:bg-brand"
                : "text-foreground hover:text-brand"
            }`}
          >
            <NavIcon name={link.icon} />
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
          <NavIcon name={link.icon} />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
