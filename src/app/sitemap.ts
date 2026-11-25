import type { MetadataRoute } from "next";
import { env } from "@/lib/config/env";

const origin = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

const publicPaths = [
  "",
  "/quran",
  "/hadith",
  "/teachings",
  "/daily-life",
  "/dua",
  "/concepts",
  "/myth-vs-fact",
  "/prophets",
  "/search",
  "/donate",
  "/login",
  "/register",
  "/forgot-password",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.map((path) => ({
    url: `${origin}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/donate" ? 0.5 : 0.7,
  }));
}
