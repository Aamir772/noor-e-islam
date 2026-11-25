import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/v1/search/route";

describe("search API", () => {
  it("returns demonstration results with a consistent envelope", async () => {
    const request = new NextRequest("http://localhost:3000/api/v1/search?q=hadith");
    const response = await GET(request);
    const payload: unknown = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      data: {
        isDemo: true,
        query: "hadith",
      },
    });
  });

  it("rejects an invalid limit", async () => {
    const request = new NextRequest("http://localhost:3000/api/v1/search?q=quran&limit=999");
    const response = await GET(request);
    const payload: unknown = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({ ok: false, error: { code: "BAD_REQUEST" } });
  });
});
