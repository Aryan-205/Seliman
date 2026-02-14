"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  createMenuItemAction,
  updateMenuItemAction,
  deleteMenuItemAction,
} from "@/app/actions/menu";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS, type Category } from "@/lib/schemas";

type MenuItemRow = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  sortOrder: number;
};

export function MenuManagement({ initialItems }: { initialItems: MenuItemRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      name: (form.querySelector('[name="name"]') as HTMLInputElement).value,
      description: (form.querySelector('[name="description"]') as HTMLInputElement).value || undefined,
      price: Number((form.querySelector('[name="price"]') as HTMLInputElement).value),
      category: (form.querySelector('[name="category"]') as HTMLSelectElement).value as Category,
      isAvailable: true,
    };
    const result = await createMenuItemAction(formData);
    if (!result.error) {
      setCreating(false);
      router.refresh();
      const { items: next } = await import("@/app/actions/menu").then((m) => m.getMenuItemsAction());
      setItems(next);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      id,
      name: (form.querySelector('[name="name"]') as HTMLInputElement).value,
      description: (form.querySelector('[name="description"]') as HTMLInputElement).value || undefined,
      price: Number((form.querySelector('[name="price"]') as HTMLInputElement).value),
      category: (form.querySelector('[name="category"]') as HTMLSelectElement).value as Category,
    };
    await updateMenuItemAction(formData);
    setEditingId(null);
    router.refresh();
    const { items: next } = await import("@/app/actions/menu").then((m) => m.getMenuItemsAction());
    setItems(next);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    await deleteMenuItemAction(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {!creating ? (
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add item
        </Button>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <input name="name" placeholder="Name" required className="rounded-md border px-3 py-2" />
              <input name="description" placeholder="Description" className="rounded-md border px-3 py-2" />
              <input name="price" type="number" step="0.01" min="0" placeholder="Price" required className="rounded-md border px-3 py-2" />
              <select name="category" className="rounded-md border px-3 py-2">
                {(["STARTER", "MAIN", "DRINK", "DESSERT", "SIDE"] as const).map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="outline" onClick={() => setCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="space-y-2">
        {items.map((item) => (
          <motion.div key={item.id} layout>
            <Card>
              <CardContent className="py-4">
                {editingId === item.id ? (
                  <form onSubmit={(e) => handleUpdate(e, item.id)} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
                    <input name="name" defaultValue={item.name} placeholder="Name" required className="rounded-md border px-3 py-2" />
                    <input name="description" defaultValue={item.description ?? ""} placeholder="Description" className="rounded-md border px-3 py-2" />
                    <input name="price" type="number" step="0.01" min="0" defaultValue={item.price} required className="rounded-md border px-3 py-2" />
                    <select name="category" defaultValue={item.category} className="rounded-md border px-3 py-2">
                      {(["STARTER", "MAIN", "DRINK", "DESSERT", "SIDE"] as const).map((c) => (
                        <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <Button type="submit">Save</Button>
                      <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {CATEGORY_LABELS[item.category as Category]} · {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingId(item.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
