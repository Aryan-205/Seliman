"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Phone, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueueStore, useCartStore } from "@/store";
import {
  createQueueEntryAction,
  getQueueEntryByIdAction,
  getNowServingAction,
} from "@/app/actions/queue";

export default function WaitPage() {
  const queueEntryId = useQueueStore((s) => s.queueEntryId);
  const setQueueEntry = useQueueStore((s) => s.setQueueEntry);
  const assignedTableId = useQueueStore((s) => s.assignedTableId);
  const setAssignedTable = useQueueStore((s) => s.setAssignedTable);
  const goToTable = useQueueStore((s) => s.goToTable);
  const setTableNumber = useCartStore((s) => s.setTableNumber);

  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [estimatedAt, setEstimatedAt] = useState<string | null>(null);
  const [nowServing, setNowServing] = useState<number | null>(null);

  useEffect(() => {
    const entryId = queueEntryId;
    if (!entryId) return;
    async function poll() {
      const [entryRes, servingRes] = await Promise.all([
        getQueueEntryByIdAction(entryId as string),
        getNowServingAction(),
      ]);
      if (entryRes.entry) {
        setQueueNumber(entryRes.entry.queueNumber);
        setEstimatedAt(entryRes.entry.estimatedAt);
        if (entryRes.entry.assignedTableId) {
          setAssignedTable(entryRes.entry.assignedTableId);
        }
      }
      if (servingRes.nowServing != null) setNowServing(servingRes.nowServing);
    }
    poll();
    const interval = setInterval(poll, 4000);
    return () => clearInterval(interval);
  }, [queueEntryId, setAssignedTable]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await createQueueEntryAction({
      name,
      partySize,
      contactNumber,
    });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.entry) {
      setQueueEntry(result.entry.id);
      setQueueNumber(result.entry.queueNumber);
      setEstimatedAt(result.entry.estimatedAt.toISOString());
      const serving = await getNowServingAction();
      setNowServing(serving.nowServing);
    }
  }

  function handleGoToTable() {
    if (assignedTableId) goToTable(assignedTableId, setTableNumber);
  }

  if (assignedTableId) {
    return (
      <div className="w-full px-4 py-12 min-h-screen flex flex-col items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-white p-8 rounded-lg max-w-md w-full text-center"
        >
          <h1 className="text-2xl font-bold mb-2 text-[#A00000]">Your table is ready</h1>
          <p className="text-3xl font-bold mb-6">Table {assignedTableId}</p>
          <p className="text-muted-foreground mb-6">
            Please proceed to the host desk and then to your table.
          </p>
          <Button asChild size="lg" className="w-full bg-[#A00000] text-white">
            <Link href={`/table/${assignedTableId}`} onClick={handleGoToTable}>
              Open menu for Table {assignedTableId}
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  if (queueEntryId && queueNumber != null) {
    return (
      <div className="w-full px-4 py-12 min-h-screen flex flex-col items-center justify-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-white p-8 rounded-lg max-w-md w-full text-center"
        >
          <h1 className="text-2xl font-bold mb-2">You're in the queue</h1>
          <div className="flex justify-center gap-8 my-6">
            <div>
              <p className="text-sm text-muted-foreground">Your number</p>
              <p className="text-4xl font-bold text-[#A00000]">{queueNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Now serving</p>
              <p className="text-4xl font-bold">
                {nowServing ?? "—"}
              </p>
            </div>
          </div>
          {estimatedAt && (
            <p className="text-muted-foreground mb-6">
              Estimated wait: ~{Math.round((new Date(estimatedAt).getTime() - Date.now()) / 60000)} min
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            We'll call your number when a table is ready. You can stay on this page to see updates.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-12 min-h-screen flex flex-col items-center justify-center pt-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border border-white p-8 rounded-lg max-w-md w-full"
      >
        <h1 className="text-3xl font-bold mb-2">Join the waiting list</h1>
        <p className="text-muted-foreground mb-8">
          Enter your details to get a queue number and estimated wait time.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" /> Name
            </label>
            <Input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Party size
            </label>
            <Input
              type="number"
              min={1}
              max={20}
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value) || 1)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" /> Contact number
            </label>
            <Input
              placeholder="Phone number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full bg-[#A00000] text-white"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Join queue"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
