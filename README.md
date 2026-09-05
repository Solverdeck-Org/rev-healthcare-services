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

**Sections** — `pageSlug`, `sectionKey` (unique), `order` (number), `type`, `eyebrow`,
`heading`, `subheading`, `body`, `image`, `imageAlt`, `ctaLabel`, `ctaHref`, `inputLabel`,
`inputPlaceholder`, `imagePosition` (`left` | `right`, splitImageText only).

**SectionItems** — `sectionKey` (matches `Sections.sectionKey`), `order`, `title`,
`subtitle`, `meta`, `description`, `href`, `image`, `imageAlt`.

### Section types

| `type` | Layout | Uses SectionItems |
|---|---|---|
| `hero` | Headline, sub, optional ZIP input + button, optional image right | no |
| `cards` | 3-across bordered cards | `title`, `description`, `href`, `image` |
| `links` | 4-across list of text links | `title`, `href` |
| `richText` | Eyebrow, heading, paragraphs | no |
| `cta` | Pale green band with a button | no |
| `splitImageText` | Image one side, copy + button the other (`imagePosition`) | no |
| `stats` | Green band, 4-across big numbers | `title` (value), `description` (label) |
| `team` | 4-across square photos | `title` (name), `subtitle` (role), `description`, `image` |
| `featureList` | 2-column list, icon or bullet per row | `title`, `description`, `href`, `image` (icon) |
| `jobList` | Divided rows with an Apply button | `title` (role), `subtitle` (location), `meta` (type), `description`, `href` |

Paragraphs in `body` are split on blank lines.

## Theming

Brand colors live as CSS variables in `src/app/globals.css` (`--brand`, `--brand-dark`,
`--brand-light`). Swap those to restyle the whole site; the palette is green throughout.

## Caching

Content reads use `use cache` with `cacheLife("hours")` and are tagged `site` and
`page:<slug>`. Publish a Wix automation that POSTs to
`/api/revalidate?secret=...&slug=<slug>` to refresh instantly after an edit.
