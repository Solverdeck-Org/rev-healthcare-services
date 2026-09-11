import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberGate, MemberGateFallback } from "@/components/member-gate";

export const metadata: Metadata = { title: "News feed" };

function Body() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">News Feed</h1>
      <p className="mt-2 text-muted">
        Updates from Rev Healthcare will appear here.
      </p>

      <div className="mt-8 rounded-md border border-border bg-surface p-8 text-center">
        <p className="font-semibold">Nothing here yet</p>
        <p className="mt-1 text-sm text-muted">
          You have no updates at the moment. Check back soon.
        </p>
      </div>
    </div>
  );
}

export default function NewsFeedPage() {
  return (
    <Suspense fallback={<MemberGateFallback />}>
      <MemberGate>
        <Body />
      </MemberGate>
    </Suspense>
  );
}
