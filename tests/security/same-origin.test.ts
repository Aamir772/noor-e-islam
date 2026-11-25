import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { requireSameOrigin } from "@/server/security/same-origin";

describe("same-origin protection", () => {
  it("accepts a matching origin", () => {
    const request = new NextRequest("http://localhost:3000/api/v1/corrections", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    });

    expect(() => requireSameOrigin(request)).not.toThrow();
  });

  it("rejects a cross-origin request", () => {
    const request = new NextRequest("http://localhost:3000/api/v1/corrections", {
      method: "POST",
      headers: { origin: "https://example.com" },
    });

    expect(() => requireSameOrigin(request)).toThrow("Cross-origin request rejected");
  });

  it("rejects a missing origin for state-changing requests", () => {
    const request = new NextRequest("http://localhost:3000/api/v1/corrections", { method: "POST" });

    expect(() => requireSameOrigin(request)).toThrow("Origin header is required");
  });
});
