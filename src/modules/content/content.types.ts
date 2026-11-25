export const CONTENT_TYPES = [
  "AYAH",
  "HADITH",
  "DUA",
  "TEACHING",
  "ARTICLE",
  "CONCEPT",
  "MYTH_FACT",
  "PROPHET_STORY",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_STATUSES = [
  "DRAFT",
  "TRANSLATED",
  "REFERENCED",
  "REVIEWED",
  "APPROVED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const TEXT_VARIANT_TYPES = ["SOURCE", "TRANSLATION", "TRANSLITERATION"] as const;
export type TextVariantType = (typeof TEXT_VARIANT_TYPES)[number];
