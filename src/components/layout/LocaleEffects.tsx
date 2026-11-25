"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isRtlLocale, LOCALE_HTML, resolveLocale } from "@/lib/i18n/locales";

export function LocaleEffects() {
  const pathname = usePathname();

  useEffect(() => {
    function apply(code: string | null) {
      const locale = resolveLocale(code);
      document.documentElement.lang = LOCALE_HTML[locale];
      document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
      document.documentElement.dataset.locale = locale;
    }

    function readLocation() {
      apply(new URLSearchParams(window.location.search).get("lang"));
    }

    function handleLangChange(event: Event) {
      apply((event as CustomEvent<string>).detail);
    }

    readLocation();
    window.addEventListener("langchange", handleLangChange);
    window.addEventListener("popstate", readLocation);

    return () => {
      window.removeEventListener("langchange", handleLangChange);
      window.removeEventListener("popstate", readLocation);
    };
  }, [pathname]);

  return null;
}
