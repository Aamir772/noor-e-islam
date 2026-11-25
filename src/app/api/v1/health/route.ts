import { NextResponse } from "next/server";
import { apiSuccess, withApiHandler } from "@/lib/api/response";

export const dynamic = "force-dynamic";

export async function GET() {
  return withApiHandler(() =>
    apiSuccess({
      status: "ok",
      service: "noor-e-islam",
      apiVersion: "v1",
      timestamp: new Date().toISOString(),
    }),
  );
}

export function HEAD() {
  return new NextResponse(null, { status: 204 });
}
