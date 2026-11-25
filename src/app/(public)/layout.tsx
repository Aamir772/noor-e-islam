import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-400 focus:top-400 focus:z-50 focus:rounded-md focus:bg-brand-primary focus:px-200 focus:py-100 focus:text-button-sm focus:text-brand-surface"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1 pt-800">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
