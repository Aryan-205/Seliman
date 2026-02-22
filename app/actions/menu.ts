"use server";

import { prisma } from "@/lib/prisma";
import { menuItemCreateSchema, menuItemUpdateSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import { MOCK_MENU_ITEMS } from "@/lib/mock-menu";

export async function getMenuItemsAction() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
    if (items.length > 0) {
      return {
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description,
          price: Number(i.price),
          category: i.category,
          imageUrl: i.imageUrl,
          isAvailable: i.isAvailable,
          sortOrder: i.sortOrder,
        })),
        error: null,
      };
    }
  } catch {
    // DB not ready or not configured
  }
  return { items: MOCK_MENU_ITEMS, error: null };
}

export async function createMenuItemAction(formData: unknown) {
  const parsed = menuItemCreateSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  try {
    await prisma.menuItem.create({
      data: {
        ...parsed.data,
        price: parsed.data.price,
        imageUrl: parsed.data.imageUrl || null,
      },
    });
    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/staff/menu");
    revalidatePath("/superadmin/menu");
    return { error: null };
  } catch (e) {
    console.error(e);
    return { error: { _form: ["Failed to create item"] } };
  }
}

export async function updateMenuItemAction(formData: unknown) {
  const parsed = menuItemUpdateSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { id, ...data } = parsed.data;
  try {
    await prisma.menuItem.update({
      where: { id },
      data: {
        ...data,
        ...(data.price !== undefined && { price: data.price }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl || null }),
      },
    });
    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/staff/menu");
    revalidatePath("/superadmin/menu");
    return { error: null };
  } catch (e) {
    console.error(e);
    return { error: { _form: ["Failed to update item"] } };
  }
}

export async function deleteMenuItemAction(id: string) {
  try {
    await prisma.menuItem.delete({ where: { id } });
    revalidatePath("/menu");
    revalidatePath("/admin/menu");
    revalidatePath("/staff/menu");
    revalidatePath("/superadmin/menu");
    return { error: null };
  } catch (e) {
    console.error(e);
    return { error: "Failed to delete item" };
  }
}
