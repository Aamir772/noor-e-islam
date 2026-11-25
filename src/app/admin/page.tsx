import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { hasPermission, PERMISSIONS } from "@/modules/auth/rbac";
import { requireUserWithFreshRoles } from "@/server/security/require-user";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administration",
  description: "Role protected administration foundation for Noor-e-Islam.",
};

const adminSections = [
  "Overview",
  "Content Management",
  "Quran Management",
  "Hadith Management",
  "Translation Management",
  "Source Management",
  "License Management",
  "Reference Management",
  "Review Queue",
  "Corrections",
  "Users and Roles",
  "Audit Logs",
  "Analytics",
  "Settings",
];

export default async function AdminPage() {
  const user = await requireUserWithFreshRoles();

  if (!hasPermission(user.roles, PERMISSIONS.USER_MANAGE)) {
    redirect("/dashboard");
  }

  return (
    <Container className="py-600">
      <Badge tone="gold">Foundation only</Badge>
      <h1 className="mt-300 text-heading-4 text-brand-forest">Administration dashboard</h1>
      <p className="mt-300 max-w-prose text-title-2 text-brand-muted">
        Server side role checks are active. This page is a protected shell. Content editing, publishing, review, donation and audit interfaces are not yet implemented.
      </p>
      <div className="mt-500 grid gap-200 sm:grid-cols-2 lg:grid-cols-4">
        {adminSections.map((section) => (
          <Card key={section}>
            <h2 className="text-title-3 text-brand-forest">{section}</h2>
            <p className="mt-100 text-caption-3 uppercase text-brand-muted">Planned</p>
          </Card>
        ))}
      </div>
    </Container>
  );
}
