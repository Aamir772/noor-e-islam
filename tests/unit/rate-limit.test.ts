import { describe, expect, it } from "vitest";
import { assertRateLimit, InMemoryRateLimiter } from "@/server/security/rate-limit";

describe("rate limiter", () => {
  it("allows requests within the configured window", async () => {
    let now = 0;
    const limiter = new InMemoryRateLimiter({ limit: 2, windowMs: 1000, now: () => now });

    expect((await limiter.consume("client-a")).allowed).toBe(true);
    now = 500;
    expect((await limiter.consume("client-a")).allowed).toBe(true);
  });

  it("blocks excess requests and reports retry time", async () => {
    const now = 0;
    const limiter = new InMemoryRateLimiter({ limit: 1, windowMs: 1000, now: () => now });

    await limiter.consume("client-b");
    const blocked = await limiter.consume("client-b");

    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
    await expect(assertRateLimit(blocked)).rejects.toThrow("Too many requests");
  });

  it("resets a bucket after the window expires", () => {
    let now = 0;
    const limiter = new InMemoryRateLimiter({ limit: 1, windowMs: 1000, now: () => now });

    expect(limiter.consume("client-c").allowed).toBe(true);
    now = 1000;
    expect(limiter.consume("client-c").allowed).toBe(true);
  });
});
