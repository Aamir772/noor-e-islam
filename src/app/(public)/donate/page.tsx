import type { Metadata } from "next";
import { DemoNotice } from "@/components/content/DemoNotice";
import { Reveal } from "@/components/motion/Reveal";
import { ActionLink } from "@/components/ui/ActionLink";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Support Noor-e-Islam",
  description: "Donation architecture is prepared but payments are disabled until a compliant provider is configured.",
};

export default function DonatePage() {
  return (
    <Container className="py-600">
      <Reveal>
        <div className="max-w-prose">
          <Badge tone="gold">Payments disabled</Badge>
          <h1 className="mt-300 text-heading-3 text-brand-forest sm:text-heading-2">Support the project</h1>
          <p className="mt-300 text-title-2 text-brand-muted">
            The donation module is intentionally inactive in this foundation build. No payment provider is configured and no card data is collected.
          </p>
        </div>
      </Reveal>
      <div className="mt-500 grid gap-300 lg:grid-cols-2">
        <DemoNotice />
        <Card>
          <h2 className="text-heading-6 text-brand-forest">Planned safeguards</h2>
          <ul className="mt-300 grid gap-100 text-body-6 text-brand-muted">
            <li>External payment provider with signed webhooks</li>
            <li>Idempotent donation event processing</li>
            <li>No card numbers or security codes stored in the platform database</li>
            <li>Donation permissions separated from content permissions</li>
          </ul>
          <div className="mt-400"><ActionLink href="/" variant="secondary" size="sm">Return home</ActionLink></div>
        </Card>
      </div>
    </Container>
  );
}
