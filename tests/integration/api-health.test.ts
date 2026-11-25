import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/v1/health/route";

describe("health API", () => {
  it("returns a consistent success envelope", async () => {
    const response = await GET();
    const payload: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      data: {
        status: "ok",
        service: "noor-e-islam",
        apiVersion: "v1",
      },
    });
  });
});
