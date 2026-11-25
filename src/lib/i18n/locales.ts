import { z } from "zod";

export const LOCALES = [
  { code: "AR", label: "العربية", direction: "rtl", contentLanguage: true },
  { code: "HI", label: "हिन्दी", direction: "ltr", contentLanguage: true },
  { code: "UR", label: "اردو", direction: "rtl", contentLanguage: true },
  { code: "EN", label: "English", direction: "ltr", contentLanguage: true },
  { code: "UR_RO", label: "Roman Urdu", direction: "ltr", contentLanguage: false },
] as const;

export type LocaleCode = (typeof LOCALES)[number]["code"];

export const LOCALE_HTML: Record<LocaleCode, string> = {
  AR: "ar",
  HI: "hi",
  UR: "ur",
  EN: "en",
  UR_RO: "ur-Latn",
};

export const localeSchema = z.enum(["AR", "HI", "UR", "EN", "UR_RO"]);

export function getLocale(code: string) {
  return LOCALES.find((locale) => locale.code === code);
}

export function resolveLocale(code: string | null | undefined): LocaleCode {
  return getLocale(code ?? "")?.code ?? "EN";
}

export function isRtlLocale(code: string): boolean {
  return getLocale(code)?.direction === "rtl";
}

export function subscribeToLocale(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("langchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("langchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

export function getClientLocale(): LocaleCode {
  if (typeof window === "undefined") return "EN";
  return resolveLocale(new URLSearchParams(window.location.search).get("lang"));
}

export function getServerLocale(): LocaleCode {
  return "EN";
}

export function isAuthoritativeTranslationLocale(code: string): boolean {
  return code !== "AR" && code !== "UR_RO";
}
