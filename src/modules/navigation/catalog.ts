export const MODULE_SLUGS = [
  "quran",
  "hadith",
  "teachings",
  "daily-life",
  "dua",
  "concepts",
  "myth-vs-fact",
  "prophets",
] as const;

export type ModuleSlug = (typeof MODULE_SLUGS)[number];

export interface ContentModuleDescriptor {
  slug: ModuleSlug;
  title: string;
  shortTitle: string;
  description: string;
  href: string;
  eyebrow: string;
  topics: readonly string[];
}

export const contentModules: readonly ContentModuleDescriptor[] = [
  {
    slug: "quran",
    title: "The Quran",
    shortTitle: "Quran",
    description: "Navigate Surahs and Ayahs with translations and references from identified sources.",
    href: "/quran",
    eyebrow: "Primary source",
    topics: ["Surah navigation", "Ayah meanings", "Arabic source text", "Translation provenance", "Bookmarks and reading progress"],
  },
  {
    slug: "hadith",
    title: "Hadith Collections",
    shortTitle: "Hadith",
    description: "Study carefully sourced narrations with grading provenance and references.",
    href: "/hadith",
    eyebrow: "Authentic narrations",
    topics: ["Collection and book navigation", "Narrator details", "Grading with source provenance", "Explanation and references", "Search by collection and number"],
  },
  {
    slug: "teachings",
    title: "Prophet's Teachings",
    shortTitle: "Teachings",
    description: "Explore the Sunnah, character, mercy, honesty, justice, and social conduct.",
    href: "/teachings",
    eyebrow: "Sunnah and character",
    topics: ["Sunnah", "Character and manners", "Mercy and compassion", "Honesty and justice", "Family and social responsibility"],
  },
  {
    slug: "daily-life",
    title: "Daily Life Guidance",
    shortTitle: "Daily Life",
    description: "Practical Islamic guidance for family, work, cleanliness, and conduct.",
    href: "/daily-life",
    eyebrow: "Everyday practice",
    topics: ["Family life", "Business ethics", "Neighbourhood relations", "Cleanliness and personal conduct", "Time management"],
  },
  {
    slug: "dua",
    title: "Dua and Remembrance",
    shortTitle: "Dua",
    description: "Supplications with Arabic text, transliteration, meaning, and references.",
    href: "/dua",
    eyebrow: "Supplication",
    topics: ["Morning and evening duas", "Quranic supplications", "Duas from authentic Hadith", "Transliteration and meaning", "Occasions and references"],
  },
  {
    slug: "concepts",
    title: "Islamic Fundamentals",
    shortTitle: "Concepts",
    description: "Clear explanations of Tawheed, Iman, Islam, Ihsan, and worship.",
    href: "/concepts",
    eyebrow: "Foundations",
    topics: ["Tawheed", "Iman, Islam and Ihsan", "Salah and Zakat", "Sawm and Hajj", "Halal and Haram"],
  },
  {
    slug: "myth-vs-fact",
    title: "Myth vs Fact",
    shortTitle: "Myth vs Fact",
    description: "Evidence based explanations that distinguish facts from scholarly differences.",
    href: "/myth-vs-fact",
    eyebrow: "Clarifications",
    topics: ["Common misconceptions", "Quran-related questions", "Hadith-related questions", "Scholarly differences", "Evidence and further study"],
  },
  {
    slug: "prophets",
    title: "Stories of the Prophets",
    shortTitle: "Prophets",
    description: "Prophet stories grounded in Quranic evidence and reliable narrations.",
    href: "/prophets",
    eyebrow: "Lessons and history",
    topics: ["Adam and Nuh", "Ibrahim and Musa", "Isa and Muhammad", "Quranic evidence", "Key lessons and related topics"],
  },
];

export function getModuleDescriptor(slug: ModuleSlug): ContentModuleDescriptor {
  const descriptor = contentModules.find((module) => module.slug === slug);
  if (!descriptor) {
    throw new Error(`Unknown content module: ${slug}`);
  }
  return descriptor;
}
