"use client";

import { usePathname } from "next/navigation";
import { SuperadminNav } from "@/components/shared/SuperadminNav";

export function SuperadminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/superadmin/login";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isLogin && <SuperadminNav />}
      <main className="flex-1 w-full px-4 py-6">{children}</main>
    </div>
  );
}
