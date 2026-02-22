import { z } from "zod";

export const staffRoleEnum = z.enum(["STAFF", "SUPERADMIN"]);

export const createStaffSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  role: staffRoleEnum.default("STAFF"),
});

export const updateStaffSchema = createStaffSchema.partial().extend({
  id: z.string().min(1, "ID is required"),
  isActive: z.boolean().optional(),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
