import { cacheLife, cacheTag } from "next/cache";
import { mediaUrl, num, queryCollection, str, type WixItem } from "./wix";

export type NavLink = {
  label: string;
  href: string;
  group?: string;
  icon?: string;
};

export type SiteSettings = {
  siteName: string;
  logoUrl?: string;
  logoAlt?: string;
  phone?: string;
  phoneHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  footerText?: string;
  footerNote?: string;
  headerNav: NavLink[];
  footerNav: NavLink[];
};

export type SectionItem = {
  title: string;
  description?: string;
  href?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type SectionType = "hero" | "cards" | "links" | "richText" | "cta";

export type Section = {
  key: string;
  type: SectionType;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  items: SectionItem[];
};

export type Page = {
  slug: string;
  title: string;
  seoDescription?: string;
  sections: Section[];
};

const COLLECTIONS = {
  settings: "SiteSettings",
  nav: "NavLinks",
  pages: "Pages",
  sections: "Sections",
  sectionItems: "SectionItems",
} as const;

function toNavLink(item: WixItem): NavLink {
  return {
    label: str(item, "label") ?? "",
    href: str(item, "href") ?? "#",
    group: str(item, "group"),
    icon: str(item, "icon"),
  };
}

function byOrder(a: WixItem, b: WixItem) {
  return (num(a, "order") ?? 0) - (num(b, "order") ?? 0);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("site");

  const [settingsItems, navItems] = await Promise.all([
    queryCollection(COLLECTIONS.settings, { limit: 1 }),
    queryCollection(COLLECTIONS.nav, {
      sort: [{ fieldName: "order", order: "ASC" }],
    }),
  ]);

  const settings = settingsItems[0] ?? {};
  const links = [...navItems].sort(byOrder);

  return {
    siteName: str(settings, "siteName") ?? "",
    logoUrl: mediaUrl(str(settings, "logo")),
    logoAlt: str(settings, "logoAlt") ?? str(settings, "siteName"),
    phone: str(settings, "phone"),
    phoneHref: str(settings, "phoneHref"),
    ctaLabel: str(settings, "ctaLabel"),
    ctaHref: str(settings, "ctaHref"),
    footerText: str(settings, "footerText"),
    footerNote: str(settings, "footerNote"),
    headerNav: links
      .filter((item) => (str(item, "location") ?? "header") === "header")
      .map(toNavLink),
    footerNav: links
      .filter((item) => str(item, "location") === "footer")
      .map(toNavLink),
  };
}

export async function getPage(slug: string): Promise<Page | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("site", `page:${slug}`);

  const pages = await queryCollection(COLLECTIONS.pages, {
    filter: { slug },
    limit: 1,
  });
  const page = pages[0];
  if (!page) return null;

  const sectionItems = await queryCollection(COLLECTIONS.sections, {
    filter: { pageSlug: slug },
    sort: [{ fieldName: "order", order: "ASC" }],
  });

  const keys = sectionItems
    .map((section) => str(section, "sectionKey"))
    .filter((key): key is string => Boolean(key));

  const children = keys.length
    ? await queryCollection(COLLECTIONS.sectionItems, {
        filter: { sectionKey: { $in: keys } },
        sort: [{ fieldName: "order", order: "ASC" }],
        limit: 500,
      })
    : [];

  const sections = [...sectionItems].sort(byOrder).map((section): Section => {
    const key = str(section, "sectionKey") ?? "";
    return {
      key,
      type: (str(section, "type") as SectionType) ?? "richText",
      eyebrow: str(section, "eyebrow"),
      heading: str(section, "heading"),
      subheading: str(section, "subheading"),
      body: str(section, "body"),
      imageUrl: mediaUrl(str(section, "image")),
      imageAlt: str(section, "imageAlt"),
      ctaLabel: str(section, "ctaLabel"),
      ctaHref: str(section, "ctaHref"),
      inputLabel: str(section, "inputLabel"),
      inputPlaceholder: str(section, "inputPlaceholder"),
      items: children
        .filter((child) => str(child, "sectionKey") === key)
        .sort(byOrder)
        .map((child) => ({
          title: str(child, "title") ?? "",
          description: str(child, "description"),
          href: str(child, "href"),
          imageUrl: mediaUrl(str(child, "image")),
          imageAlt: str(child, "imageAlt"),
        })),
    };
  });

  return {
    slug,
    title: str(page, "title") ?? slug,
    seoDescription: str(page, "seoDescription"),
    sections,
  };
}
