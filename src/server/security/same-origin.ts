import type { NextRequest } from "next/server";
import { getCsrfAllowedOrigins } from "@/lib/config/env";
import { ForbiddenError } from "@/lib/errors/app-error";

export function requireSameOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");

  if (!origin) {
    throw new ForbiddenError("Origin header is required for state-changing requests");
  }

  let parsedOrigin: URL;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    throw new ForbiddenError("Invalid Origin header");
  }

  const allowedOrigins = new Set(getCsrfAllowedOrigins().map((item) => item.origin));
  if (!allowedOrigins.has(parsedOrigin.origin)) {
    throw new ForbiddenError("Cross-origin request rejected");
  }
}
