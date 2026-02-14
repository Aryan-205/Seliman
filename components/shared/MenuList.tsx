"use client";

import { motion } from "framer-motion";
import { useMenuStore } from "@/store";
import { MenuItemCard } from "./MenuItemCard";
import type { Category } from "@/lib/schemas";

type MenuListProps = {
  category: Category;
  title: string;
};

export function MenuList({ category, title }: MenuListProps) {
  const getByCategory = useMenuStore((s) => s.getByCategory);
  const items = getByCategory(category);

  if (items.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-6 border-b pb-2">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <MenuItemCard item={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
