"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getOrdersAction, updateOrderStatusAction } from "@/app/actions/orders";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type OrderItem = {
  id: string;
  name: string;
  price: { toNumber?: () => number } | number;
  quantity: number;
  notes?: string | null;
};

type Order = {
  id: string;
  tableNumber: string;
  status: string;
  customerNotes?: string | null;
  createdAt: Date;
  items: OrderItem[];
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PREPARING", "READY", "SERVED", "CANCELLED"] as const;

export function OrderFeed({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);

  useEffect(() => {
    const interval = setInterval(async () => {
      const { orders: next } = await getOrdersAction();
      setOrders(next);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(orderId: string, status: string) {
    await updateOrderStatusAction(orderId, status);
    const { orders: next } = await getOrdersAction();
    setOrders(next);
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No orders yet. Orders from the customer cart will appear here.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <p className="font-semibold">Table {order.tableNumber}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()} · {order.status}
                </p>
              </div>
              <select
                className="rounded-md border bg-background px-3 py-1.5 text-sm"
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul>
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                      {item.notes && (
                        <span className="text-muted-foreground"> ({item.notes})</span>
                      )}
                    </span>
                    <span>
                      {formatCurrency(Number(item.price))}
                    </span>
                  </li>
                ))}
              </ul>
              {order.customerNotes && (
                <p className="text-sm text-muted-foreground pt-2 border-t">
                  Note: {order.customerNotes}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
