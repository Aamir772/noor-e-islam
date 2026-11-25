import { createHash } from "node:crypto";
import type { AuditAction, ContentStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface AdminAuditInput {
  actorId: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Prisma.InputJsonValue;
}

export interface ReviewAuditInput {
  contentItemId: string;
  action: AuditAction;
  actorId: string;
  actorRoleSnapshot: string;
  fromStatus?: ContentStatus;
  toStatus?: ContentStatus;
  notes?: string;
  evidenceUrl?: string;
}

export interface SessionAuditInput {
  userId: string;
  action: string;
  ip?: string;
  userAgent?: string;
}

function hashValue(value: string | undefined): string | null {
  if (!value) return null;
  return createHash("sha256").update(value).digest("hex");
}

export async function writeAdminAudit(input: AdminAuditInput): Promise<void> {
  await prisma.adminAuditLog.create({
    data: {
      actorId: input.actorId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      metadata: input.metadata,
    },
    select: { id: true },
  });
}

export async function writeReviewAudit(input: ReviewAuditInput): Promise<void> {
  await prisma.reviewAudit.create({
    data: {
      contentItemId: input.contentItemId,
      action: input.action,
      actorId: input.actorId,
      actorRoleSnapshot: input.actorRoleSnapshot,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
      notes: input.notes,
      evidenceUrl: input.evidenceUrl,
    },
    select: { id: true },
  });
}

export async function writeSessionAudit(input: SessionAuditInput): Promise<void> {
  await prisma.sessionAudit.create({
    data: {
      userId: input.userId,
      action: input.action,
      ipHash: hashValue(input.ip),
      userAgentHash: hashValue(input.userAgent),
    },
    select: { id: true },
  });
}
