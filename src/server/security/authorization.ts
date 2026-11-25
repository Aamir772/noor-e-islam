import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors/app-error";
import { assertPermission, permissionsForRoles, type Permission } from "@/modules/auth/rbac";
import type { Role } from "@/modules/auth/roles";

export interface ApiActor {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions: Set<Permission>;
}

export async function getApiActor(): Promise<ApiActor | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      isSuspended: true,
      roles: {
        where: {
          revokedAt: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        select: { role: { select: { name: true } } },
      },
    },
  });

  if (!user || !user.isActive || user.isSuspended) {
    return null;
  }

  const roles = user.roles.map((assignment) => assignment.role.name as Role);

  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.email,
    roles,
    permissions: permissionsForRoles(roles),
  };
}

export async function requireApiActor(): Promise<ApiActor> {
  const actor = await getApiActor();
  if (!actor) {
    throw new UnauthorizedError();
  }
  return actor;
}

export async function requireApiPermission(permission: Permission): Promise<ApiActor> {
  const actor = await requireApiActor();
  assertPermission(actor.roles, permission);
  return actor;
}

export async function requireApiRole(role: Role): Promise<ApiActor> {
  const actor = await requireApiActor();
  if (!actor.roles.includes(role)) {
    throw new ForbiddenError("Access denied");
  }
  return actor;
}
