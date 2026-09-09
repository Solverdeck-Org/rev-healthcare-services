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

  const hasContact = Boolean(
    settings.address || settings.phone || settings.email,
  );

  return (
    <footer className="mt-auto bg-footer">
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

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {hasContact ? (
            <div>
              <p className="text-base font-bold">
                {settings.addressHeading ?? "Headquarters"}
              </p>
              <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-muted">
                <p className="text-foreground">{settings.siteName}</p>
                {settings.address
                  ?.split("\n")
                  .filter(Boolean)
                  .map((line) => (
                    <p key={line}>{line}</p>
                  ))}
              </address>

              <div className="mt-4 space-y-1 text-sm">
                {settings.phone ? (
                  <p>
                    <a
                      href={settings.phoneHref ?? `tel:${settings.phone}`}
                      className="text-brand underline underline-offset-4 hover:text-brand-dark"
                    >
                      {settings.phone}
                    </a>
                  </p>
                ) : null}
                {settings.email ? (
                  <p>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-brand underline underline-offset-4 hover:text-brand-dark"
                    >
                      {settings.email}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {Object.entries(groups).map(([group, links]) => (
            <div key={group}>
              <p className="text-base font-bold">{group}</p>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted underline underline-offset-4 hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {settings.socialNav.length ? (
            <div>
              <p className="text-base font-bold">Social</p>
              <ul className="mt-4 flex flex-wrap items-center gap-3">
                {settings.socialNav.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={link.label}
                      className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-contrast hover:bg-brand-dark"
                    >
                      <NavIcon name={link.icon} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            {settings.footerNote ? <p>{settings.footerNote}</p> : null}
            {settings.footerText ? <p>{settings.footerText}</p> : null}
          </div>

          {settings.legalNav.length ? (
            <ul className="flex flex-wrap gap-x-3 gap-y-2 md:justify-end">
              {settings.legalNav.map((link, index) => (
                <li key={`${link.href}-${link.label}`} className="flex gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-border">
                      —
                    </span>
                  ) : null}
                  <Link
                    href={link.href}
                    className="underline underline-offset-4 hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
