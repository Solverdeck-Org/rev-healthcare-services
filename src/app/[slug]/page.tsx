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
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-24" />}>
      <PageBody params={params} />
    </Suspense>
  );
}
