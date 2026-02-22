"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, Users, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/superadmin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/superadmin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/superadmin/staff", label: "Staff", icon: Users },
  { href: "/superadmin/qr", label: "QR codes", icon: QrCode },
];

export function SuperadminNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full flex h-14 items-center px-4">
        <Link href="/superadmin" className="font-semibold text-[#A00000] mr-8">
          Superadmin
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
