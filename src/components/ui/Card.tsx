import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`rounded-xl border border-brand-line bg-brand-surface p-200 shadow-card ${className}`}>
      {children}
    </article>
  );
}
