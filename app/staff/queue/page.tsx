"use client";

import { useEffect, useState } from "react";
import {
  listQueueForStaffAction,
  callQueueEntryAction,
  assignTableToQueueEntryAction,
} from "@/app/actions/queue";
import {
  getReservationsAction,
  updateReservationStatusAction,
} from "@/app/actions/reservations";
import { FLOOR_PLAN_SECTIONS } from "@/lib/floor-plan";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReservationStatus } from "@prisma/client";
import { Bell, Calendar, Loader2, Check, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_TABLES = FLOOR_PLAN_SECTIONS.flatMap((s) =>
  s.tables.map((t) => ({ id: t.id, label: `${s.title} ${t.label}` }))
);

type QueueEntry = Awaited<ReturnType<typeof listQueueForStaffAction>>["entries"][0];
type Reservation = Awaited<ReturnType<typeof getReservationsAction>>["reservations"][0];

export default function StaffQueuePage() {
  const [tab, setTab] = useState<"waiting" | "reservations">("waiting");
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedTableFor, setSelectedTableFor] = useState<string | null>(null);

  async function loadQueue() {
    const { entries: e } = await listQueueForStaffAction();
    setEntries(e);
  }

  async function loadReservations() {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date();
    to.setDate(to.getDate() + 14);
    const { reservations: r } = await getReservationsAction({
      fromDate: from,
      toDate: to,
    });
    setReservations(r);
  }

  async function load() {
    setLoading(true);
    await Promise.all([loadQueue(), loadReservations()]);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleCall(entryId: string) {
    await callQueueEntryAction(entryId);
    await loadQueue();
  }

  async function handleAssign(entryId: string, tableId: string) {
    setAssigningId(entryId);
    await assignTableToQueueEntryAction(entryId, tableId);
    setAssigningId(null);
    setSelectedTableFor(null);
    await loadQueue();
  }

  async function handleReservationStatus(id: string, status: ReservationStatus) {
    await updateReservationStatusAction(id, status);
    await loadReservations();
  }

  if (loading && entries.length === 0 && reservations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Queue & reservations</h1>
      <div className="flex gap-2 border-b">
        <button
          type="button"
          onClick={() => setTab("waiting")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            tab === "waiting"
              ? "border-[#A00000] text-[#A00000]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Waiting list
        </button>
        <button
          type="button"
          onClick={() => setTab("reservations")}
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            tab === "reservations"
              ? "border-[#A00000] text-[#A00000]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Reservations
        </button>
      </div>

      {tab === "waiting" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Waiting list
            </h2>
            <p className="text-sm text-muted-foreground">
              Call a number when ready, then assign a table.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No one in the queue.
              </p>
            ) : (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[#A00000]">
                      #{entry.queueNumber}
                    </span>
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.partySize} people · {entry.contactNumber}
                      </p>
                      {entry.estimatedAt && (
                        <p className="text-xs text-muted-foreground">
                          Est. {new Date(entry.estimatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        entry.status === "CALLED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-100 text-zinc-700"
                      )}
                    >
                      {entry.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.status === "WAITING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCall(entry.id)}
                      >
                        Call
                      </Button>
                    )}
                    {(entry.status === "WAITING" || entry.status === "CALLED") && (
                      <>
                        {selectedTableFor === entry.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              className="rounded border px-2 py-1.5 text-sm"
                              onChange={(e) => {
                                const v = e.target.value;
                                if (v) handleAssign(entry.id, v);
                              }}
                              disabled={assigningId === entry.id}
                            >
                              <option value="">Select table</option>
                              {ALL_TABLES.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedTableFor(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setSelectedTableFor(entry.id)}
                            disabled={assigningId === entry.id}
                          >
                            {assigningId === entry.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Assign table"
                            )}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {tab === "reservations" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reservations
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            {reservations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No reservations in the next 14 days.
              </p>
            ) : (
              reservations.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {r.date} at {r.time} · {r.partySize} people · {r.email}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded",
                        r.status === "PENDING" && "bg-amber-100 text-amber-800",
                        r.status === "CONFIRMED" && "bg-blue-100 text-blue-800",
                        r.status === "SEATED" && "bg-emerald-100 text-emerald-800",
                        r.status === "CANCELLED" && "bg-zinc-100 text-zinc-600"
                      )}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {r.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleReservationStatus(r.id, ReservationStatus.CONFIRMED)
                        }
                      >
                        Confirm
                      </Button>
                    )}
                    {r.status === "CONFIRMED" && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleReservationStatus(r.id, ReservationStatus.SEATED)
                        }
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Seated
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
