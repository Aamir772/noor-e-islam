import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@/components/content/DemoNotice";
import { Reveal } from "@/components/motion/Reveal";
import { SearchBox } from "@/components/search/SearchBox";
import { ActionLink } from "@/components/ui/ActionLink";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { StatePanel } from "@/components/ui/StatePanel";
import { contentModules } from "@/modules/navigation/catalog";
import { searchDemoContent } from "@/modules/search/search.service";
import { searchQuerySchema } from "@/server/validators/search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search across Noor-e-Islam modules, references and clearly labelled demonstration records.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[]; module?: string | string[] }>;
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const rawQuery = firstValue(params.q) ?? "";
  const parsed = searchQuerySchema.safeParse({
    q: rawQuery,
    module: firstValue(params.module) ?? undefined,
    limit: 10,
  });

  const hits = parsed.success ? searchDemoContent(parsed.data.q, { module: parsed.data.module, limit: parsed.data.limit }) : [];
  const activeModule = parsed.success ? parsed.data.module : undefined;

  return (
    <Container className="py-600">
      <Reveal>
        <div className="max-w-prose">
          <p className="mb-100 text-caption-3 uppercase text-brand-gold">Search and discovery</p>
          <h1 className="text-heading-3 text-brand-forest sm:text-heading-2">Find knowledge across modules</h1>
          <p className="mt-300 text-body-3 text-brand-muted">
            Search is intentionally limited to demonstration records in this foundation build.
          </p>
          <div className="mt-400">
            <SearchBox defaultValue={rawQuery} />
          </div>
        </div>
      </Reveal>

      <nav aria-label="Filter search by module" className="mt-400 flex flex-wrap gap-100">
        <Link
          href={rawQuery ? `/search?q=${encodeURIComponent(rawQuery)}` : "/search"}
          aria-current={!activeModule ? "page" : undefined}
          className={`interactive rounded-full border px-200 py-100 text-button-sm ${!activeModule ? "border-brand-primary bg-state-active text-brand-primary-dark" : "border-brand-line bg-brand-surface text-brand-muted hover:border-brand-primary"}`}
        >
          All modules
        </Link>
        {contentModules.map((module) => (
          <Link
            key={module.slug}
            href={`/search?q=${encodeURIComponent(rawQuery)}&module=${module.slug}`}
            aria-current={activeModule === module.slug ? "page" : undefined}
            className={`interactive rounded-full border px-200 py-100 text-button-sm ${activeModule === module.slug ? "border-brand-primary bg-state-active text-brand-primary-dark" : "border-brand-line bg-brand-surface text-brand-muted hover:border-brand-primary"}`}
          >
            {module.shortTitle}
          </Link>
        ))}
      </nav>

      <div className="mt-500 grid gap-400 lg:grid-cols-3">
        <section aria-label="Search results" aria-live="polite" className="lg:col-span-2">
          {!rawQuery ? (
            <StatePanel
              variant="empty"
              title="Start with a search term"
              description="Try a module name, a topic, Dua or Hadith to see demonstration results."
            />
          ) : !parsed.success ? (
            <StatePanel
              variant="error"
              title="Search query is invalid"
              description="Use between 1 and 120 characters and choose a valid module filter."
              action={{ href: "/search", label: "Clear search" }}
            />
          ) : hits.length === 0 ? (
            <StatePanel
              variant="empty"
              title="No demonstration results found"
              description="Try a broader term or remove the module filter."
              action={{ href: "/search", label: "Start again" }}
            />
          ) : (
            <ul className="grid gap-200">
              {hits.map((hit) => (
                <li key={hit.document.id} className="rounded-xl border border-brand-line bg-brand-surface p-300">
                  <div className="flex flex-wrap gap-100">
                    <Badge tone="green">{hit.document.module.replace("-", " ")}</Badge>
                    <Badge>Demonstration only</Badge>
                  </div>
                  <h2 className="mt-200 text-heading-6 text-brand-forest">
                    <ActionLink href={contentModules.find((module) => module.slug === hit.document.module)?.href ?? "/"} variant="ghost" size="sm" className="px-0">
                      {hit.document.title}
                    </ActionLink>
                  </h2>
                  <p className="mt-100 text-body-6 text-brand-muted">{hit.document.description}</p>
                  <p className="mt-200 text-caption-3 text-brand-gold">{hit.document.sourceLabel}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside aria-label="Search notes" className="grid content-start gap-300">
          <DemoNotice compact />
          <div className="rounded-xl border border-brand-line bg-brand-surface p-200">
            <h2 className="text-title-3 text-brand-forest">Search architecture</h2>
            <p className="mt-100 text-body-6 text-brand-muted">
              Canonical religious text is never normalized in place. Search normalization, aliases and transliteration variants are kept separate.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
