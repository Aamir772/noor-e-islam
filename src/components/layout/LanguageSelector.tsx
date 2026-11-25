"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getClientLocale,
  getServerLocale,
  subscribeToLocale,
  type LocaleCode,
  LOCALES,
} from "@/lib/i18n/locales";

export function LanguageSelector() {
  const router = useRouter();
  const locale = useSyncExternalStore(subscribeToLocale, getClientLocale, getServerLocale);

  return (
    <label className="relative flex items-center">
      <span className="sr-only">Select language</span>
      <select
        value={locale}
        aria-label="Select language"
        onChange={(event) => {
          const nextLocale = event.target.value as LocaleCode;
          window.dispatchEvent(new CustomEvent<string>("langchange", { detail: nextLocale }));
          router.replace(`${window.location.pathname}?lang=${nextLocale}`);
        }}
        className="interactive rounded-md border border-brand-line bg-brand-surface px-100 py-75 text-button-sm text-brand-forest hover:border-brand-primary"
      >
        {LOCALES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
