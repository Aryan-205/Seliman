import Link from "next/link";
import { LayoutDashboard, UtensilsCrossed, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Orders", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/qr", label: "QR Codes", icon: QrCode },
];

export function AdminNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-14 items-center px-4">
        <Link href="/admin" className="font-semibold text-primary mr-8">
          Admin
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
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
