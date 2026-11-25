import type { ModuleSlug } from "@/modules/navigation/catalog";

export interface DemoSearchDocument {
  id: string;
  module: ModuleSlug;
  title: string;
  description: string;
  sourceLabel: string;
  aliases: readonly string[];
  isDemo: true;
}

export interface SearchFilters {
  module?: ModuleSlug;
  limit?: number;
}

export interface SearchHit {
  document: DemoSearchDocument;
  score: number;
}
