import Image from "next/image";
import Link from "next/link";
import { NavIcon } from "@/components/nav-icon";
import { getSiteSettings, type NavLink } from "@/lib/content";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  const groups = settings.footerNav.reduce<Record<string, NavLink[]>>(
    (acc, link) => {
      const group = link.group ?? "More";
      acc[group] = acc[group] ? [...acc[group], link] : [link];
      return acc;
    },
    {},
  );

  const columns = Object.entries(groups);
  const hasSocial = settings.socialNav.length > 0;

  return (
    <footer className="mt-auto">
      <div className="bg-footer">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <Link href="/" className="inline-flex items-center">
            {settings.logoUrl ? (
              <Image
                src={settings.logoUrl}
                alt={settings.logoAlt ?? settings.siteName}
                width={200}
                height={44}
                className="h-10 w-auto max-w-[200px] object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-brand">
                {settings.siteName}
              </span>
            )}
          </Link>

          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {columns.map(([group, links], index) => (
              <div
                key={group}
                className={
                  index > 0
                    ? "lg:border-l lg:border-border lg:pl-10"
                    : undefined
                }
              >
                <p className="text-sm font-bold uppercase tracking-wide">
                  {group}
                </p>
                <ul className="mt-5 space-y-4">
                  {links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-foreground hover:text-brand hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {hasSocial ? (
              <div
                className={
                  columns.length > 0
                    ? "lg:border-l lg:border-border lg:pl-10"
                    : undefined
                }
              >
                <p className="text-sm font-bold uppercase tracking-wide">
                  Follow Us
                </p>
                <ul className="mt-5 flex flex-wrap items-center gap-4">
                  {settings.socialNav.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={link.label}
                        className="flex size-9 items-center justify-center rounded-full text-brand hover:text-brand-dark"
                      >
                        <NavIcon name={link.icon} className="size-7" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {settings.footerText || settings.footerNote ? (
        <div className="bg-footer-bar text-brand-contrast">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-center text-sm leading-relaxed">
            {settings.footerText ? <p>{settings.footerText}</p> : null}
            {settings.footerNote ? (
              <p className="text-brand-contrast/80">{settings.footerNote}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
