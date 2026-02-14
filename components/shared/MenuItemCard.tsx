"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/store";
import { formatCurrency } from "@/lib/utils";
import type { MenuItemDisplay } from "@/store";

type MenuItemCardProps = {
  item: MenuItemDisplay;
};

export function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      {item.imageUrl ? (
        <div className="aspect-video w-full bg-muted relative overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
          No image
        </div>
      )}
      <CardContent className="p-4">
        <h3 className="font-semibold">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="font-semibold text-primary">{formatCurrency(item.price)}</span>
        <Button
          size="sm"
          onClick={() =>
            addItem({
              menuItemId: item.id,
              name: item.name,
              price: item.price,
            })
          }
          disabled={!item.isAvailable}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
