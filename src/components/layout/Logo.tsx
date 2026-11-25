import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="interactive group flex items-center gap-100 rounded-md" aria-label="Noor-e-Islam home">
      <svg
        viewBox="0 0 48 48"
        className="h-500 w-500 shrink-0 text-brand-primary transition-transform duration-base ease-brand group-hover:rotate-3"
        aria-hidden="true"
      >
        <path
          d="M24 3.5 29.4 13l10.8-1.4-4.4 9.9 7.7 7.6-10.8 2.4-.7 10.9-8-7.3-8 7.3-.7-10.9L5.5 29.1l7.7-7.6-4.4-9.9L19.6 13 24 3.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="24" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
      </svg>
      {!compact ? (
        <span className="flex flex-col leading-tight">
          <span className="text-title-3 text-brand-forest">Noor-e-Islam</span>
          <span className="text-caption-3 uppercase text-brand-gold">Knowledge and light</span>
        </span>
      ) : null}
    </Link>
  );
}
