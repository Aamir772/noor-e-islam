import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { env } from "@/lib/config/env";

export function getClientKey(request: NextRequest, scope: string): string {
  const forwardedFor =
    env.TRUST_PROXY === "true" ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : undefined;
  const fingerprint = forwardedFor || "local";
  const hash = createHash("sha256").update(fingerprint).digest("hex").slice(0, 32);
  return `${scope}:${hash}`;
}
