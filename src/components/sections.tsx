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
          <h1 className="text-3xl font-bold leading-tight text-brand sm:text-4xl">
            {section.heading}
          </h1>
          {section.subheading ? (
            <p className="mt-4 max-w-md text-lg text-muted">
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
                  className="mt-2 w-full rounded-full border border-border bg-background px-5 py-3 outline-none focus:border-brand"
                />
              ) : null}
              {section.ctaLabel ? (
                <button
                  type="submit"
                  className="mt-4 w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-contrast hover:bg-brand-dark"
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
            className="h-auto w-full rounded-2xl object-cover"
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
            className="rounded-xl border border-border bg-background p-6"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.imageAlt ?? ""}
                width={480}
                height={280}
                className="mb-4 h-40 w-full rounded-lg object-cover"
              />
            ) : null}
            <h3 className="text-lg font-semibold">{item.title}</h3>
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
    <section className="bg-brand-light">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {section.heading ? (
            <h2 className="text-2xl font-bold">{section.heading}</h2>
          ) : null}
          {section.body ? (
            <p className="mt-2 text-muted">{section.body}</p>
          ) : null}
        </div>
        {section.ctaLabel ? (
          <Link
            href={section.ctaHref ?? "#"}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-contrast hover:bg-brand-dark"
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
            className={`h-auto w-full rounded-2xl object-cover ${
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
              className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wide text-brand-contrast hover:bg-brand-dark"
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
                className="mb-4 aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <div className="mb-4 aspect-square w-full rounded-xl bg-surface" />
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
                className="mt-1 size-3 shrink-0 rounded-full bg-brand"
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
                className="shrink-0 rounded-full border border-brand px-5 py-2 text-sm font-semibold text-brand hover:bg-brand hover:text-brand-contrast"
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
    default:
      return <RichText section={section} />;
  }
}
