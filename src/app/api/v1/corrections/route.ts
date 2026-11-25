import type { NextRequest } from "next/server";
import { apiSuccess, withApiHandler } from "@/lib/api/response";
import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors/app-error";
import { PERMISSIONS } from "@/modules/auth/rbac";
import { requireApiPermission } from "@/server/security/authorization";
import { getClientKey } from "@/server/security/client-key";
import { assertRateLimit, publicApiRateLimiter } from "@/server/security/rate-limit";
import { requireSameOrigin } from "@/server/security/same-origin";
import { correctionSubmissionSchema } from "@/server/validators/correction";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return withApiHandler(async () => {
    requireSameOrigin(request);
    const actor = await requireApiPermission(PERMISSIONS.CORRECTION_SUBMIT);
    await assertRateLimit(publicApiRateLimiter.consume(`${actor.id}:${getClientKey(request, "correction")}`));

    const body: unknown = await request.json().catch(() => null);
    const input = correctionSubmissionSchema.parse(body);

    const contentItem = await prisma.contentItem.findUnique({ where: { id: input.contentItemId }, select: { id: true } });
    if (!contentItem) {
      throw new NotFoundError("Content item not found");
    }

    const submission = await prisma.correctionSubmission.create({
      data: {
        contentItemId: input.contentItemId,
        submitterId: actor.id,
        category: input.category,
        description: input.description,
        supportingReference: input.supportingReference,
        evidenceUrl: input.evidenceUrl,
      },
      select: { id: true, status: true, createdAt: true },
    });

    return apiSuccess(submission, 201);
  });
}
