import { z } from "zod";

export const categoryEnum = z.enum(["STARTER", "MAIN", "DRINK", "DESSERT", "SIDE"]);

export const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().max(500).optional(),
  price: z.number().positive("Price must be positive"),
  category: categoryEnum,
  imageUrl: z.string().url().optional().or(z.literal("")),
  isAvailable: z.boolean().default(true),
  sortOrder: z.number().int().min(0).optional(),
});

export const menuItemCreateSchema = menuItemSchema;

export const menuItemUpdateSchema = menuItemSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type MenuItemCreateInput = z.infer<typeof menuItemCreateSchema>;
export type MenuItemUpdateInput = z.infer<typeof menuItemUpdateSchema>;
export type Category = z.infer<typeof categoryEnum>;

export const CATEGORY_LABELS: Record<Category, string> = {
  STARTER: "Starters",
  MAIN: "Mains",
  DRINK: "Drinks",
  DESSERT: "Desserts",
  SIDE: "Sides",
};
