import Link from "next/link";
import { ActionLink } from "@/components/ui/ActionLink";
import { Card } from "@/components/ui/Card";
import { contentModules } from "@/modules/navigation/catalog";

export function ModuleGrid({ headingId = "all-modules-heading" }: { headingId?: string }) {
  return (
    <section aria-label="All modules — Continue learning" className="py-600">
      <div className="mx-auto w-full max-w-content px-200 sm:px-300 lg:px-400">
        <div className="mb-400 flex flex-col gap-200 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-prose">
            <p className="mb-100 text-caption-3 uppercase text-brand-gold">All modules</p>
            <h2 id={headingId} className="text-heading-4 text-brand-forest sm:text-heading-3">
              Continue learning
            </h2>
            <p className="mt-200 text-body-3 text-brand-muted">
              Every area of the library is available from this section.
            </p>
          </div>
          <ActionLink href="/search" variant="secondary" size="sm">
            Search the library
          </ActionLink>
        </div>
        <ul className="grid gap-200 sm:grid-cols-2 lg:grid-cols-4">
          {contentModules.map((module) => (
            <li key={module.slug}>
              <Card className="h-full">
                <p className="text-caption-3 uppercase text-brand-gold">{module.eyebrow}</p>
                <h3 className="mt-100 text-heading-6 text-brand-forest">{module.shortTitle}</h3>
                <p className="mt-100 text-body-6 text-brand-muted">{module.description}</p>
                <div className="mt-200">
                  <Link href={module.href} className="interactive text-body-4 text-brand-primary hover:text-brand-primary-dark">
                    Open {module.shortTitle}
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
