import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { LocaleEffects } from "@/components/layout/LocaleEffects";
import { env } from "@/lib/config/env";
import { isRtlLocale, LOCALE_HTML, resolveLocale } from "@/lib/i18n/locales";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: "Noor-e-Islam | Authentic Islamic Knowledge",
    template: "%s | Noor-e-Islam",
  },
  description:
    "Explore a structured Islamic knowledge library for the Quran, Hadith, Dua, fundamentals, and daily guidance.",
  applicationName: "Noor-e-Islam",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Noor-e-Islam",
    title: "Noor-e-Islam | Authentic Islamic Knowledge",
    description: "A reference driven Islamic knowledge library built for clarity and long term learning.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Noor-e-Islam wordmark" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noor-e-Islam | Authentic Islamic Knowledge",
    description: "A reference driven Islamic knowledge library built for clarity and long term learning.",
    images: ["/og-image.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#075B46",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = resolveLocale(requestHeaders.get("x-noor-locale"));

  return (
    <html lang={LOCALE_HTML[locale]} dir={isRtlLocale(locale) ? "rtl" : "ltr"} data-locale={locale}>
      <body className={GeistSans.variable}>
        <LocaleEffects />
        {children}
      </body>
    </html>
  );
}
