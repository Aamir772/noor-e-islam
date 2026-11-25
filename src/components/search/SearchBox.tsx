export function SearchBox({ compact = false, defaultValue = "" }: { compact?: boolean; defaultValue?: string }) {
  return (
    <form action="/search" method="get" role="search" className={compact ? "w-full" : "w-full max-w-prose"}>
      <label htmlFor={compact ? "header-search" : "page-search"} className="sr-only">
        Search Noor-e-Islam
      </label>
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute start-100 top-1/2 h-200 w-200 -translate-y-1/2 text-brand-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={compact ? "header-search" : "page-search"}
          name="q"
          type="search"
          required
          maxLength={120}
          defaultValue={defaultValue}
          placeholder={compact ? "Search" : "Search Quran, Hadith, Dua and topics"}
          className="interactive w-full rounded-lg border border-brand-line bg-brand-surface py-75 ps-400 pe-100 text-body-6 text-brand-charcoal placeholder:text-brand-muted hover:border-brand-primary focus:border-brand-primary"
        />
      </div>
    </form>
  );
}
