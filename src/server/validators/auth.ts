import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2).max(80).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
