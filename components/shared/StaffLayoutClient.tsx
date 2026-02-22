"use client";

import { usePathname } from "next/navigation";
import { StaffNav } from "@/components/shared/StaffNav";

export function StaffLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/staff/login";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!isLogin && <StaffNav />}
      <main className="flex-1 w-full px-4 py-6">{children}</main>
    </div>
  );
}
