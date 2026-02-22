import { z } from "zod";

export const createQueueEntrySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  partySize: z.coerce.number().int().min(1, "Party size must be at least 1").max(20),
  contactNumber: z.string().min(1, "Contact number is required").max(20),
});

export type CreateQueueEntryInput = z.infer<typeof createQueueEntrySchema>;
