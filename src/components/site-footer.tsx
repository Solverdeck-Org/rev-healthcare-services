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
    <footer className="mt-auto">
      <div className="bg-footer">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <p className="text-xl font-bold text-brand">{settings.siteName}</p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groups).map(([group, links]) => (
              <div key={group || "links"}>
                {group ? (
                  <p className="text-sm font-bold uppercase tracking-wide">
                    {group}
                  </p>
                ) : null}
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-foreground hover:text-brand hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {settings.footerText || settings.footerNote ? (
        <div className="bg-footer-bar text-brand-contrast">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-6 text-center text-xs leading-relaxed">
            {settings.footerText ? <p>{settings.footerText}</p> : null}
            {settings.footerNote ? <p>{settings.footerNote}</p> : null}
          </div>
        </div>
      ) : null}
    </footer>
  );
}
