import { describe, expect, it } from "vitest";
import { assertCanApproveTranslation, assertPermission, hasPermission, PERMISSIONS } from "@/modules/auth/rbac";
import { ROLES } from "@/modules/auth/roles";

describe("RBAC", () => {
  it("allows guests to read public content but not user bookmarks", () => {
    expect(hasPermission([ROLES.GUEST], PERMISSIONS.CONTENT_READ)).toBe(true);
    expect(hasPermission([ROLES.GUEST], PERMISSIONS.BOOKMARK_MANAGE)).toBe(false);
  });

  it("does not allow a content editor to approve religious authenticity", () => {
    expect(() => assertPermission([ROLES.CONTENT_EDITOR], PERMISSIONS.RELIGIOUS_REVIEW)).toThrow();
  });

  it("allows research reviewers to perform religious review", () => {
    expect(hasPermission([ROLES.RESEARCH_REVIEWER], PERMISSIONS.RELIGIOUS_REVIEW)).toBe(true);
  });

  it("blocks a translator from approving their own translation", () => {
    expect(() => assertCanApproveTranslation([ROLES.RESEARCH_REVIEWER], "user-1", "user-1")).toThrow();
  });

  it("allows a different reviewer to approve a translation", () => {
    expect(() => assertCanApproveTranslation([ROLES.RESEARCH_REVIEWER], "reviewer-1", "translator-1")).not.toThrow();
  });

  it("keeps donation permissions separate from content permissions", () => {
    expect(hasPermission([ROLES.CONTENT_EDITOR], PERMISSIONS.DONATION_VIEW)).toBe(false);
    expect(hasPermission([ROLES.ADMINISTRATOR], PERMISSIONS.DONATION_VIEW)).toBe(true);
  });
});
