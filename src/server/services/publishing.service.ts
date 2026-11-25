import { NotFoundError } from "@/lib/errors/app-error";
import { assertCanTransitionTo, type PublishingContext } from "@/modules/content/publishing-policy";
import type { ContentStatus } from "@/modules/content/content.types";
import type { Role } from "@/modules/auth/roles";
import type { AuditService } from "./audit.service";
import type { ContentRepository } from "@/server/repositories/content.repository";

export interface TransitionContentInput {
  contentItemId: string;
  target: ContentStatus;
  actorId: string;
  actorRoles: readonly Role[];
  notes?: string;
}

export class PublishingService {
  constructor(
    private readonly contentRepository: ContentRepository,
    private readonly auditService: AuditService,
  ) {}

  async transition(input: TransitionContentInput): Promise<void> {
    const record = await this.contentRepository.findGovernanceRecord(input.contentItemId);
    if (!record) {
      throw new NotFoundError("Content item not found");
    }

    const context: PublishingContext = {
      currentStatus: record.status,
      actorRoles: input.actorRoles,
      hasSource: record.hasSource,
      hasReference: record.hasReference,
      licenseValid: record.licenseValid,
      translationProvenanceValid: record.translationProvenanceValid,
      hasReviewerApproval: record.hasReviewerApproval,
      reviewerIsTranslator: record.reviewerIsTranslator,
      versionCreated: record.versionCreated,
    };

    assertCanTransitionTo(input.target, context);

    await this.contentRepository.transition({
      contentItemId: input.contentItemId,
      target: input.target,
      actorId: input.actorId,
      versionSnapshot: input.target === "PUBLISHED" ? { publishedBy: input.actorId } : undefined,
    });

    await this.auditService.record({
      contentItemId: input.contentItemId,
      action: input.target === "PUBLISHED" ? "PUBLISHED" : "MODIFIED",
      actorId: input.actorId,
      actorRoleSnapshot: [...input.actorRoles].sort().join(","),
      fromStatus: record.status,
      toStatus: input.target,
      notes: input.notes,
    });
  }
}
