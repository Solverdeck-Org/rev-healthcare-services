# Rev Healthcare Services

Next.js 16 front end whose entire UI — header, footer, page bodies, images, links and
SEO text — is driven by Wix headless CMS (Wix Data collections). Nothing user-visible is
hardcoded; the template only decides layout and styling.

## Setup

1. `cp .env.example .env.local` and fill in:
   - `WIX_API_KEY` — Wix account API key (Settings → API Keys), scoped to Wix Data read.
   - `WIX_SITE_ID` — the site holding the collections.
   - `REVALIDATE_SECRET` — any random string.
2. `bun scripts/seed-wix.ts` — creates the collections below and fills them with
   starting content. Safe to re-run; it skips anything that already exists.
3. `bun dev`

After seeding, all content editing happens in the Wix CMS. Nothing in this repo
needs to change to add a page, reorder a section, or swap an image.


## Collections

**SiteSettings** (one item) — `siteName`, `logo` (image), `logoAlt`, `phone`, `phoneHref`,
`ctaLabel`, `ctaHref`, `footerText`, `footerNote`.

**NavLinks** — `label`, `href`, `order` (number), `location` (`header` | `footer`),
`group` (footer column title).

**Pages** — `slug`, `title`, `seoDescription`. The home page uses slug `home`; every other
slug is served at `/<slug>`.

**Sections** — `pageSlug`, `sectionKey` (unique), `order` (number), `type`
(`hero` | `cards` | `links` | `richText` | `cta`), `eyebrow`, `heading`, `subheading`,
`body`, `image`, `imageAlt`, `ctaLabel`, `ctaHref`, `inputLabel`, `inputPlaceholder`.

**SectionItems** — `sectionKey` (matches `Sections.sectionKey`), `order`, `title`, `description`,
`href`, `image`, `imageAlt`. Used for card grids and link lists.

## Theming

Brand colors live as CSS variables in `src/app/globals.css` (`--brand`, `--brand-dark`,
`--brand-light`). Swap those to restyle the whole site; the palette is green throughout.

## Caching

Content reads use `use cache` with `cacheLife("hours")` and are tagged `site` and
`page:<slug>`. Publish a Wix automation that POSTs to
`/api/revalidate?secret=...&slug=<slug>` to refresh instantly after an edit.
