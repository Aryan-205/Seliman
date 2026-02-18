"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import { sendOrderAction } from "@/app/actions/orders";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const tableNumber = useCartStore((s) => s.tableNumber);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const [customerNotes, setCustomerNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const table = tableNumber || "";
  const canSend = items.length > 0 && table.trim().length > 0;

  async function handleSendOrder() {
    if (!canSend) return;
    setLoading(true);
    setMessage(null);
    const result = await sendOrderAction({
      tableNumber: table,
      items: items.map((i) => ({
        menuItemId: i.menuItemId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        notes: i.notes,
      })),
      customerNotes: customerNotes || undefined,
    });
    setLoading(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Order sent! We'll bring it to your table soon." });
      clearCart();
      setCustomerNotes("");
    }
  }

  if (items.length === 0 && !message) {
    return (
      <div className="w-full px-4 py-16 text-center h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add items from the menu to get started.</p>
        <Button asChild>
          <Link href="/menu">View Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 max-w-2xl mx-auto h-screen pt-24">
      <h1 className="text-2xl font-bold mb-6">Your Order</h1>
      {!tableNumber && (
        <p className="text-amber-600 dark:text-amber-500 text-sm mb-4">
          Visit a table URL (e.g. /table/5) to set your table number, or enter it below.
        </p>
      )}
      <div className="space-y-4 mb-6">
        <label className="text-sm font-medium">Table number</label>
        <Input
          placeholder="e.g. 5"
          value={table}
          onChange={(e) => useCartStore.getState().setTableNumber(e.target.value || null)}
          className="max-w-[120px]"
        />
      </div>
      <ul className="space-y-4 mb-8">
        {items.map((item) => (
          <motion.li
            key={`${item.menuItemId}-${item.notes ?? ""}`}
            layout
            className="flex items-center justify-between gap-4 rounded-lg border p-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(item.price)} × {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.menuItemId)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.li>
        ))}
      </ul>
      <div className="space-y-4 mb-6">
        <label className="text-sm font-medium">Notes for the kitchen (optional)</label>
        <Input
          placeholder="Allergies, preferences..."
          value={customerNotes}
          onChange={(e) => setCustomerNotes(e.target.value)}
          className="resize-none"
        />
      </div>
      <div className="flex items-center justify-between text-lg font-semibold mb-6">
        <span>Subtotal</span>
        <span className="text-primary">{formatCurrency(getSubtotal())}</span>
      </div>
      {message && (
        <p
          className={`mb-4 text-sm ${message.type === "success" ? "text-green-600 dark:text-green-500" : "text-destructive"}`}
        >
          {message.text}
        </p>
      )}
      <div className="flex gap-4">
        <Button
          className="flex-1"
          onClick={handleSendOrder}
          disabled={!canSend || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {loading ? "Sending…" : "Send Order"}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/menu">Add more</Link>
        </Button>
      </div>
    </div>
  );
}
