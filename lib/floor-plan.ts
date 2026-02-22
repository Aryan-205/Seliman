/**
 * Floor plan layout: table IDs per section.
 * A/C: 1–28, Non A/C: 29–37, Bar: 38+
 * Customers at "Table 5" (A/C) use tableNumber "5"; Non A/C "Table 1" uses "29".
 */
export const FLOOR_PLAN_SECTIONS = [
  {
    id: "ac",
    title: "A/C",
    tables: Array.from({ length: 28 }, (_, i) => ({
      id: String(i + 1),
      label: `Table ${i + 1}`,
    })),
  },
  {
    id: "non-ac",
    title: "Non A/C",
    tables: Array.from({ length: 9 }, (_, i) => ({
      id: String(29 + i),
      label: `Table ${i + 1}`,
    })),
  },
  {
    id: "bar",
    title: "Bar",
    tables: Array.from({ length: 4 }, (_, i) => ({
      id: String(38 + i),
      label: `Table ${i + 1}`,
    })),
  },
] as const;

export type TableStatus = "available" | "occupied" | "ready" | "attention";

export type TableStatusInfo = {
  tableId: string;
  status: TableStatus;
  orderId: string | null;
  orderStatus: string | null;
  hasWaiterRequest: boolean;
};
