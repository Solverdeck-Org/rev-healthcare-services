import Image from "next/image";
import Link from "next/link";
import type { Section } from "@/lib/content";

function Heading({ section }: { section: Section }) {
  return (
    <>
      {section.eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-muted">
          {section.eyebrow}
        </p>
      ) : null}
      {section.heading ? (
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          {section.heading}
        </h2>
      ) : null}
      {section.subheading ? (
        <p className="mt-2 text-muted">{section.subheading}</p>
      ) : null}
    </>
  );
}

function Hero({ section }: { section: Section }) {
  return (
    <section className="bg-surface">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 ${
          section.imageUrl ? "lg:grid-cols-2" : ""
        }`}
      >
        <div>
          <h1 className="text-3xl font-bold leading-tight text-brand sm:text-4xl lg:text-5xl xl:text-6xl">
            {section.heading}
          </h1>
          {section.subheading ? (
            <p className="mt-4 max-w-lg text-lg text-muted sm:text-xl lg:text-2xl">
              {section.subheading}
            </p>
          ) : null}

          {section.inputPlaceholder || section.ctaLabel ? (
            <form action={section.ctaHref ?? "#"} className="mt-8 max-w-md">
              {section.inputLabel ? (
                <label
                  htmlFor="hero-input"
                  className="block text-sm font-medium"
                >
                  {section.inputLabel}
                </label>
              ) : null}
              {section.inputPlaceholder ? (
                <input
                  id="hero-input"
                  name="q"
                  placeholder={section.inputPlaceholder}
                  className="mt-2 w-full rounded-md border border-border bg-background px-4 py-3 outline-none focus:border-brand"
                />
              ) : null}
              {section.ctaLabel ? (
                <button
                  type="submit"
                  className="mt-4 w-full rounded-md bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-contrast hover:bg-brand-dark"
                >
                  {section.ctaLabel}
                </button>
              ) : null}
            </form>
          ) : null}
        </div>

        {section.imageUrl ? (
          <Image
            src={section.imageUrl}
            alt={section.imageAlt ?? ""}
            width={720}
            height={560}
            className="h-auto w-full rounded-md object-cover"
            priority
          />
        ) : null}
      </div>
    </section>
  );
}

function Cards({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Heading section={section} />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {section.items.map((item) => (
          <article
            key={item.title}
            className="border border-border bg-background p-6"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.imageAlt ?? ""}
                width={480}
                height={280}
                className="mb-4 h-40 w-full rounded-md object-cover"
              />
            ) : null}
            <h3 className="text-lg font-bold text-brand">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
              >
                Learn more
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function Links({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Heading section={section} />
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item) => (
          <li key={`${item.title}-${item.href}`}>
            <Link
              href={item.href ?? "#"}
              className="text-brand hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function RichText({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Heading section={section} />
      {section.body ? (
        <div className="mt-4 max-w-3xl space-y-4 text-muted">
          {section.body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      ) : null}
      {section.ctaLabel ? (
        <Link
          href={section.ctaHref ?? "#"}
          className="mt-6 inline-block font-semibold text-brand hover:underline"
        >
          {section.ctaLabel}
        </Link>
      ) : null}
    </section>
  );
}

function Cta({ section }: { section: Section }) {
  return (
    <section className="bg-brand text-brand-contrast">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {section.heading ? (
            <h2 className="text-2xl font-bold sm:text-3xl">
              {section.heading}
            </h2>
          ) : null}
          {section.body ? (
            <p className="mt-2 text-brand-contrast/90">{section.body}</p>
          ) : null}
        </div>
        {section.ctaLabel ? (
          <Link
            href={section.ctaHref ?? "#"}
            className="shrink-0 rounded-md bg-background px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand hover:bg-brand-light"
          >
            {section.ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

function SplitImageText({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {section.imageUrl ? (
          <Image
            src={section.imageUrl}
            alt={section.imageAlt ?? ""}
            width={720}
            height={540}
            className={`h-auto w-full rounded-md object-cover ${
              section.imagePosition === "left" ? "" : "lg:order-last"
            }`}
          />
        ) : null}
        <div>
          <Heading section={section} />
          {section.body ? (
            <div className="mt-4 space-y-4 text-muted">
              {section.body.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          ) : null}
          {section.ctaLabel ? (
            <Link
              href={section.ctaHref ?? "#"}
              className="mt-6 inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-contrast hover:bg-brand-dark"
            >
              {section.ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Stats({ section }: { section: Section }) {
  return (
    <section className="bg-brand-light">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <Heading section={section} />
        <dl className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {section.items.map((item) => (
            <div key={item.title}>
              <dt className="text-3xl font-bold text-brand sm:text-4xl">
                {item.title}
              </dt>
              {item.description ? (
                <dd className="mt-1 text-sm text-muted">{item.description}</dd>
              ) : null}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Team({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Heading section={section} />
      <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {section.items.map((item) => (
          <li key={item.title}>
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.imageAlt ?? item.title}
                width={400}
                height={400}
                className="mb-4 aspect-square w-full rounded-md object-cover"
              />
            ) : (
              <div className="mb-4 aspect-square w-full rounded-md bg-surface" />
            )}
            <p className="font-semibold">{item.title}</p>
            {item.subtitle ? (
              <p className="text-sm text-brand">{item.subtitle}</p>
            ) : null}
            {item.description ? (
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeatureList({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Heading section={section} />
      <ul className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {section.items.map((item) => (
          <li key={item.title} className="flex gap-4">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.imageAlt ?? ""}
                width={48}
                height={48}
                className="size-12 shrink-0 object-contain"
              />
            ) : (
              <span
                aria-hidden="true"
                className="mt-1 size-3 shrink-0 rounded-md bg-brand"
              />
            )}
            <div>
              <p className="font-semibold">{item.title}</p>
              {item.description ? (
                <p className="mt-1 text-sm text-muted">{item.description}</p>
              ) : null}
              {item.href ? (
                <Link
                  href={item.href}
                  className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
                >
                  Learn more
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function JobList({ section }: { section: Section }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <Heading section={section} />
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {section.items.map((item) => (
          <li
            key={`${item.title}-${item.subtitle}`}
            className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted">
                {[item.subtitle, item.meta].filter(Boolean).join(" · ")}
              </p>
              {item.description ? (
                <p className="mt-2 max-w-2xl text-sm text-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
            {item.href ? (
              <Link
                href={item.href}
                className="shrink-0 rounded-md border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-brand-contrast"
              >
                Apply
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The reference template's "Home Care" block: a white card floating on a teal
 * band, in three columns — featured article, link list, lead-capture form —
 * with a tag strip along the bottom.
 *
 * Items are routed by `meta`: "related" fills the You may also like box,
 * "option" becomes a care-type checkbox, "tag" becomes a bottom-strip tag, and
 * anything else becomes a link in the middle column.
 */
function FeaturePanel({ section }: { section: Section }) {
  const related = section.items.filter((item) => item.meta === "related");
  const options = section.items.filter((item) => item.meta === "option");
  const tags = section.items.filter((item) => item.meta === "tag");
  const links = section.items.filter(
    (item) => !["related", "option", "tag"].includes(item.meta ?? ""),
  );
  const hasForm = Boolean(section.formHeading || options.length);

  const field =
    "w-full border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted focus:border-brand";

  return (
    <section className="bg-background md:bg-brand">
      <div className="mx-auto max-w-6xl md:px-4 md:py-12">
        <div className="bg-background">
          <div className="px-4 py-8 sm:p-10">
            {section.heading ? (
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {section.heading}
                </h2>
                <span className="h-px flex-1 bg-brand" />
              </div>
            ) : null}

            <div
              className={`mt-8 grid gap-10 ${
                hasForm ? "lg:grid-cols-3" : "lg:grid-cols-2"
              }`}
            >
              <div>
                {section.eyebrow ? (
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    {section.eyebrow}
                  </p>
                ) : null}
                {section.subheading ? (
                  <h3 className="mt-1 text-xl font-bold text-brand">
                    {section.ctaHref ? (
                      <Link href={section.ctaHref} className="hover:underline">
                        {section.subheading}
                      </Link>
                    ) : (
                      section.subheading
                    )}
                  </h3>
                ) : null}
                {section.body ? (
                  <p className="mt-2 text-sm text-muted">{section.body}</p>
                ) : null}

                {related.length ? (
                  <div className="mt-6 border border-border p-4">
                    <p className="text-xs uppercase tracking-widest text-muted">
                      You may also like
                    </p>
                    <ul className="mt-3 space-y-3">
                      {related.map((item) => (
                        <li key={item.title}>
                          <Link
                            href={item.href ?? "#"}
                            className="text-brand hover:underline"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              {links.length ? (
                <div>
                  {section.secondaryHeading ? (
                    <h3 className="text-xl font-bold">
                      {section.secondaryHeading}
                    </h3>
                  ) : null}
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {links.map((item) => (
                      <li key={`${item.title}-${item.href}`}>
                        <Link
                          href={item.href ?? "#"}
                          className="text-brand hover:underline"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hasForm ? (
                <form
                  action={section.ctaHref ?? "#"}
                  className="space-y-3 text-center"
                >
                  {section.formHeading ? (
                    <p className="text-xl font-bold">{section.formHeading}</p>
                  ) : null}

                  {options.length ? (
                    <fieldset className="pt-2 text-left">
                      {section.formQuestion ? (
                        <legend className="pb-2 text-sm font-semibold">
                          {section.formQuestion}
                        </legend>
                      ) : null}
                      {options.map((option) => (
                        <label
                          key={option.title}
                          className="flex items-center gap-2 py-1 text-sm"
                        >
                          <input
                            type="checkbox"
                            name="careType"
                            value={option.title}
                            className="size-4 accent-[var(--brand)]"
                          />
                          {option.title}
                        </label>
                      ))}
                    </fieldset>
                  ) : null}

                  <input
                    name="firstName"
                    placeholder="First Name"
                    className={field}
                  />
                  <input
                    name="lastName"
                    placeholder="Last Name"
                    className={field}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="sample@email.com"
                    className={field}
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="(XXX) XXX-XXXX"
                    className={field}
                  />
                  <input
                    name="zip"
                    placeholder="Enter ZIP code"
                    className={field}
                  />

                  {section.formDisclaimer ? (
                    <p className="pt-1 text-left text-[11px] leading-snug text-muted">
                      {section.formDisclaimer}
                    </p>
                  ) : null}

                  {section.formSubmitLabel ? (
                    <button
                      type="submit"
                      className="w-full bg-brand px-4 py-3 text-sm font-semibold uppercase tracking-wide text-brand-contrast hover:bg-brand-dark"
                    >
                      {section.formSubmitLabel}
                    </button>
                  ) : null}
                </form>
              ) : null}
            </div>
          </div>

          {tags.length ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border bg-brand-light px-4 py-3 text-sm text-muted sm:px-10">
              {tags.map((tag, index) => (
                <span key={tag.title} className="flex items-center gap-3">
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-border">
                      |
                    </span>
                  ) : null}
                  {tag.href ? (
                    <Link href={tag.href} className="hover:text-brand">
                      {tag.title}
                    </Link>
                  ) : (
                    tag.title
                  )}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/**
 * The reference template's topic grid: white cards on a teal band, each with a
 * featured article, a "You may also like" box, a footer link and a tag strip.
 *
 * One card per item with `meta: "card"`. Its `group` value ties the card's
 * "related" and "tag" items to it.
 */
function ArticleGrid({ section }: { section: Section }) {
  const cards = section.items.filter((item) => item.meta === "card");
  const forGroup = (meta: string, group?: string) =>
    section.items.filter(
      (item) => item.meta === meta && item.group === group && group,
    );

  return (
    <section className="bg-background md:bg-brand">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        {section.heading ? (
          <h2 className="mb-8 text-2xl font-bold sm:text-3xl md:text-brand-contrast">
            {section.heading}
          </h2>
        ) : null}

        <div className="grid gap-0 divide-y divide-border md:grid-cols-2 md:gap-6 md:divide-y-0 lg:grid-cols-3">
          {cards.map((card) => {
            const related = forGroup("related", card.group);
            const tags = forGroup("tag", card.group);

            return (
              <article
                key={card.group ?? card.title}
                className="flex flex-col bg-background"
              >
                <div className="flex flex-1 flex-col py-6 md:p-6">
                  <h3 className="text-2xl font-bold">{card.title}</h3>

                  {card.subtitle ? (
                    <>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted">
                        Featured Article
                      </p>
                      <p className="mt-1 text-lg font-bold text-brand">
                        {card.href ? (
                          <Link href={card.href} className="hover:underline">
                            {card.subtitle}
                          </Link>
                        ) : (
                          card.subtitle
                        )}
                      </p>
                    </>
                  ) : null}

                  {card.description ? (
                    <p className="mt-2 text-sm text-muted">
                      {card.description}
                    </p>
                  ) : null}

                  {related.length ? (
                    <div className="mt-6 border border-border p-4">
                      <p className="text-xs uppercase tracking-widest text-muted">
                        You may also like
                      </p>
                      <ul className="mt-3 space-y-3">
                        {related.map((item) => (
                          <li key={item.title}>
                            <Link
                              href={item.href ?? "#"}
                              className="text-brand hover:underline"
                            >
                              {item.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {card.ctaLabel ? (
                    <Link
                      href={card.ctaHref ?? "#"}
                      className="mt-6 inline-block font-semibold text-brand hover:underline"
                    >
                      {card.ctaLabel} ›
                    </Link>
                  ) : null}
                </div>

                {tags.length ? (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 bg-brand-light px-4 py-3 text-xs text-muted md:px-6">
                    {tags.map((tag, index) => (
                      <span key={tag.title} className="flex items-center gap-2">
                        {index > 0 ? (
                          <span aria-hidden="true" className="text-border">
                            |
                          </span>
                        ) : null}
                        {tag.title}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SectionRenderer({ section }: { section: Section }) {
  switch (section.type) {
    case "hero":
      return <Hero section={section} />;
    case "cards":
      return <Cards section={section} />;
    case "links":
      return <Links section={section} />;
    case "cta":
      return <Cta section={section} />;
    case "splitImageText":
      return <SplitImageText section={section} />;
    case "stats":
      return <Stats section={section} />;
    case "team":
      return <Team section={section} />;
    case "featureList":
      return <FeatureList section={section} />;
    case "jobList":
      return <JobList section={section} />;
    case "featurePanel":
      return <FeaturePanel section={section} />;
    case "articleGrid":
      return <ArticleGrid section={section} />;
    default:
      return <RichText section={section} />;
  }
}
