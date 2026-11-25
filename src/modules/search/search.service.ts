import { demoSearchDocuments } from "./search-index";
import type { SearchFilters, SearchHit } from "./types";

export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/['’ʼ`]/g, "")
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreDocument(queryTokens: readonly string[], title: string, body: string, aliases: string): number {
  let score = 0;

  for (const token of queryTokens) {
    if (title === token) score += 12;
    else if (title.startsWith(token)) score += 8;
    else if (title.includes(token)) score += 6;

    if (aliases.includes(token)) score += 7;
    else if (aliases.includes(` ${token} `)) score += 5;

    if (body.includes(token)) score += 2;
  }

  if (queryTokens.length > 1 && queryTokens.every((token) => title.includes(token) || body.includes(token) || aliases.includes(token))) {
    score += 10;
  }

  return score;
}

export function searchDemoContent(query: string, filters: SearchFilters = {}): SearchHit[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) {
    return [];
  }

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const limit = Math.min(Math.max(filters.limit ?? 10, 1), 20);

  return demoSearchDocuments
    .filter((document) => !filters.module || document.module === filters.module)
    .map((document) => ({
      document,
      score: scoreDocument(
        queryTokens,
        normalizeSearchText(document.title),
        normalizeSearchText(`${document.description} ${document.sourceLabel}`),
        normalizeSearchText(document.aliases.join(" ")),
      ),
    }))
    .filter((hit) => hit.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);
}
