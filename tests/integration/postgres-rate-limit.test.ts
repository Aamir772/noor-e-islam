import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { prisma } from "@/lib/db/prisma";
import { PostgresRateLimiter } from "@/server/security/rate-limit";

describe.skipIf(!process.env.DATABASE_URL)("postgres rate limiter", () => {
  it("enforces the limit atomically under concurrent requests", async () => {
    const key = `test-rate-limit:${randomUUID()}`;
    const limiter = new PostgresRateLimiter({ limit: 3, windowMs: 60_000 });

    try {
      const results = await Promise.all(
        Array.from({ length: 6 }, () => limiter.consume(key)),
      );

      expect(results.filter((result) => result.allowed)).toHaveLength(3);
      expect(results.filter((result) => !result.allowed)).toHaveLength(3);
    } finally {
      await prisma.rateLimitCounter.deleteMany({ where: { key } });
    }
  });

  it("starts a fresh window after expiry", async () => {
    const key = `test-rate-limit:${randomUUID()}`;
    const limiter = new PostgresRateLimiter({ limit: 1, windowMs: 1_000 });

    try {
      expect((await limiter.consume(key)).allowed).toBe(true);
      expect((await limiter.consume(key)).allowed).toBe(false);
      await new Promise((resolve) => setTimeout(resolve, 1_100));
      expect((await limiter.consume(key)).allowed).toBe(true);
    } finally {
      await prisma.rateLimitCounter.deleteMany({ where: { key } });
    }
  });
});
