import Link from "next/link";
import { DemoNotice } from "@/components/content/DemoNotice";
import { ModuleGrid } from "@/components/content/ModuleGrid";
import { Reveal } from "@/components/motion/Reveal";
import { SearchBox } from "@/components/search/SearchBox";
import { ActionLink } from "@/components/ui/ActionLink";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContentModuleDescriptor } from "@/modules/navigation/catalog";

export function ModulePage({ descriptor }: { descriptor: ContentModuleDescriptor }) {
  return (
    <>
      <section aria-label={`${descriptor.shortTitle} introduction`} className="border-b border-brand-line bg-brand-surface">
        <Container className="py-600">
          <nav aria-label="Breadcrumb" className="text-caption-2 text-brand-muted">
            <ol className="flex flex-wrap items-center gap-100">
              <li><Link href="/" className="interactive hover:text-brand-primary">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-brand-forest">{descriptor.shortTitle}</li>
            </ol>
          </nav>
          <div className="mt-500 grid items-end gap-500 lg:grid-cols-2">
            <Reveal>
              <Badge tone="gold">{descriptor.eyebrow}</Badge>
              <h1 className="text-balance mt-300 max-w-prose text-heading-3 sm:text-heading-2">{descriptor.title}</h1>
              <p className="text-balance mt-300 max-w-prose text-title-2 text-brand-muted">{descriptor.description}</p>
            </Reveal>
            <Reveal>
              <SearchBox />
              <p className="mt-100 text-caption-2 text-brand-muted">Search currently indexes demonstration records only.</p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section aria-label={`${descriptor.shortTitle} structure`} className="bg-brand-ivory py-600">
        <Container>
          <Reveal>
            <DemoNotice />
            <div className="mt-500 grid gap-500 lg:grid-cols-2">
              <div>
                <SectionHeading eyebrow="Planned structure" title="How this module is organized" />
                <ol className="grid gap-100">
                  {descriptor.topics.map((topic, index) => (
                    <li key={topic} className="flex items-start gap-200 rounded-lg border border-brand-line bg-brand-surface p-200">
                      <span className="flex h-400 w-400 shrink-0 items-center justify-center rounded-full bg-state-hover text-caption-3 text-brand-primary-dark">
                        {index + 1}
                      </span>
                      <span className="text-body-5 text-brand-forest">{topic}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="grid content-start gap-200">
                <Card>
                  <p className="text-caption-3 uppercase text-brand-gold">Source standard</p>
                  <h2 className="mt-200 text-heading-6 text-brand-forest">Reference before publication</h2>
                  <p className="mt-200 text-body-6 text-brand-muted">
                    Religious content in this module must carry source, reference, license, translation provenance, reviewer approval and version history before publication.
                  </p>
                </Card>
                <Card className="bg-brand-forest text-brand-surface">
                  <p className="text-caption-3 uppercase text-brand-gold">Current status</p>
                  <p className="mt-200 text-title-2">Information architecture implemented</p>
                  <p className="mt-100 text-body-6 text-brand-surface/70">
                    Verified content is intentionally withheld until licensing and qualified review are complete.
                  </p>
                  <div className="mt-300">
                    <ActionLink href="/privacy" variant="onDark" size="sm">Read our data policy</ActionLink>
                  </div>
                </Card>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <ModuleGrid />
    </>
  );
}
