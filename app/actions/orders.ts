"use server";

import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export type SendOrderResult = { orderId?: string; error?: string };

export async function sendOrderAction(payload: unknown): Promise<SendOrderResult> {
  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  }
  try {
    const order = await prisma.order.create({
      data: {
        tableNumber: parsed.data.tableNumber,
        customerNotes: parsed.data.customerNotes ?? null,
        status: "PENDING",
        items: {
          create: parsed.data.items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes ?? null,
          })),
        },
      },
      include: { items: true },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { orderId: order.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (process.env.NODE_ENV === "development") {
      console.error("[sendOrderAction]", err);
    }
    return {
      error:
        process.env.NODE_ENV === "development"
          ? `Order failed: ${message}`
          : "Unable to send order. Please try again or contact staff.",
    };
  }
}

export async function getOrdersAction(status?: string) {
  try {
    const orders = await prisma.order.findMany({
      where: status ? { status: status as "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED" } : undefined,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    // Serialize for Client Components: Prisma Decimal is not a plain object
    const serialized = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }));
    return { orders: serialized, error: null };
  } catch {
    return { orders: [], error: null };
  }
}

export async function getOrdersByTableAction(tableNumber: string) {
  if (!tableNumber?.trim()) return { orders: [], error: null };
  try {
    const orders = await prisma.order.findMany({
      where: {
        tableNumber: tableNumber.trim(),
        status: { notIn: ["SERVED", "CANCELLED"] },
      },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    const serialized = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    }));
    return { orders: serialized, error: null };
  } catch {
    return { orders: [], error: null };
  }
}

export async function getOrderByIdAction(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) return { order: null, error: "Order not found" };
    const serialized = {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
      })),
    };
    return { order: serialized, error: null };
  } catch {
    return { order: null, error: "Failed to load order" };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED" },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/staff");
    revalidatePath("/superadmin");
    return { error: null };
  } catch (e) {
    console.error(e);
    return { error: "Failed to update order" };
  }
}
