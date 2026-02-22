"use server";

import { prisma } from "@/lib/prisma";
import {
  FLOOR_PLAN_SECTIONS,
  type TableStatus,
  type TableStatusInfo,
} from "@/lib/floor-plan";

export type TableWithStatus = TableStatusInfo & { label: string };

export type SectionWithTables = {
  id: string;
  title: string;
  tables: TableWithStatus[];
};

export async function getTableStatusesAction(): Promise<{
  sections: SectionWithTables[];
  error: string | null;
}> {
  try {
    const [orders, waiterRequests] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      prisma.waiterRequest.findMany({
        where: { status: "PENDING" },
      }),
    ]);

    const latestOrderByTable = new Map<string, (typeof orders)[0]>();
    for (const order of orders) {
      if (!latestOrderByTable.has(order.tableNumber)) {
        latestOrderByTable.set(order.tableNumber, order);
      }
    }

    const tablesWithWaiterRequest = new Set(
      waiterRequests.map((r) => r.tableNumber)
    );

    function getStatus(tableId: string): TableStatusInfo {
      const order = latestOrderByTable.get(tableId);
      const hasWaiterRequest = tablesWithWaiterRequest.has(tableId);

      if (hasWaiterRequest) {
        return {
          tableId,
          status: "attention",
          orderId: order?.id ?? null,
          orderStatus: order?.status ?? null,
          hasWaiterRequest: true,
        };
      }
      if (!order) {
        return {
          tableId,
          status: "available",
          orderId: null,
          orderStatus: null,
          hasWaiterRequest: false,
        };
      }
      if (order.status === "READY") {
        return {
          tableId,
          status: "ready",
          orderId: order.id,
          orderStatus: order.status,
          hasWaiterRequest: false,
        };
      }
      if (["SERVED", "CANCELLED"].includes(order.status)) {
        return {
          tableId,
          status: "available",
          orderId: order.id,
          orderStatus: order.status,
          hasWaiterRequest: false,
        };
      }
      return {
        tableId,
        status: "occupied",
        orderId: order.id,
        orderStatus: order.status,
        hasWaiterRequest: false,
      };
    }

    const sections: SectionWithTables[] = FLOOR_PLAN_SECTIONS.map(
      (section) => ({
        id: section.id,
        title: section.title,
        tables: section.tables.map((t) => ({ ...getStatus(t.id), label: t.label })),
      })
    );

    return { sections, error: null };
  } catch {
    return {
      sections: FLOOR_PLAN_SECTIONS.map((s) => ({
        id: s.id,
        title: s.title,
        tables: s.tables.map((t) => ({
          tableId: t.id,
          status: "available" as TableStatus,
          orderId: null,
          orderStatus: null,
          hasWaiterRequest: false,
          label: t.label,
        })),
      })),
      error: "Failed to load table statuses",
    };
  }
}
