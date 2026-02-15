"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWaiterRequestAction(tableNumber: string) {
  if (!tableNumber?.trim()) return { error: "Table number is required" };
  try {
    await prisma.waiterRequest.create({
      data: { tableNumber: tableNumber.trim(), status: "PENDING" },
    });
    revalidatePath("/admin");
    return { error: null };
  } catch {
    return { error: "Unable to send request. Please try again." };
  }
}

export async function getWaiterRequestsAction() {
  try {
    const requests = await prisma.waiterRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
    });
    return { requests, error: null };
  } catch {
    return { requests: [], error: null };
  }
}

export async function acknowledgeWaiterRequestAction(id: string) {
  try {
    await prisma.waiterRequest.update({
      where: { id },
      data: { status: "ACKNOWLEDGED" },
    });
    revalidatePath("/admin");
    return { error: null };
  } catch {
    return { error: "Failed to update" };
  }
}
