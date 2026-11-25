import type { MetadataRoute } from "next";
import { env } from "@/lib/config/env";

const origin = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/admin"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
