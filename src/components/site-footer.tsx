import Link from "next/link";
import { getSiteSettings, type NavLink } from "@/lib/content";

export async function SiteFooter() {
  const settings = await getSiteSettings();

  const groups = settings.footerNav.reduce<Record<string, NavLink[]>>(
    (acc, link) => {
      const group = link.group ?? "";
      acc[group] = acc[group] ? [...acc[group], link] : [link];
      return acc;
    },
    {},
  );

  return (
    <footer className="mt-auto bg-brand-dark text-brand-contrast">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-bold">{settings.siteName}</p>
          {settings.footerText ? (
            <p className="mt-3 text-sm text-brand-contrast/80">
              {settings.footerText}
            </p>
          ) : null}
        </div>

        {Object.entries(groups).map(([group, links]) => (
          <div key={group || "links"}>
            {group ? (
              <p className="text-sm font-semibold uppercase tracking-wide">
                {group}
              </p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-contrast/80 hover:text-brand-contrast"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {settings.footerNote ? (
        <div className="border-t border-brand-contrast/20">
          <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-brand-contrast/70">
            {settings.footerNote}
          </p>
        </div>
      ) : null}
    </footer>
  );
}
