"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { MenuList } from "@/components/shared/MenuList";
import { getMenuItemsAction } from "@/app/actions/menu";
import { useMenuStore } from "@/store";
import { CATEGORY_LABELS, type Category } from "@/lib/schemas";

const CATEGORY_ORDER: Category[] = ["STARTER", "MAIN", "DRINK", "DESSERT", "SIDE"];

export default function MenuPage() {
  const setItems = useMenuStore((s) => s.setItems);

  useEffect(() => {
    getMenuItemsAction().then((data) => {
      if (data?.items) {
        setItems(
          data.items.map((i) => ({
            id: i.id,
            name: i.name,
            description: i.description,
            price: Number(i.price),
            category: i.category,
            imageUrl: i.imageUrl,
            isAvailable: i.isAvailable,
            sortOrder: i.sortOrder,
          }))
        );
      }
    });
  }, [setItems]);

  return (
    <div className="w-full px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold tracking-tight">Our Menu</h1>
        <p className="mt-2 text-muted-foreground">
          Tap any item to add it to your order.
        </p>
      </motion.div>
      <div className="space-y-16">
        {CATEGORY_ORDER.map((category) => (
          <MenuList
            key={category}
            category={category}
            title={CATEGORY_LABELS[category]}
          />
        ))}
      </div>
    </div>
  );
}
