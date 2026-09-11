"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Profile", href: "/profile" },
  { label: "News Feed", href: "/profile/news-feed" },
  { label: "Activity", href: "/profile/activity" },
  { label: "Settings", href: "/profile/settings" },
];

export function ProfileTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Profile" className="border-b border-border bg-background">
      <ul className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
        {TABS.map((tab) => {
          const active =
            tab.href === "/profile"
              ? pathname === "/profile"
              : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block whitespace-nowrap border-b-2 px-4 py-4 font-semibold ${
                  active
                    ? "border-brand text-brand"
                    : "border-transparent text-muted hover:text-brand"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const SETTINGS_TABS = [
  { label: "My Account", href: "/profile/settings" },
  { label: "About Me", href: "/profile/settings/about" },
  { label: "Privacy", href: "/profile/settings/privacy" },
];

export function SettingsTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Settings" className="border-b border-border">
      <ul className="flex gap-6 overflow-x-auto">
        {SETTINGS_TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block whitespace-nowrap border-b-2 py-3 text-sm font-semibold ${
                  active
                    ? "border-brand text-brand"
                    : "border-transparent text-muted hover:text-brand"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
