"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { Logo } from "@/components/layout/Logo";
import { MobileNav } from "@/components/navigation/MobileNav";
import { SearchBox } from "@/components/search/SearchBox";
import { ActionLink } from "@/components/ui/ActionLink";
import { contentModules } from "@/modules/navigation/catalog";

function linkClass(active: boolean) {
  return `interactive rounded-md px-100 py-75 text-button-sm ${active ? "bg-state-active text-brand-primary-dark" : "text-brand-forest hover:bg-state-hover"}`;
}

export function SiteHeader() {
  const pathname = usePathname();
  const primary = contentModules.slice(0, 4);
  const secondary = contentModules.slice(4);

  return (
    <header className="fixed inset-x-0 top-200 z-40 px-200 sm:px-300" aria-label="Site header">
      <div className="mx-auto flex w-fit max-w-full items-center gap-200 rounded-2xl border border-brand-line bg-brand-ivory/90 p-100 shadow-floating backdrop-blur-lg">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-50 lg:flex">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={linkClass(pathname === "/")}>
            Home
          </Link>
          {primary.map((module) => (
            <Link
              key={module.slug}
              href={module.href}
              aria-current={pathname === module.href ? "page" : undefined}
              className={linkClass(pathname === module.href)}
            >
              {module.shortTitle}
            </Link>
          ))}
          <details className="relative">
            <summary className={`${linkClass(secondary.some((module) => pathname === module.href))} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
              More
            </summary>
            <div className="absolute end-0 top-500 w-60 rounded-lg border border-brand-line bg-brand-surface p-100 shadow-floating">
              <ul className="grid gap-50">
                {secondary.map((module) => (
                  <li key={module.slug}>
                    <Link
                      href={module.href}
                      aria-current={pathname === module.href ? "page" : undefined}
                      className={`interactive block rounded-md px-100 py-75 text-body-6 ${pathname === module.href ? "bg-state-active text-brand-primary-dark" : "text-brand-forest hover:bg-state-hover"}`}
                    >
                      {module.shortTitle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </nav>

        <div className="hidden items-center gap-100 lg:flex">
          <div className="w-48 xl:w-64">
            <SearchBox compact />
          </div>
          <LanguageSelector />
          <ActionLink href="/donate" variant="ghost" size="sm">
            Donate
          </ActionLink>
          <ActionLink href="/login" variant="secondary" size="sm">
            Login
          </ActionLink>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
