import { env } from "@/lib/config/env";
import { prisma } from "@/lib/db/prisma";
import { RateLimitError } from "@/lib/errors/app-error";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  consume(key: string): Promise<RateLimitResult> | RateLimitResult;
}

interface Bucket {
  count: number;
  startedAt: number;
}

export interface InMemoryRateLimiterOptions {
  limit: number;
  windowMs: number;
  now?: () => number;
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  private readonly now: () => number;

  constructor(private readonly options: InMemoryRateLimiterOptions) {
    this.now = options.now ?? Date.now;
  }

  consume(key: string): RateLimitResult {
    const currentTime = this.now();
    const existing = this.buckets.get(key);

    if (!existing || currentTime - existing.startedAt >= this.options.windowMs) {
      this.buckets.set(key, { count: 1, startedAt: currentTime });
      return { allowed: true, remaining: this.options.limit - 1, retryAfterSeconds: 0 };
    }

    if (existing.count >= this.options.limit) {
      const retryAfterSeconds = Math.ceil(
        (existing.startedAt + this.options.windowMs - currentTime) / 1_000,
      );
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: this.options.limit - existing.count,
      retryAfterSeconds: 0,
    };
  }
}

export interface PostgresRateLimiterOptions {
  limit: number;
  windowMs: number;
}

export class PostgresRateLimiter implements RateLimiter {
  constructor(private readonly options: PostgresRateLimiterOptions) {
    if (!Number.isInteger(options.windowMs) || options.windowMs < 1_000) {
      throw new Error("Rate limit window must be at least one second");
    }
  }

  async consume(key: string): Promise<RateLimitResult> {
    const windowSeconds = Math.ceil(this.options.windowMs / 1_000);
    const rows = await prisma.$queryRaw<
      Array<{ count: number; remaining: number; retryAfterSeconds: number }>
    >`
      WITH consumed AS (
        INSERT INTO "rate_limit_counters" ("id", "key", "windowStart", "count", "updatedAt")
        VALUES (gen_random_uuid(), ${key}, NOW(), 1, NOW())
        ON CONFLICT ("key") DO UPDATE SET
          "count" = CASE
            WHEN "rate_limit_counters"."windowStart" <= NOW() - (${windowSeconds} || ' seconds')::interval
            THEN 1
            ELSE "rate_limit_counters"."count" + 1
          END,
          "windowStart" = CASE
            WHEN "rate_limit_counters"."windowStart" <= NOW() - (${windowSeconds} || ' seconds')::interval
            THEN NOW()
            ELSE "rate_limit_counters"."windowStart"
          END,
          "updatedAt" = NOW()
        RETURNING "count", "windowStart"
      )
      SELECT
        "count",
        GREATEST(${this.options.limit} - "count", 0) AS "remaining",
        CASE
          WHEN "count" <= ${this.options.limit} THEN 0
          ELSE CEIL(EXTRACT(EPOCH FROM (
            "windowStart" + (${windowSeconds} || ' seconds')::interval - NOW()
          )))::int
        END AS "retryAfterSeconds"
      FROM consumed
    `;

    const result = rows[0];
    if (!result) {
      throw new Error("Rate limiter did not return a result");
    }

    return {
      allowed: result.count <= this.options.limit,
      remaining: Number(result.remaining),
      retryAfterSeconds: Number(result.retryAfterSeconds),
    };
  }
}

export async function assertRateLimit(result: RateLimitResult | Promise<RateLimitResult>): Promise<void> {
  const resolved = await result;
  if (!resolved.allowed) {
    throw new RateLimitError(resolved.retryAfterSeconds);
  }
}

export function createRateLimiter(options: PostgresRateLimiterOptions): RateLimiter {
  if (env.RATE_LIMIT_BACKEND === "postgres") {
    return new PostgresRateLimiter(options);
  }
  return new InMemoryRateLimiter({ ...options, windowMs: options.windowMs });
}

export const publicApiRateLimiter: RateLimiter = createRateLimiter({
  limit: 60,
  windowMs: 60_000,
});
