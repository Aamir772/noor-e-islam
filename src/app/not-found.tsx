import { ActionLink } from "@/components/ui/ActionLink";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <Container className="py-800">
      <section aria-labelledby="not-found-heading" className="mx-auto max-w-prose rounded-2xl border border-brand-line bg-brand-surface p-400 shadow-card">
        <p className="text-caption-3 uppercase text-brand-gold">404</p>
        <h1 id="not-found-heading" className="mt-200 text-heading-4 text-brand-forest sm:text-heading-3">
          This page is not in the library
        </h1>
        <p className="mt-300 text-body-3 text-brand-muted">
          The address may have changed. You can return to the homepage or search across the available modules.
        </p>
        <div className="mt-400 flex flex-wrap gap-200">
          <ActionLink href="/" variant="primary">Return home</ActionLink>
          <ActionLink href="/search" variant="secondary">Search the library</ActionLink>
        </div>
      </section>
    </Container>
  );
}
