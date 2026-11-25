import type { NextRequest } from "next/server";
import { apiSuccess, withApiHandler } from "@/lib/api/response";
import { searchDemoContent } from "@/modules/search/search.service";
import { getClientKey } from "@/server/security/client-key";
import { assertRateLimit, publicApiRateLimiter } from "@/server/security/rate-limit";
import { searchQuerySchema } from "@/server/validators/search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return withApiHandler(async () => {
    await assertRateLimit(publicApiRateLimiter.consume(getClientKey(request, "search")));

    const input = searchQuerySchema.parse({
      q: request.nextUrl.searchParams.get("q") ?? "",
      module: request.nextUrl.searchParams.get("module") ?? undefined,
      limit: request.nextUrl.searchParams.get("limit") ?? 10,
    });

    const results = searchDemoContent(input.q, { module: input.module, limit: input.limit });

    return apiSuccess({
      query: input.q,
      module: input.module ?? null,
      isDemo: true,
      results,
    });
  });
}
