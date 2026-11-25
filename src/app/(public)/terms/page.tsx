import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using the Noor-e-Islam foundation build and its demonstration content.",
};

export default function TermsPage() {
  return (
    <Container className="py-600">
      <article className="mx-auto max-w-prose">
        <p className="text-caption-3 uppercase text-brand-gold">Legal</p>
        <h1 className="mt-200 text-heading-3 text-brand-forest sm:text-heading-2">Terms of use</h1>
        <p className="mt-300 text-body-3 text-brand-muted">
          This site is a foundation build for an Islamic knowledge library. It is provided to demonstrate information architecture, design and content governance. It is not yet a public religious reference.
        </p>
        <h2 className="mt-500 text-heading-5 text-brand-forest">Content limitations</h2>
        <p className="mt-200 text-body-3 text-brand-muted">
          All current content records are demonstration only. Do not treat them as Quranic text, Hadith, translations, authenticity grades or scholarly approvals.
        </p>
        <h2 className="mt-500 text-heading-5 text-brand-forest">Acceptable use</h2>
        <ul className="mt-200 grid gap-100 text-body-6 text-brand-muted">
          <li>Use the site for learning about the planned platform and its structure.</li>
          <li>Do not attempt to access protected administrative functions without authorization.</li>
          <li>Do not submit religious claims as demonstration records.</li>
          <li>Do not use correction submissions for spam or abusive content.</li>
        </ul>
        <h2 className="mt-500 text-heading-5 text-brand-forest">Changes</h2>
        <p className="mt-200 text-body-3 text-brand-muted">
          Features and policies may change while the platform remains in foundation status. Published religious content will require licensing, qualified review and a separate public notice.
        </p>
      </article>
    </Container>
  );
}
