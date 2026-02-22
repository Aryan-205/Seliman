"use server";

import { QueueEntryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createQueueEntrySchema } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

const ESTIMATE_BASE_MINUTES = 5;
const ESTIMATE_PER_PARTY = 2;
const ESTIMATE_PER_PERSON_AHEAD = 3;

export type CreateQueueEntryResult = {
  entry?: {
    id: string;
    queueNumber: number;
    estimatedAt: Date;
  };
  error?: string;
};

export async function createQueueEntryAction(
  payload: unknown
): Promise<CreateQueueEntryResult> {
  const parsed = createQueueEntrySchema.safeParse(payload);
  if (!parsed.success) {
    return {
      error: parsed.error.errors.map((e) => e.message).join(", "),
    };
  }

  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const countToday = await prisma.queueEntry.count({
      where: { createdAt: { gte: startOfToday }, status: { not: QueueEntryStatus.CANCELLED } },
    });
    const queueNumber = countToday + 1;

    const waitingCount = await prisma.queueEntry.count({
      where: { status: QueueEntryStatus.WAITING },
    });
    const estimatedMinutes =
      ESTIMATE_BASE_MINUTES +
      parsed.data.partySize * ESTIMATE_PER_PARTY +
      waitingCount * ESTIMATE_PER_PERSON_AHEAD;
    const estimatedAt = new Date(Date.now() + estimatedMinutes * 60 * 1000);

    const entry = await prisma.queueEntry.create({
      data: {
        name: parsed.data.name,
        partySize: parsed.data.partySize,
        contactNumber: parsed.data.contactNumber,
        queueNumber,
        estimatedAt,
        status: QueueEntryStatus.WAITING,
      },
    });

    revalidatePath("/staff/queue");
    revalidatePath("/wait");

    return {
      entry: {
        id: entry.id,
        queueNumber: entry.queueNumber,
        estimatedAt: entry.estimatedAt!,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      error:
        process.env.NODE_ENV === "development"
          ? `Queue failed: ${message}`
          : "Unable to join queue. Please try again.",
    };
  }
}

export async function getQueueEntryByIdAction(entryId: string) {
  try {
    const entry = await prisma.queueEntry.findUnique({
      where: { id: entryId },
    });
    if (!entry) return { entry: null, error: "Not found" };
    return {
      entry: {
        ...entry,
        estimatedAt: entry.estimatedAt?.toISOString() ?? null,
        calledAt: entry.calledAt?.toISOString() ?? null,
      },
      error: null,
    };
  } catch {
    return { entry: null, error: "Failed to load" };
  }
}

export async function getNowServingAction(): Promise<{
  nowServing: number | null;
  error: string | null;
}> {
  try {
    const called = await prisma.queueEntry.findFirst({
      where: { status: QueueEntryStatus.CALLED },
      orderBy: { calledAt: "desc" },
    });
    if (called) {
      return { nowServing: called.queueNumber, error: null };
    }
    const seated = await prisma.queueEntry.findFirst({
      where: { status: QueueEntryStatus.SEATED },
      orderBy: { updatedAt: "desc" },
    });
    return { nowServing: seated?.queueNumber ?? null, error: null };
  } catch {
    return { nowServing: null, error: "Failed to load" };
  }
}

export async function listQueueForStaffAction() {
  try {
    const entries = await prisma.queueEntry.findMany({
      where: { status: { in: [QueueEntryStatus.WAITING, QueueEntryStatus.CALLED] } },
      orderBy: [{ queueNumber: "asc" }],
    });
    return {
      entries: entries.map((e) => ({
        ...e,
        estimatedAt: e.estimatedAt?.toISOString() ?? null,
        calledAt: e.calledAt?.toISOString() ?? null,
      })),
      error: null,
    };
  } catch {
    return { entries: [], error: "Failed to load queue" };
  }
}

export async function callQueueEntryAction(entryId: string): Promise<{
  error?: string;
}> {
  try {
    await prisma.queueEntry.update({
      where: { id: entryId },
      data: { status: QueueEntryStatus.CALLED, calledAt: new Date() },
    });
    revalidatePath("/staff/queue");
    revalidatePath("/wait");
    return {};
  } catch {
    return { error: "Failed to call" };
  }
}

export async function assignTableToQueueEntryAction(
  entryId: string,
  tableId: string
): Promise<{ error?: string }> {
  try {
    await prisma.queueEntry.update({
      where: { id: entryId },
      data: { assignedTableId: tableId, status: QueueEntryStatus.SEATED },
    });
    revalidatePath("/staff/queue");
    revalidatePath("/wait");
    return {};
  } catch {
    return { error: "Failed to assign table" };
  }
}

export async function cancelQueueEntryAction(entryId: string): Promise<{
  error?: string;
}> {
  try {
    await prisma.queueEntry.update({
      where: { id: entryId },
      data: { status: QueueEntryStatus.CANCELLED },
    });
    revalidatePath("/staff/queue");
    revalidatePath("/wait");
    return {};
  } catch {
    return { error: "Failed to cancel" };
  }
}
