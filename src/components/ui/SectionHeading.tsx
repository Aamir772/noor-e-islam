import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-400 flex flex-col gap-200 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-prose">
        {eyebrow ? <p className="mb-100 text-caption-3 uppercase text-brand-gold">{eyebrow}</p> : null}
        <h2 className="text-heading-4 text-brand-forest sm:text-heading-3">{title}</h2>
        {description ? <p className="mt-200 text-body-3 text-brand-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
