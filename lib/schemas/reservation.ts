import { z } from "zod";

export const createReservationSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  partySize: z.coerce.number().int().min(1).max(20),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
