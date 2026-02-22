"use server";

import { prisma } from "@/lib/prisma";
import { QueueEntryStatus, ReservationStatus } from "@prisma/client";

export async function getDashboardStatsAction() {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      ordersToday,
      revenueResult,
      queueWaitingCount,
      reservationsTodayCount,
      activeOrdersCount,
    ] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: startOfToday }, status: { not: "CANCELLED" } },
      }),
      prisma.order.findMany({
        where: {
          createdAt: { gte: startOfToday },
          status: { notIn: ["CANCELLED"] },
        },
        include: { items: true },
      }),
      prisma.queueEntry.count({
        where: { status: QueueEntryStatus.WAITING },
      }),
      prisma.reservation.count({
        where: {
          date: { gte: startOfToday },
          status: { not: ReservationStatus.CANCELLED },
        },
      }),
      prisma.order.count({
        where: {
          status: { in: ["PENDING", "CONFIRMED", "PREPARING", "READY"] },
        },
      }),
    ]);

    const revenue =
      revenueResult?.reduce(
        (sum, order) =>
          sum +
          order.items.reduce(
            (s, i) => s + Number(i.price) * i.quantity,
            0
          ),
        0
      ) ?? 0;

    return {
      ordersToday,
      revenue,
      queueWaitingCount,
      reservationsTodayCount,
      activeOrdersCount,
      error: null,
    };
  } catch {
    return {
      ordersToday: 0,
      revenue: 0,
      queueWaitingCount: 0,
      reservationsTodayCount: 0,
      activeOrdersCount: 0,
      error: "Failed to load stats",
    };
  }
}
