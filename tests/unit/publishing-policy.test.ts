import { describe, expect, it } from "vitest";
import type { PublishingContext } from "@/modules/content/publishing-policy";
import { allowedTransitionsFrom, assertCanTransitionTo } from "@/modules/content/publishing-policy";
import { ROLES } from "@/modules/auth/roles";

function completeContext(overrides: Partial<PublishingContext> = {}): PublishingContext {
  return {
    currentStatus: "DRAFT",
    actorRoles: [ROLES.CONTENT_EDITOR, ROLES.TRANSLATOR],
    hasSource: true,
    hasReference: true,
    licenseValid: true,
    translationProvenanceValid: true,
    hasReviewerApproval: true,
    reviewerIsTranslator: false,
    versionCreated: true,
    ...overrides,
  };
}

describe("publishing state machine", () => {
  it("allows only the defined sequence of states", () => {
    expect(allowedTransitionsFrom("DRAFT")).toEqual(["TRANSLATED", "ARCHIVED"]);
    expect(allowedTransitionsFrom("PUBLISHED")).toEqual(["ARCHIVED"]);
    expect(allowedTransitionsFrom("ARCHIVED")).toEqual([]);
  });

  it("requires translation provenance for the translated state", () => {
    expect(() =>
      assertCanTransitionTo("TRANSLATED", completeContext({ translationProvenanceValid: false })),
    ).toThrow();
  });

  it("requires source, reference, and license before referencing", () => {
    expect(() =>
      assertCanTransitionTo("REFERENCED", completeContext({ hasReference: false })),
    ).toThrow();
  });

  it("does not let an editor approve religious content", () => {
    expect(() =>
      assertCanTransitionTo(
        "REVIEWED",
        completeContext({ currentStatus: "REFERENCED", actorRoles: [ROLES.CONTENT_EDITOR] }),
      ),
    ).toThrow();
  });

  it("requires a non-translator reviewer approval before approval", () => {
    expect(() =>
      assertCanTransitionTo(
        "APPROVED",
        completeContext({ currentStatus: "REVIEWED", actorRoles: [ROLES.RESEARCH_REVIEWER], reviewerIsTranslator: true }),
      ),
    ).toThrow();
  });

  it("requires a version snapshot before publication", () => {
    expect(() =>
      assertCanTransitionTo(
        "PUBLISHED",
        completeContext({ currentStatus: "APPROVED", actorRoles: [ROLES.ADMINISTRATOR], versionCreated: false }),
      ),
    ).toThrow();
  });

  it("allows a complete approved path to publication", () => {
    expect(() =>
      assertCanTransitionTo(
        "PUBLISHED",
        completeContext({ currentStatus: "APPROVED", actorRoles: [ROLES.ADMINISTRATOR] }),
      ),
    ).not.toThrow();
  });
});
