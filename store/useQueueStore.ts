import { create } from "zustand";
import { persist } from "zustand/middleware";

type QueueState = {
  queueEntryId: string | null;
  assignedTableId: string | null;
  setQueueEntry: (id: string | null) => void;
  setAssignedTable: (tableId: string | null) => void;
  clearQueue: () => void;
  goToTable: (tableId: string, setTableNumber: (t: string | null) => void) => void;
};

export const useQueueStore = create<QueueState>()(
  persist(
    (set, get) => ({
      queueEntryId: null,
      assignedTableId: null,

      setQueueEntry: (queueEntryId) => set({ queueEntryId }),

      setAssignedTable: (assignedTableId) => set({ assignedTableId }),

      clearQueue: () => set({ queueEntryId: null, assignedTableId: null }),

      goToTable: (tableId, setTableNumber) => {
        setTableNumber(tableId);
        set({ assignedTableId: null });
      },
    }),
    { name: "restaurant-queue" }
  )
);