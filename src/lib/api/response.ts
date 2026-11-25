import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError, BadRequestError, RateLimitError } from "@/lib/errors/app-error";
import { log } from "@/lib/logging/logger";

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function apiFailure(error: AppError): NextResponse<ApiFailure> {
  const headers = new Headers();
  if (error instanceof RateLimitError) {
    headers.set("Retry-After", String(Math.max(error.retryAfterSeconds, 1)));
  }

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details }),
      },
    },
    { status: error.status, headers },
  );
}

export async function withApiHandler(handler: () => Promise<NextResponse> | NextResponse): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ZodError) {
      return apiFailure(new BadRequestError("Request validation failed", error.flatten()));
    }

    if (error instanceof AppError) {
      return apiFailure(error);
    }

    log("error", "Unhandled API error", {
      name: error instanceof Error ? error.name : "UnknownError",
    });

    return apiFailure(new AppError("Internal server error", "INTERNAL_ERROR", 500));
  }
}
