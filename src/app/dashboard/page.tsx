import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { hasPermission, PERMISSIONS } from "@/modules/auth/rbac";
import { requireUserWithFreshRoles } from "@/server/security/require-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Personal reading dashboard for registered Noor-e-Islam users.",
};

export default async function DashboardPage() {
  const user = await requireUserWithFreshRoles();
  const canAccessAdmin =
    hasPermission(user.roles, PERMISSIONS.USER_MANAGE) ||
    hasPermission(user.roles, PERMISSIONS.CONTENT_UPDATE) ||
    hasPermission(user.roles, PERMISSIONS.CORRECTION_REVIEW);

  return (
    <Container className="py-600">
      <Badge tone="green">Registered account</Badge>
      <h1 className="mt-300 text-heading-4 text-brand-forest">Your learning dashboard</h1>
      <p className="mt-200 text-title-2 text-brand-muted">Signed in as {user.email}</p>
      <p className="mt-100 text-body-6 text-brand-muted">Roles: {user.roles.join(", ") || "Registered User"}</p>

      <div className="mt-500 grid gap-200 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <h2 className="text-title-3 text-brand-forest">Bookmarks</h2>
          <p className="mt-100 text-body-6 text-brand-muted">Ownership checks and unique constraints are defined in the database. Interface management is not yet implemented.</p>
        </Card>
        <Card>
          <h2 className="text-title-3 text-brand-forest">Reading lists</h2>
          <p className="mt-100 text-body-6 text-brand-muted">Personal reading list entities are prepared for future implementation.</p>
        </Card>
        <Card>
          <h2 className="text-title-3 text-brand-forest">Language preferences</h2>
          <p className="mt-100 text-body-6 text-brand-muted">Locale definitions and right to left rules are in place. Preference persistence is not yet implemented.</p>
        </Card>
      </div>

      {canAccessAdmin ? (
        <div className="mt-400">
          <Link href="/admin" className="interactive text-body-4 text-brand-primary hover:text-brand-primary-dark">
            Open administration dashboard
          </Link>
        </div>
      ) : null}
    </Container>
  );
}
