import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SectionRenderer } from "@/components/sections";
import { getPage } from "@/lib/content";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return {
    title: page?.title,
    description: page?.seoDescription,
  };
}

/** Shown while the page's content is fetched from Wix. */
function PageSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="h-10 w-3/4 max-w-xl rounded-md bg-border sm:h-14" />
          <div className="mt-4 h-5 w-1/2 max-w-md rounded-md bg-border" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="h-7 w-64 rounded-md bg-border" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-40 rounded-md bg-surface" />
          <div className="h-40 rounded-md bg-surface" />
          <div className="h-40 rounded-md bg-surface" />
        </div>
      </div>
    </div>
  );
}

async function PageBody({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <>
      {page.sections.map((section) => (
        <SectionRenderer key={section.key} section={section} />
      ))}
    </>
  );
}

export default function CmsPage({ params }: PageProps<"/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageBody params={params} />
    </Suspense>
  );
}
