"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMenuStore } from "@/store";
import { MenuItemCard } from "./MenuItemCard";
import type { Category } from "@/lib/schemas";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type MenuListProps = {
  category: Category;
  title: string;
};

export function MenuList({ category, title }: MenuListProps) {
  const getByCategory = useMenuStore((s) => s.getByCategory);
  const items = getByCategory(category);
  const [isOpen, setIsOpen] = useState(true);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-6 border-b pb-2 w-full flex justify-between items-center pr-8">
        <h2 className="text-2xl font-semibold">
          {title}
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl font-semibold hover:opacity-80 transition-opacity text-left"
        >
          <ChevronDown
            className={cn(
              "h-8 w-8 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
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
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
