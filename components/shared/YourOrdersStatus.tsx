"use client";

import { useEffect, useState } from "react";
import { getOrdersByTableAction } from "@/app/actions/orders";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UtensilsCrossed, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Received",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  READY: "Ready",
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-violet-100 text-violet-800",
  READY: "bg-emerald-100 text-emerald-800",
};

type Order = Awaited<ReturnType<typeof getOrdersByTableAction>>["orders"][0];

export function YourOrdersStatus({ tableNumber }: { tableNumber: string | null }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tableNumber?.trim()) {
      setOrders([]);
      setLoading(false);
      return;
    }
    let mounted = true;
    async function fetchOrders() {
      const { orders: o } = await getOrdersByTableAction(tableNumber!);
      if (mounted) setOrders(o);
      setLoading(false);
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [tableNumber]);

  if (!tableNumber?.trim()) return null;
  if (loading && orders.length === 0) return null;
  if (orders.length === 0) return null;

  return (
    <Card className="border-[#A00000]/30">
      <CardHeader className="py-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <UtensilsCrossed className="h-4 w-4 text-[#A00000]" />
          Your orders
        </h3>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-lg border bg-muted/30 p-3 text-sm"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs text-muted-foreground">
                {new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded",
                  STATUS_STYLES[order.status] ?? "bg-zinc-100 text-zinc-700"
                )}
              >
                {STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
            <ul className="space-y-0.5">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
