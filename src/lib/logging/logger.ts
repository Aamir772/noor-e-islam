import { env } from "@/lib/config/env";

const sensitiveKeyPattern = /password|secret|token|cookie|authorization|api[-_]?key|credential/i;

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        sensitiveKeyPattern.test(key) ? "[REDACTED]" : redact(entry),
      ]),
    );
  }

  return value;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

const levelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export function log(level: LogLevel, message: string, context: Record<string, unknown> = {}): void {
  if (levelOrder[level] < levelOrder[env.LOG_LEVEL]) {
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context: redact(context),
  };

  const output = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  output(JSON.stringify(entry));
}
