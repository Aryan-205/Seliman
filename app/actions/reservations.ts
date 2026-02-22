"use server";

import { ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createReservationSchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

export async function createReservationAction(payload: unknown): Promise<{
  reservationId?: string;
  error?: string;
}> {
  const parsed = createReservationSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: parsed.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const date = new Date(parsed.data.date);
    if (isNaN(date.getTime())) {
      return { error: "Invalid date" };
    }

    const reservation = await prisma.reservation.create({
      data: {
        date,
        time: parsed.data.time,
        partySize: parsed.data.partySize,
        name: parsed.data.name,
        email: parsed.data.email,
        status: ReservationStatus.PENDING,
      },
    });

    revalidatePath("/staff/queue");
    return { reservationId: reservation.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      error:
        process.env.NODE_ENV === "development"
          ? `Reservation failed: ${message}`
          : "Unable to create reservation. Please try again.",
    };
  }
}

export async function getReservationsAction(filters?: {
  fromDate?: Date;
  toDate?: Date;
  status?: ReservationStatus;
}) {
  try {
    const where: { date?: { gte?: Date; lte?: Date }; status?: ReservationStatus } = {};
    if (filters?.fromDate) where.date = { ...where.date, gte: filters.fromDate };
    if (filters?.toDate) where.date = { ...where.date, lte: filters.toDate };
    if (filters?.status) where.status = filters.status;

    const reservations = await prisma.reservation.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return {
      reservations: reservations.map((r) => ({
        ...r,
        date: r.date.toISOString().slice(0, 10),
      })),
      error: null,
    };
  } catch {
    return { reservations: [], error: "Failed to load reservations" };
  }
}

export async function updateReservationStatusAction(
  id: string,
  status: ReservationStatus
): Promise<{ error?: string }> {
  try {
    await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/staff/queue");
    return {};
  } catch {
    return { error: "Failed to update" };
  }
}
