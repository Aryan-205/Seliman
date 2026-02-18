"use client";


import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrdersAction, updateOrderStatusAction } from "@/app/actions/orders";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Clock, Utensils, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderItem = {
  id: string;
  name: string;
  price: number;
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

const STATUS_STYLES: Record<(typeof STATUS_OPTIONS)[number], string> = {
  PENDING: "bg-amber-50 border-amber-500 text-amber-800 focus:ring-amber-500",
  CONFIRMED: "bg-blue-50 border-blue-500 text-blue-800 focus:ring-blue-500",
  PREPARING: "bg-violet-50 border-violet-500 text-violet-800 focus:ring-violet-500",
  READY: "bg-emerald-50 border-emerald-500 text-emerald-800 focus:ring-emerald-500",
  SERVED: "bg-zinc-100 border-zinc-400 text-zinc-700 focus:ring-zinc-400",
  CANCELLED: "bg-red-50 border-red-500 text-red-800 focus:ring-red-500",
};

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY"] as const;

export function OrderFeed({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status as (typeof ACTIVE_STATUSES)[number]));

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

  async function handleClearOrder(orderId: string) {
    await updateOrderStatusAction(orderId, "SERVED");
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }

  if (activeOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl border-zinc-200">
        <Utensils className="w-12 h-12 text-zinc-300 mb-4" />
        <p className="text-zinc-500 font-medium">No active orders right now.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      <AnimatePresence mode="popLayout">
        {activeOrders.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Card className="overflow-hidden border-l-4 border-l-red-600 shadow-lg bg-white border-zinc-200">
              <div className="flex flex-col sm:flex-row">
                {/* Side Header: Table Number */}
                <div className="bg-black text-white p-4 flex flex-col justify-center items-center sm:w-32">
                  <span className="text-xs uppercase tracking-widest text-zinc-400">Table</span>
                  <span className="text-4xl font-black">{order.tableNumber}</span>
                </div>

                <div className="flex-1">
                  {/* Status Bar */}
                  <div className="px-6 py-3 border-b flex items-center justify-between gap-2 bg-zinc-50">
                    <div className="flex items-center gap-2 text-zinc-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-mono">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        className={`text-xs font-semibold uppercase tracking-tighter border-2 px-3 py-1.5 rounded outline-none focus:ring-2 ${STATUS_STYLES[order.status as (typeof STATUS_OPTIONS)[number]] ?? "bg-white border-zinc-300 text-zinc-800 focus:ring-zinc-400"}`}
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-fit p-2 border-2 border-emerald-600 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 shrink-0"
                        onClick={() => handleClearOrder(order.id)}
                        title="Mark completed and remove from list"
                      >
                        <X className="h-4 w-4" /> Clear
                      </Button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded bg-red-100 text-red-700 text-xs font-bold">
                              {item.quantity}
                            </span>
                            <div>
                              <p className="font-bold text-zinc-900 leading-tight">{item.name}</p>
                              {item.notes && (
                                <p className="text-xs text-red-500 italic mt-0.5">"{item.notes}"</p>
                              )}
                            </div>
                          </div>
                          <span className="font-mono text-sm text-zinc-600">
                            {formatCurrency(Number(item.price))}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {order.customerNotes && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg flex gap-2 items-start">
                        <MessageSquare className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-red-800 leading-relaxed">
                          <span className="font-bold uppercase tracking-tighter mr-1">Kitchen Note:</span>
                          {order.customerNotes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}