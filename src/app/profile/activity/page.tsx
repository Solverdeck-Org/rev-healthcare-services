import type { Metadata } from "next";
import { Suspense } from "react";
import { MemberGate, MemberGateFallback } from "@/components/member-gate";

export const metadata: Metadata = { title: "Activity" };

function Body() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold">Activity</h1>
      <p className="mt-2 text-muted">
        A record of what you have done on the site.
      </p>

      <div className="mt-8 rounded-md border border-border bg-surface p-8 text-center">
        <p className="font-semibold">No activity yet</p>
        <p className="mt-1 text-sm text-muted">
          Your requests and messages will be listed here.
        </p>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <Suspense fallback={<MemberGateFallback />}>
      <MemberGate>
        <Body />
      </MemberGate>
    </Suspense>
  );
}
