import { z } from "zod";
import { MODULE_SLUGS } from "@/modules/navigation/catalog";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(120),
  module: z.enum(MODULE_SLUGS).optional(),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
