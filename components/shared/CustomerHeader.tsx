"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, useQueueStore } from "@/store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { createWaiterRequestAction } from "@/app/actions/waiter-requests";

const nav = [
  { href: "/", label: "Home" },
  { href: "/wait", label: "Join queue" },
  { href: "/menu", label: "Menu" },
  { href: "/booking", label: "Booking" },
  { href: "/location", label: "Location" },
];

export function CustomerHeader() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.getItemCount());
  const tableNumber = useCartStore((s) => s.tableNumber);
  const assignedTableId = useQueueStore((s) => s.assignedTableId);
  const displayTable = tableNumber?.trim() || assignedTableId || null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [waiterSending, setWaiterSending] = useState(false);
  const [waiterMessage, setWaiterMessage] = useState<"success" | "error" | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function handleRequestWaiter() {
    if (!tableNumber?.trim()) return;
    setWaiterSending(true);
    setWaiterMessage(null);
    const { error } = await createWaiterRequestAction(tableNumber);
    setWaiterSending(false);
    setWaiterMessage(error ? "error" : "success");
    if (!error) setTimeout(() => setWaiterMessage(null), 3000);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/10">
      <div className="w-full flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-2xl text-[#A00000]">Aryan</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xl font-medium transition-colors hover:text-[#A00000]",
                pathname === item.href ? "text-[#c21919]" : "text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2" ref={dropdownRef}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-expanded={dropdownOpen}
            aria-label="Open menu"
          >
            {dropdownOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 md:hidden border-b bg-background shadow-lg py-2 px-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDropdownOpen(false)}
                  className={cn(
                    "block py-3 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          {displayTable && (
            <Link
              href={`/table/${displayTable}`}
              className="text-sm font-medium px-2 py-1 rounded bg-muted hover:bg-muted/80"
            >
              Table {displayTable}
            </Link>
          )}
          {tableNumber?.trim() && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRequestWaiter}
                disabled={waiterSending}
                title="Request waiter"
                className={waiterMessage === "success" ? "text-green-600" : waiterMessage === "error" ? "text-destructive" : ""}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {waiterMessage === "success" && (
                <span className="text-xs text-green-600 dark:text-green-500 whitespace-nowrap">Request sent!</span>
              )}
              {waiterMessage === "error" && (
                <span className="text-xs text-destructive whitespace-nowrap">Try again</span>
              )}
            </div>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-8 w-8" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
