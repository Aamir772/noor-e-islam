import { describe, expect, it } from "vitest";
import { normalizeSearchText, searchDemoContent } from "@/modules/search/search.service";

describe("search normalization", () => {
  it("removes Arabic diacritics without changing canonical storage", () => {
    expect(normalizeSearchText("قُرْآن")).toBe("قران");
  });

  it("normalizes punctuation and case", () => {
    expect(normalizeSearchText("Al-Qur'an")).toBe("al-quran");
  });

  it("finds demonstration records through Roman Urdu aliases", () => {
    const results = searchDemoContent("namaz");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.document.module).toBe("concepts");
    expect(results[0]?.document.isDemo).toBe(true);
  });

  it("applies module filters", () => {
    const results = searchDemoContent("dua", { module: "dua" });
    expect(results).toHaveLength(1);
    expect(results[0]?.document.module).toBe("dua");
  });

  it("returns no results for an empty query", () => {
    expect(searchDemoContent("   ")).toEqual([]);
  });
});
