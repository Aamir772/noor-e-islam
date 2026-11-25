import type { AuditAction } from "@/generated/prisma/enums";
import type { ContentStatus } from "@/modules/content/content.types";

export interface AuditEntry {
  contentItemId: string;
  action: AuditAction;
  actorId: string;
  actorRoleSnapshot: string;
  fromStatus?: ContentStatus;
  toStatus?: ContentStatus;
  notes?: string;
  evidenceUrl?: string;
}

export interface AuditRepository {
  append(entry: AuditEntry): Promise<void>;
}

export class AuditService {
  constructor(private readonly repository: AuditRepository) {}

  async record(entry: AuditEntry): Promise<void> {
    await this.repository.append({
      ...entry,
      actorRoleSnapshot: entry.actorRoleSnapshot || "UNKNOWN",
    });
  }
}
