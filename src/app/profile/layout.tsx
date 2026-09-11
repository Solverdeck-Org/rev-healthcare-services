import { Suspense } from "react";
import { ProfileTabs } from "@/components/profile-tabs";

export default function ProfileLayout({ children }: LayoutProps<"/profile">) {
  return (
    <>
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <ProfileTabs />
      </Suspense>
      {children}
    </>
  );
}
