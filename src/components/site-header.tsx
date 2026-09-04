import Image from "next/image";
import Link from "next/link";
import { getSiteSettings } from "@/lib/content";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt={settings.logoAlt ?? settings.siteName}
              width={160}
              height={36}
              className="h-9 w-auto"
              priority
            />
          ) : (
            <span className="text-xl font-bold text-brand">
              {settings.siteName}
            </span>
          )}
        </Link>

        <nav className="hidden flex-1 items-center gap-6 md:flex">
          {settings.headerNav.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-sm font-medium text-foreground hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {settings.phone ? (
            <a
              href={settings.phoneHref ?? `tel:${settings.phone}`}
              className="hidden items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark sm:inline-flex"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 shrink-0"
              >
                <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2Z" />
              </svg>
              {settings.phone}
            </a>
          ) : null}
          {settings.ctaLabel ? (
            <Link
              href={settings.ctaHref ?? "#"}
              className="rounded-md bg-brand px-4 py-2 text-sm font-semibold tracking-wide text-brand-contrast uppercase hover:bg-brand-dark"
            >
              {settings.ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
