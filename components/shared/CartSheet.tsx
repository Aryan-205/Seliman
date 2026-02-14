"use client";

import { useCartStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function CartSheet() {
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.getSubtotal());
  const itemCount = useCartStore((s) => s.getItemCount());

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-card p-4 shadow-lg md:bottom-4 md:left-auto md:right-4 md:max-w-sm md:rounded-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">{itemCount} item(s)</p>
          <p className="text-lg font-semibold text-primary">{formatCurrency(subtotal)}</p>
        </div>
        <Button asChild>
          <Link href="/cart">
            <ShoppingBag className="h-4 w-4" />
            View cart
          </Link>
        </Button>
      </div>
    </div>
  );
}
