import type { ContentStatus } from "@/modules/content/content.types";

export interface ContentGovernanceRecord {
  id: string;
  status: ContentStatus;
  hasSource: boolean;
  hasReference: boolean;
  licenseValid: boolean;
  translationProvenanceValid: boolean;
  hasReviewerApproval: boolean;
  reviewerIsTranslator: boolean;
  versionCreated: boolean;
}

export interface ContentRepository {
  findGovernanceRecord(contentItemId: string): Promise<ContentGovernanceRecord | null>;
  transition(input: {
    contentItemId: string;
    target: ContentStatus;
    actorId: string;
    versionSnapshot?: Record<string, unknown>;
  }): Promise<void>;
}
