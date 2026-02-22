"use client";

import { useEffect, useState } from "react";
import { getMenuItemsAction } from "@/app/actions/menu";
import { updateMenuItemAction } from "@/app/actions/menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/schemas/menu-item";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = Awaited<ReturnType<typeof getMenuItemsAction>>["items"][0];

export default function StaffMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function load() {
    const { items: next } = await getMenuItemsAction();
    setItems(next);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggle(item: MenuItem) {
    setTogglingId(item.id);
    const result = await updateMenuItemAction({
      id: item.id,
      isAvailable: !item.isAvailable,
    });
    setTogglingId(null);
    if (!result.error) await load();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
      </div>
    );
  }

  const byCategory = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Menu – out of stock</h1>
      <p className="text-muted-foreground text-sm">
        Toggle availability. Items marked out of stock are hidden from customers.
      </p>
      <div className="space-y-6">
        {Object.entries(byCategory).map(([category, categoryItems]) => (
          <Card key={category}>
            <CardHeader>
              <h2 className="text-lg font-semibold">
                {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category}
              </h2>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-lg border p-3",
                    !item.isAvailable && "bg-muted/50 opacity-80"
                  )}
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={item.isAvailable ? "outline" : "default"}
                    onClick={() => handleToggle(item)}
                    disabled={togglingId === item.id}
                  >
                    {togglingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : item.isAvailable ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        In stock
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        Out of stock
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
