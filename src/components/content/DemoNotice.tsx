export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={`rounded-lg border border-brand-gold bg-brand-ivory text-brand-forest ${compact ? "px-200 py-100" : "px-300 py-200"}`}
      aria-label="Demonstration content notice"
    >
      <p className="text-body-4">Demonstration content</p>
      <p className="mt-100 text-body-6 text-brand-muted">
        This page shows layout and information architecture only. No Quranic verses, Hadith, translations, or authenticity grades have been added.
      </p>
    </aside>
  );
}
