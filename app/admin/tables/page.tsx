"use client";

import { useEffect, useState } from "react";
import { getTableStatusesAction, type SectionWithTables } from "@/app/actions/tables";
import { getOrderByIdAction } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Printer, Eye, LayoutGrid, List, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TableStatus = "available" | "occupied" | "ready" | "attention";

const STATUS_CLASSES: Record<TableStatus, string> = {
  available: "bg-zinc-50 border-zinc-200 border-dashed",
  occupied: "bg-blue-50 border-blue-400 border-solid",
  ready: "bg-emerald-50 border-emerald-400 border-solid",
  attention: "bg-amber-50 border-amber-400 border-solid",
};

const SHOW_ICONS: Record<TableStatus, boolean> = {
  available: false,
  occupied: true,
  ready: true,
  attention: true,
};

export default function AdminTablesPage() {
  const [sections, setSections] = useState<SectionWithTables[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"floor" | "default">("floor");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderDetail, setOrderDetail] = useState<Awaited<ReturnType<typeof getOrderByIdAction>>["order"]>(null);
  const [orderDetailLoading, setOrderDetailLoading] = useState(false);

  async function loadStatuses() {
    const { sections: next, error: err } = await getTableStatusesAction();
    setSections(next);
    setError(err);
    setLoading(false);
  }

  useEffect(() => {
    loadStatuses();
    const interval = setInterval(loadStatuses, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedOrderId) {
      setOrderDetail(null);
      return;
    }
    setOrderDetailLoading(true);
    getOrderByIdAction(selectedOrderId).then(({ order }) => {
      setOrderDetail(order);
      setOrderDetailLoading(false);
    });
  }, [selectedOrderId]);

  function handleViewOrder(orderId: string | null) {
    setSelectedOrderId(orderId);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Table status</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "floor" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("floor")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Floor Plan
          </Button>
          <Button
            variant={viewMode === "default" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("default")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            Default Layout
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="text-lg font-semibold text-zinc-700 mb-4">
              {section.title}
            </h2>
            <div
              className={cn(
                "grid gap-3",
                viewMode === "floor"
                  ? "grid-cols-[repeat(auto-fill,minmax(100px,1fr))]"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              )}
            >
              {section.tables.map((table) => {
                const status = table.status as TableStatus;
                const showIcons = SHOW_ICONS[status];
                return (
                  <div
                    key={table.tableId}
                    className={cn(
                      "rounded-xl border-2 p-4 shadow-sm transition-all hover:shadow-md flex flex-col items-center justify-center min-h-[100px]",
                      STATUS_CLASSES[status]
                    )}
                  >
                    <span className="font-semibold text-zinc-800">
                      {table.label}
                    </span>
                    {showIcons && (
                      <div className="flex items-center gap-2 mt-2">
                        {table.orderId && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleViewOrder(table.orderId)}
                              className="p-1.5 rounded-md hover:bg-white/60 transition-colors"
                              title="View order"
                            >
                              <Eye className="h-4 w-4 text-zinc-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                handleViewOrder(table.orderId);
                                setTimeout(handlePrint, 300);
                              }}
                              className="p-1.5 rounded-md hover:bg-white/60 transition-colors"
                              title="Print"
                            >
                              <Printer className="h-4 w-4 text-zinc-600" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Order detail panel */}
      {selectedOrderId && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrderId(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col print:shadow-none print:max-h-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Order details</h3>
              <div className="flex items-center gap-2">
                {orderDetail && (
                  <Button size="sm" variant="outline" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setSelectedOrderId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {orderDetailLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                </div>
              ) : orderDetail ? (
                <div className="space-y-4">
                  <p className="text-sm text-zinc-500">
                    Table {orderDetail.tableNumber} ·{" "}
                    <span className="font-medium capitalize">
                      {orderDetail.status.toLowerCase()}
                    </span>
                  </p>
                  <ul className="space-y-2">
                    {orderDetail.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.name} × {item.quantity}
                          {item.notes && (
                            <span className="text-zinc-500 italic">
                              {" "}({item.notes})
                            </span>
                          )}
                        </span>
                        <span className="font-mono">
                          {formatCurrency(Number(item.price))}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {orderDetail.customerNotes && (
                    <p className="text-sm text-zinc-600 pt-2 border-t">
                      <span className="font-medium">Note: </span>
                      {orderDetail.customerNotes}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">Order not found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
