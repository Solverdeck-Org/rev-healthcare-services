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
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-16 lg:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight text-brand sm:text-5xl">
            {section.heading}
          </h1>
          {section.subheading ? (
            <p className="mt-4 max-w-md text-xl text-muted">
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
    <section className="mx-auto max-w-3xl px-4 py-14">
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
    default:
      return <RichText section={section} />;
  }
}
