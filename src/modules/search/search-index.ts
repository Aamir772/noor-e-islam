import { contentModules } from "@/modules/navigation/catalog";
import type { DemoSearchDocument } from "./types";

const aliasesByModule: Record<string, readonly string[]> = {
  quran: ["quran", "koran", "قرآن", "कुरान", "kur'an"],
  hadith: ["hadith", "hadis", "حديث", "हदीस", "hadees"],
  teachings: ["sunnah", "seerat", "character", "akhlaq", "अखलाक़"],
  "daily-life": ["adab", "manners", "ethics", "rozmarra", "रोज़मर्रा"],
  dua: ["dua", "duaa", "دعا", "प्रार्थना", "fardua"],
  concepts: ["tawheed", "iman", "islam", "ihsan", "salah", "namaz", "zakat", "sawm", "roza", "hajj"],
  "myth-vs-fact": ["misconception", "misunderstanding", "fact", "myth", "shubha"],
  prophets: ["prophet", "nabi", "rasool", "payambar", "पैगंबर", "ansar"],
};

export const demoSearchDocuments: readonly DemoSearchDocument[] = contentModules.map((module) => ({
  id: `demo-${module.slug}`,
  module: module.slug,
  title: module.title,
  description: module.description,
  sourceLabel: "Demonstration record — no verified religious text loaded",
  aliases: aliasesByModule[module.slug] ?? [],
  isDemo: true,
}));
