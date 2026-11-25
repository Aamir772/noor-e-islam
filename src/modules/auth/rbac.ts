import { ForbiddenError } from "@/lib/errors/app-error";
import { ROLES, type Role } from "./roles";

export const PERMISSIONS = {
  CONTENT_READ: "CONTENT_READ",
  CONTENT_CREATE: "CONTENT_CREATE",
  CONTENT_UPDATE: "CONTENT_UPDATE",
  CONTENT_PUBLISH: "CONTENT_PUBLISH",
  TRANSLATION_CREATE: "TRANSLATION_CREATE",
  TRANSLATION_UPDATE: "TRANSLATION_UPDATE",
  RELIGIOUS_REVIEW: "RELIGIOUS_REVIEW",
  CONTENT_APPROVE: "CONTENT_APPROVE",
  BOOKMARK_MANAGE: "BOOKMARK_MANAGE",
  READING_LIST_MANAGE: "READING_LIST_MANAGE",
  READING_PROGRESS_MANAGE: "READING_PROGRESS_MANAGE",
  FAVORITE_DUA_MANAGE: "FAVORITE_DUA_MANAGE",
  PREFERENCE_MANAGE: "PREFERENCE_MANAGE",
  CORRECTION_SUBMIT: "CORRECTION_SUBMIT",
  CORRECTION_REVIEW: "CORRECTION_REVIEW",
  MEDIA_MANAGE: "MEDIA_MANAGE",
  USER_MANAGE: "USER_MANAGE",
  DONATION_VIEW: "DONATION_VIEW",
  AUDIT_VIEW: "AUDIT_VIEW",
  SETTINGS_MANAGE: "SETTINGS_MANAGE",
  SEARCH_READ: "SEARCH_READ",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const rolePermissions: Record<Role, readonly Permission[]> = {
  [ROLES.GUEST]: [PERMISSIONS.CONTENT_READ, PERMISSIONS.SEARCH_READ, PERMISSIONS.CORRECTION_SUBMIT],
  [ROLES.REGISTERED_USER]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.CORRECTION_SUBMIT,
    PERMISSIONS.BOOKMARK_MANAGE,
    PERMISSIONS.READING_LIST_MANAGE,
    PERMISSIONS.READING_PROGRESS_MANAGE,
    PERMISSIONS.FAVORITE_DUA_MANAGE,
    PERMISSIONS.PREFERENCE_MANAGE,
  ],
  [ROLES.TRANSLATOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.TRANSLATION_CREATE,
    PERMISSIONS.TRANSLATION_UPDATE,
  ],
  [ROLES.CONTENT_EDITOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.TRANSLATION_CREATE,
    PERMISSIONS.MEDIA_MANAGE,
  ],
  [ROLES.RESEARCH_REVIEWER]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.RELIGIOUS_REVIEW,
    PERMISSIONS.CONTENT_APPROVE,
    PERMISSIONS.CORRECTION_REVIEW,
  ],
  [ROLES.ADMINISTRATOR]: [
    PERMISSIONS.CONTENT_READ,
    PERMISSIONS.SEARCH_READ,
    PERMISSIONS.CONTENT_CREATE,
    PERMISSIONS.CONTENT_UPDATE,
    PERMISSIONS.CONTENT_PUBLISH,
    PERMISSIONS.MEDIA_MANAGE,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.DONATION_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.CORRECTION_REVIEW,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  [ROLES.SUPER_ADMINISTRATOR]: Object.values(PERMISSIONS),
};

export function permissionsForRoles(roles: readonly Role[]): Set<Permission> {
  const permissions = new Set<Permission>();
  for (const role of roles) {
    for (const permission of rolePermissions[role] ?? []) {
      permissions.add(permission);
    }
  }
  return permissions;
}

export function hasPermission(roles: readonly Role[], permission: Permission): boolean {
  return permissionsForRoles(roles).has(permission);
}

export function assertPermission(roles: readonly Role[], permission: Permission): void {
  if (!hasPermission(roles, permission)) {
    throw new ForbiddenError(`Missing required permission: ${permission}`);
  }
}

export function assertCanApproveTranslation(
  actorRoles: readonly Role[],
  actorId: string,
  translatorId: string,
): void {
  assertPermission(actorRoles, PERMISSIONS.RELIGIOUS_REVIEW);
  if (actorId === translatorId) {
    throw new ForbiddenError("A translator cannot approve their own translation");
  }
}

export function assertCanPublishContent(actorRoles: readonly Role[]): void {
  assertPermission(actorRoles, PERMISSIONS.CONTENT_PUBLISH);
}
