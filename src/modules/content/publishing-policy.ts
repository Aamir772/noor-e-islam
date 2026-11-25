import { ConflictError } from "@/lib/errors/app-error";
import { hasPermission, PERMISSIONS, type Permission } from "@/modules/auth/rbac";
import type { Role } from "@/modules/auth/roles";
import type { ContentStatus } from "./content.types";

const transitions: Record<ContentStatus, readonly ContentStatus[]> = {
  DRAFT: ["TRANSLATED", "ARCHIVED"],
  TRANSLATED: ["REFERENCED", "ARCHIVED"],
  REFERENCED: ["REVIEWED", "ARCHIVED"],
  REVIEWED: ["APPROVED", "ARCHIVED"],
  APPROVED: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["ARCHIVED"],
  ARCHIVED: [],
};

const requiredPermissions: Partial<Record<ContentStatus, Permission>> = {
  TRANSLATED: PERMISSIONS.TRANSLATION_CREATE,
  REFERENCED: PERMISSIONS.CONTENT_UPDATE,
  REVIEWED: PERMISSIONS.RELIGIOUS_REVIEW,
  APPROVED: PERMISSIONS.CONTENT_APPROVE,
  PUBLISHED: PERMISSIONS.CONTENT_PUBLISH,
  ARCHIVED: PERMISSIONS.CONTENT_UPDATE,
};

export interface PublishingContext {
  currentStatus: ContentStatus;
  actorRoles: readonly Role[];
  hasSource: boolean;
  hasReference: boolean;
  licenseValid: boolean;
  translationProvenanceValid: boolean;
  hasReviewerApproval: boolean;
  reviewerIsTranslator: boolean;
  versionCreated: boolean;
}

export function allowedTransitionsFrom(status: ContentStatus): readonly ContentStatus[] {
  return transitions[status];
}

function assertPrerequisites(target: ContentStatus, context: PublishingContext): void {
  if (target === "TRANSLATED" && !context.translationProvenanceValid) {
    throw new ConflictError("Translation provenance is required before this transition");
  }

  if (target === "REFERENCED" && (!context.hasSource || !context.hasReference || !context.licenseValid)) {
    throw new ConflictError("Source, reference, and valid license are required before this transition");
  }

  if (target === "REVIEWED" && (!context.hasSource || !context.hasReference || !context.licenseValid)) {
    throw new ConflictError("Religious review requires complete source, reference, and license records");
  }

  if (target === "APPROVED") {
    if (!context.hasReviewerApproval) {
      throw new ConflictError("Research Reviewer approval is required");
    }
    if (context.reviewerIsTranslator) {
      throw new ConflictError("A translator cannot approve their own translation");
    }
  }

  if (target === "PUBLISHED" && !context.versionCreated) {
    throw new ConflictError("A content version must be created before publication");
  }
}

export function assertCanTransitionTo(target: ContentStatus, context: PublishingContext): void {
  const allowed = transitions[context.currentStatus];
  if (!allowed.includes(target)) {
    throw new ConflictError(`Cannot transition from ${context.currentStatus} to ${target}`);
  }

  const permission = requiredPermissions[target];
  if (permission && !hasPermission(context.actorRoles, permission)) {
    throw new ConflictError(`Missing permission for transition to ${target}`);
  }

  assertPrerequisites(target, context);
}
