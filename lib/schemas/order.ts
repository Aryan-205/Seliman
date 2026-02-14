import { z } from "zod";

export const orderItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item ID is required"),
  name: z.string().min(1, "Item name is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

export const orderSchema = z.object({
  tableNumber: z.string().min(1, "Table number is required"),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  customerNotes: z.string().max(500).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "SERVED", "CANCELLED"]).optional(),
});

export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;

export const orderUpdateSchema = orderSchema.partial().extend({
  id: z.string().min(1),
});

export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
