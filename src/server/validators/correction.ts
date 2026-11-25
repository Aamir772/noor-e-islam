import { z } from "zod";

export const correctionSubmissionSchema = z.object({
  contentItemId: z.string().uuid(),
  category: z.enum(["REFERENCE", "TRANSLATION", "TEXT_ERROR", "GRADING", "LICENSING", "OTHER"]),
  description: z.string().trim().min(20).max(4000),
  supportingReference: z.string().trim().max(1000).optional(),
  evidenceUrl: z.url().max(2048).optional(),
});

export type CorrectionSubmissionInput = z.infer<typeof correctionSubmissionSchema>;
