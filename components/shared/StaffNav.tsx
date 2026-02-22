"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LayoutGrid, UtensilsCrossed, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { href: "/staff/floor", label: "Floor plan", icon: LayoutGrid },
  { href: "/staff/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/staff/queue", label: "Queue & reservations", icon: ListOrdered },
];

export function StaffNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full flex h-14 items-center px-4">
        <Link href="/staff" className="font-semibold text-[#A00000] mr-8">
          Staff
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
                pathname === link.href ? "text-[#A00000]" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
