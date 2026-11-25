import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Noor-e-Islam handles account details, search queries and demonstration content.",
};

export default function PrivacyPage() {
  return (
    <Container className="py-600">
      <article className="mx-auto max-w-prose">
        <p className="text-caption-3 uppercase text-brand-gold">Legal</p>
        <h1 className="mt-200 text-heading-3 text-brand-forest sm:text-heading-2">Privacy policy</h1>
        <p className="mt-300 text-body-3 text-brand-muted">
          This foundation build does not publish religious content or process payments. Account creation stores an email address, an optional display name and a password hash for authentication.
        </p>
        <h2 className="mt-500 text-heading-5 text-brand-forest">Information we store</h2>
        <ul className="mt-200 grid gap-100 text-body-6 text-brand-muted">
          <li>Account email, optional display name and password hash.</li>
          <li>Role assignments and audit records for editorial actions.</li>
          <li>Correction submissions and their resolution notes.</li>
          <li>Search terms sent to the server for demonstration search.</li>
        </ul>
        <h2 className="mt-500 text-heading-5 text-brand-forest">How we handle it</h2>
        <p className="mt-200 text-body-3 text-brand-muted">
          Passwords are hashed with bcrypt. Sensitive values are not returned by public APIs. Audit records store hashed IP details rather than plain addresses. No card data is collected.
        </p>
        <h2 className="mt-500 text-heading-5 text-brand-forest">Demonstration content</h2>
        <p className="mt-200 text-body-3 text-brand-muted">
          Current content records are labelled as demonstration only. They are not presented as verified Quranic text, Hadith, translations or authenticity grades.
        </p>
        <h2 className="mt-500 text-heading-5 text-brand-forest">Your choices</h2>
        <p className="mt-200 text-body-3 text-brand-muted">
          Reading public pages does not require an account. Account deletion and data export workflows are planned but not yet available in this foundation build.
        </p>
      </article>
    </Container>
  );
}
