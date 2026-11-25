"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { ActionLink } from "@/components/ui/ActionLink";
import { SearchBox } from "@/components/search/SearchBox";
import { contentModules } from "@/modules/navigation/catalog";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const openButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const trigger = openButton.current;
    closeButton.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={openButton}
        type="button"
        className="interactive flex h-500 w-500 items-center justify-center rounded-md border border-brand-line text-brand-forest lg:hidden"
        aria-label="Open navigation"
        aria-expanded={open}
        aria-controls="mobile-navigation-panel"
        onClick={() => setOpen(true)}
      >
        <span className="relative block h-200 w-200" aria-hidden="true">
          <span className="absolute inset-x-0 top-50 h-25 bg-current transition-transform duration-base ease-brand" />
          <span className="absolute inset-x-0 bottom-50 h-25 bg-current transition-transform duration-base ease-brand" />
        </span>
      </button>

      <div
        id="mobile-navigation-panel"
        className={`fixed inset-0 z-50 bg-brand-ivory/95 backdrop-blur-lg transition-opacity duration-base ease-brand lg:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="flex h-full flex-col overflow-y-auto px-200 py-200">
          <div className="flex items-center justify-between gap-200">
            <p className="text-title-3 text-brand-forest">Noor-e-Islam</p>
            <button
              ref={closeButton}
              type="button"
              className="interactive flex h-500 w-500 items-center justify-center rounded-md border border-brand-line text-brand-forest"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <span className="relative block h-200 w-200" aria-hidden="true">
                <span className="absolute inset-x-0 top-1/2 h-25 rotate-45 bg-current" />
                <span className="absolute inset-x-0 top-1/2 h-25 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav aria-label="Mobile navigation" className="mt-300 flex-1">
            <ul className="grid gap-100">
              <li>
                <Link
                  href="/"
                  aria-current={pathname === "/" ? "page" : undefined}
                  tabIndex={open ? 0 : -1}
                   className={`interactive block rounded-lg px-100 py-75 text-title-2 ${pathname === "/" ? "bg-state-active text-brand-primary-dark" : "text-brand-forest hover:bg-state-hover"} ${open ? "translate-y-0 opacity-100" : "translate-y-300 opacity-0"}`}
                   onClick={() => setOpen(false)}

                >
                  Home
                </Link>
              </li>
               {contentModules.map((module) => (

                <li key={module.slug}>
                  <Link
                    href={module.href}
                    aria-current={pathname === module.href ? "page" : undefined}
                    tabIndex={open ? 0 : -1}
                     className={`interactive block rounded-lg px-100 py-75 text-title-2 ${pathname === module.href ? "bg-state-active text-brand-primary-dark" : "text-brand-forest hover:bg-state-hover"} ${open ? "translate-y-0 opacity-100" : "translate-y-300 opacity-0"}`}
                     onClick={() => setOpen(false)}

                  >
                    {module.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-300 grid gap-200 border-t border-brand-line pt-200">
            <SearchBox compact />
            <div className="flex flex-wrap items-center gap-100">
              <LanguageSelector />
              <ActionLink href="/donate" variant="ghost" size="sm" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                Donate
              </ActionLink>
              <ActionLink href="/login" variant="secondary" size="sm" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
                Login
              </ActionLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
