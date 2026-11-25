import { ActionLink } from "@/components/ui/ActionLink";

export function StatePanel({
  variant,
  title,
  description,
  action,
}: {
  variant: "empty" | "error" | "loading";
  title: string;
  description: string;
  action?: { href: string; label: string };
}) {
  const label = variant === "loading" ? "Loading" : variant === "error" ? "Error" : "Empty";

  return (
    <section className="rounded-xl border border-brand-line bg-brand-surface p-300" aria-label={label} aria-busy={variant === "loading" || undefined}>
      {variant === "loading" ? (
        <div className="grid gap-200" aria-hidden="true">
          <div className="h-200 w-2/3 animate-pulse rounded-md bg-state-hover" />
          <div className="h-100 w-full animate-pulse rounded-md bg-state-hover" />
          <div className="h-100 w-5/6 animate-pulse rounded-md bg-state-hover" />
        </div>
      ) : (
        <>
          <p className={`text-caption-3 uppercase ${variant === "error" ? "text-state-error" : "text-brand-gold"}`}>{label}</p>
          <h2 className="mt-100 text-heading-6 text-brand-forest">{title}</h2>
          <p className="mt-100 text-body-6 text-brand-muted">{description}</p>
          {action ? (
            <div className="mt-200">
              <ActionLink href={action.href} variant="secondary" size="sm">
                {action.label}
              </ActionLink>
            </div>
          ) : null}
        </>
      )}
      {variant === "error" ? <span className="sr-only" role="alert">{description}</span> : null}
    </section>
  );
}
