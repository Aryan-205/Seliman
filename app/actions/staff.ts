"use server";

import { StaffRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createStaffSchema, updateStaffSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function getStaffAction() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { name: "asc" },
    });
    return { staff, error: null };
  } catch {
    return { staff: [], error: "Failed to load staff" };
  }
}

export async function createStaffAction(payload: unknown): Promise<{ error?: string }> {
  const parsed = createStaffSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  }
  try {
    await prisma.staff.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: (parsed.data.role as StaffRole) ?? "STAFF",
      },
    });
    revalidatePath("/superadmin/staff");
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: message };
  }
}

export async function updateStaffAction(payload: unknown): Promise<{ error?: string }> {
  const parsed = updateStaffSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: parsed.error.errors.map((e) => e.message).join(", ") };
  }
  const { id, ...data } = parsed.data;
  try {
    await prisma.staff.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.role !== undefined && { role: data.role as StaffRole }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    revalidatePath("/superadmin/staff");
    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: message };
  }
}
