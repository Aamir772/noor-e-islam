import type { NextRequest } from "next/server";
import { apiSuccess, withApiHandler } from "@/lib/api/response";
import { prisma } from "@/lib/db/prisma";
import { AppError, ConflictError } from "@/lib/errors/app-error";
import { hashPassword } from "@/modules/auth/password";
import { ROLES } from "@/modules/auth/roles";
import { getClientKey } from "@/server/security/client-key";
import { assertRateLimit, publicApiRateLimiter } from "@/server/security/rate-limit";
import { requireSameOrigin } from "@/server/security/same-origin";
import { registerSchema } from "@/server/validators/auth";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  return withApiHandler(async () => {
    requireSameOrigin(request);

    await assertRateLimit(publicApiRateLimiter.consume(getClientKey(request, "register")));

    const body: unknown = await request.json().catch(() => null);
    const input = registerSchema.parse(body);
    const email = input.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      throw new ConflictError("An account with that email already exists");
    }

    const role = await prisma.role.findUnique({ where: { name: ROLES.REGISTERED_USER }, select: { id: true } });
    if (!role) {
      throw new AppError("Role configuration is missing", "CONFIG_ERROR", 500);
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: input.name,
        passwordHash: await hashPassword(input.password),
        roles: { create: { roleId: role.id } },
      },
      select: { id: true, email: true, createdAt: true },
    });

    return apiSuccess(user, 201);
  });
}
