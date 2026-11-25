import type { ReactNode } from "react";

type Tone = "neutral" | "gold" | "green" | "error";

const tones: Record<Tone, string> = {
  neutral: "border-brand-line bg-brand-surface text-brand-muted",
  gold: "border-brand-gold bg-brand-ivory text-brand-forest",
  green: "border-brand-primary bg-state-hover text-brand-primary-dark",
  error: "border-state-error bg-state-error-surface text-state-error",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-100 py-50 text-caption-3 ${tones[tone]}`}>
      {children}
    </span>
  );
}
