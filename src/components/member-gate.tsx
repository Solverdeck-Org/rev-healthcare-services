import { redirect } from "next/navigation";
import { getMember } from "@/lib/member";

/**
 * Guards a member-only page. Reads cookies, so every use must sit inside a
 * <Suspense> boundary — Cache Components treats cookies as runtime data.
 */
export async function MemberGate({ children }: { children: React.ReactNode }) {
  const result = await getMember();
  if (result.status === "signed-out") redirect("/login");
  return <>{children}</>;
}

export function MemberGateFallback() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="h-6 w-40 animate-pulse rounded-md bg-surface" />
      <div className="mt-6 h-32 animate-pulse rounded-md bg-surface" />
    </div>
  );
}
