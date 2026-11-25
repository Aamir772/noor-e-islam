import { z } from "zod";

const environmentSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  AUTH_TRUST_HOST: z.enum(["true", "false"]).default("true"),
  TRUST_PROXY: z.enum(["true", "false"]).default("false"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  CSRF_ALLOWED_ORIGINS: z.string().optional(),
  RATE_LIMIT_BACKEND: z.enum(["memory", "postgres"]).default("memory"),
  SESSION_MAX_AGE_SECONDS: z.coerce.number().int().min(300).max(86_400).default(28_800),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

export const env = environmentSchema.parse(process.env);

const placeholderPatterns = [
  /replace[_-]?me/i,
  /replace_with/i,
  /change[_-]?me/i,
  /dev[_-]?only/i,
  /example/i,
  /^your[-_]/i,
  /localhost/i,
];

function isPlaceholder(value: string | undefined): boolean {
  return !value || placeholderPatterns.some((pattern) => pattern.test(value));
}

function parseOriginList(value: string | undefined): URL[] {
  if (!value) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .flatMap((item) => {
      try {
        return [new URL(item)];
      } catch {
        return [];
      }
    });
}

export function getCsrfAllowedOrigins(): URL[] {
  return [...parseOriginList(env.CSRF_ALLOWED_ORIGINS), new URL(env.NEXT_PUBLIC_APP_URL)];
}

export function assertProductionSecrets(): void {
  if (env.NODE_ENV !== "production") {
    return;
  }

  const missing: string[] = [];
  if (!env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!env.AUTH_SECRET) missing.push("AUTH_SECRET");
  if (process.env.AUTH_TRUST_HOST === undefined) missing.push("AUTH_TRUST_HOST");
  if (process.env.TRUST_PROXY === undefined) missing.push("TRUST_PROXY");
  if (!env.CSRF_ALLOWED_ORIGINS) missing.push("CSRF_ALLOWED_ORIGINS");
  if (env.RATE_LIMIT_BACKEND !== "postgres") missing.push("RATE_LIMIT_BACKEND=postgres");

  const invalid: string[] = [];
  if (isPlaceholder(env.DATABASE_URL)) invalid.push("DATABASE_URL");
  if (isPlaceholder(env.AUTH_SECRET)) invalid.push("AUTH_SECRET");
  if (isPlaceholder(env.NEXT_PUBLIC_APP_URL)) invalid.push("NEXT_PUBLIC_APP_URL");
  if (getCsrfAllowedOrigins().length < 2) invalid.push("CSRF_ALLOWED_ORIGINS");

  if (missing.length > 0 || invalid.length > 0) {
    const details = [
      missing.length ? `Missing: ${missing.join(", ")}` : "",
      invalid.length ? `Placeholder or invalid: ${invalid.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("; ");
    throw new Error(`Unsafe production configuration. ${details}`);
  }
}
