import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const questions = [
  {
    question: "What is Noor-e-Islam?",
    answer:
      "Noor-e-Islam is an Islamic knowledge library organized around the Quran, Hadith, Dua, fundamentals, guidance, and learning stories. This foundation build presents the structure before verified content is added.",
  },
  {
    question: "Do I need an account to read?",
    answer:
      "No. Public learning pages are available without registration. An account is intended for bookmarks, reading lists, and progress features.",
  },
  {
    question: "Where does religious content come from?",
    answer:
      "Each published item requires a source record, reference details, license information, translation provenance, reviewer approval, and a version snapshot.",
  },
  {
    question: "Are Hadith grades shown with their evidence?",
    answer:
      "The model stores the grade, grader, grading source, edition, notes, and verification status as separate fields. A grade is never shown as an isolated claim.",
  },
  {
    question: "Is the current content ready for study?",
    answer:
      "No. Current records are demonstration only and are visibly labelled. Verified religious content will be added after licensing and qualified review.",
  },
  {
    question: "Which languages are planned?",
    answer:
      "The interface supports English, Arabic, Urdu, Hindi, and Roman Urdu query handling. Script specific font fallbacks protect Arabic, Urdu, and Devanagari readability.",
  },
  {
    question: "How are translations handled?",
    answer:
      "Translations, transliterations, explanations, and canonical Arabic text are stored separately so one layer cannot silently replace another.",
  },
  {
    question: "Can I report a correction?",
    answer:
      "A correction endpoint is available in this build. Reports are treated as evidence intake and never change published content directly.",
  },
];

export function FaqSection() {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });

  return (
    <section aria-label="Frequently asked questions" className="border-t border-brand-line bg-brand-surface py-600">
      <div className="mx-auto w-full max-w-content px-200 sm:px-300 lg:px-400">
        <SectionHeading
          eyebrow="Questions"
          title="Frequently asked questions"
          description="Clear answers about how the library is structured and how content is protected."
        />
        <Reveal>
          <dl className="grid gap-200">
            {questions.map((item) => (
              <details key={item.question} className="group rounded-lg border border-brand-line bg-brand-ivory p-200">
                <summary className="interactive cursor-pointer list-none text-title-3 text-brand-forest [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <dd className="mt-200 text-body-6 text-brand-muted">{item.answer}</dd>
              </details>
            ))}
          </dl>
        </Reveal>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      </div>
    </section>
  );
}
