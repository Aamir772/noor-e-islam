import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import type { Role } from "@/modules/auth/roles";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user;
}

export async function requireUserWithFreshRoles() {
  const sessionUser = await requireUser();
  const assignments = await prisma.userRole.findMany({
    where: {
      userId: sessionUser.id,
      revokedAt: null,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    select: { role: { select: { name: true } } },
  });

  return {
    ...sessionUser,
    roles: assignments.map((assignment) => assignment.role.name as Role),
  };
}
