import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@/components/content/DemoNotice";
import { FaqSection } from "@/components/content/FaqSection";
import { TaglineReveal } from "@/components/motion/TaglineReveal";
import { Reveal } from "@/components/motion/Reveal";
import { SearchBox } from "@/components/search/SearchBox";
import { ActionLink } from "@/components/ui/ActionLink";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Authentic Islamic Knowledge",
  description:
    "Discover a structured Islamic knowledge library for the Quran, Hadith, Dua, fundamentals, daily guidance and Prophetic teachings.",
};

const languages = ["Arabic", "English", "Hindi", "Urdu", "Roman Urdu"];
const fundamentals = ["Tawheed", "Iman", "Islam", "Ihsan", "Salah", "Zakat", "Sawm", "Hajj", "Halal and Haram"];
const dailyTopics = ["Family life", "Business ethics", "Cleanliness", "Personal conduct"];
const prophetGroups = ["Adam and Nuh", "Ibrahim and Musa", "Isa and Muhammad"];
const principles = [
  {
    title: "Source first",
    body: "Every published item is designed to carry a source, reference, license and reviewer record.",
  },
  {
    title: "Clear by design",
    body: "Canonical text, translation, transliteration and explanation remain separate and easy to compare.",
  },
  {
    title: "Built for every reader",
    body: "Navigation, language handling and accessible layout support learners across devices and scripts.",
  },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading" className="border-b border-brand-line bg-brand-ivory">
        <Container className="py-700 lg:py-800">
          <div className="grid items-center gap-600 lg:grid-cols-2">
            <Reveal>
              <Badge tone="green">Knowledge library foundation</Badge>
              <h1 id="hero-heading" className="hero-heading-text text-balance mt-300 max-w-prose text-heading-3 sm:text-heading-2 lg:text-heading-1">
                Discover reliable Islamic knowledge
              </h1>
              <p className="text-balance mt-300 max-w-prose text-title-2 text-brand-muted">
                Explore the Quran, Hadith, Dua and Islamic teachings through a clear, sourced and reference aware learning experience.
              </p>
              <div className="mt-400 flex flex-wrap items-center gap-200">
                <ActionLink href="/quran" variant="primary" size="lg">
                  Explore the Quran
                </ActionLink>
                <Link href="#all-modules-heading" className="interactive px-100 py-75 text-button-sm text-brand-primary hover:bg-state-hover">
                  Browse all modules
                </Link>
              </div>
              <p className="mt-300 text-caption-2 text-brand-muted">
                Every published item must pass source, reference, license and review checks.
              </p>
              <div className="mt-500 max-w-prose">
                <SearchBox />
              </div>
            </Reveal>

            <Reveal>
              <Card className="bg-brand-forest text-brand-surface">
                <p className="text-caption-3 uppercase text-brand-gold">Source first workflow</p>
                <h2 className="mt-200 text-heading-5">Evidence before publication</h2>
                <ul className="mt-300 grid gap-200">
                  <li className="rounded-lg border border-brand-surface/20 bg-brand-surface/5 px-200 py-100 text-body-6">
                    Canonical source record
                  </li>
                  <li className="rounded-lg border border-brand-surface/20 bg-brand-surface/5 px-200 py-100 text-body-6">
                    Translation provenance
                  </li>
                  <li className="rounded-lg border border-brand-surface/20 bg-brand-surface/5 px-200 py-100 text-body-6">
                    Qualified reviewer approval
                  </li>
                  <li className="rounded-lg border border-brand-surface/20 bg-brand-surface/5 px-200 py-100 text-body-6">
                    Versioned publication record
                  </li>
                </ul>
                <p className="mt-300 text-caption-2 text-brand-surface/70">
                  Demonstration build. No religious text is presented as verified content.
                </p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="quran" aria-label="Quran exploration" className="bg-brand-surface py-600">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Quran exploration"
              title="Begin with the primary source"
              description="A structured reading experience is planned around immutable Arabic text, separate licensed translations and clear reference records."
              action={<ActionLink href="/quran" variant="secondary" size="sm">Open Quran module</ActionLink>}
            />
            <div className="grid gap-300 lg:grid-cols-2">
              <Card>
                <p className="text-caption-3 uppercase text-brand-gold">Planned reading experience</p>
                <h3 className="mt-200 text-heading-5 text-brand-forest">Surah and Ayah navigation</h3>
                <p className="mt-200 text-body-3 text-brand-muted">
                  Each Ayah will carry canonical Arabic text, separate translations, transliteration where available, references and review status.
                </p>
                <ul className="mt-300 flex flex-wrap gap-100">
                  {languages.map((language) => <li key={language}><Badge>{language}</Badge></li>)}
                </ul>
              </Card>
              <Card className="bg-brand-ivory">
                <p className="text-caption-3 uppercase text-brand-gold">Integrity rule</p>
                <p className="mt-200 text-heading-6 text-brand-forest">
                  Canonical Quran text is immutable through ordinary editorial operations.
                </p>
                <p className="mt-200 text-body-6 text-brand-muted">
                  Translations and explanations are stored separately with provenance.
                </p>
              </Card>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="hadith" aria-label="Hadith library" className="border-y border-brand-line bg-brand-ivory py-600">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Hadith library"
              title="Narrations with traceable evidence"
              description="The model keeps collection, book, chapter, narrator and grading details together so a narration is never reduced to an isolated line."
              action={<ActionLink href="/hadith" variant="secondary" size="sm">Open Hadith module</ActionLink>}
            />
            <ul className="grid gap-200 md:grid-cols-3">
              {["Collection and book navigation", "Grading source and edition", "Narrator and explanation fields"].map((title, index) => (
                <li key={title}>
                  <Card className="h-full">
                    <p className="text-caption-3 text-brand-gold">0{index + 1}</p>
                    <h3 className="mt-200 text-title-2 text-brand-forest">{title}</h3>
                    <p className="mt-100 text-body-6 text-brand-muted">
                      Structure is in place. Verified content is added only after source approval.
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section id="dua" aria-label="Daily Dua" className="bg-brand-surface py-600">
        <Container>
          <Reveal>
            <div className="grid items-start gap-500 lg:grid-cols-2">
              <div>
                <SectionHeading
                  eyebrow="Daily Dua"
                  title="A respectful Dua library"
                  description="Arabic text, transliteration, translation, meaning, occasion and reference remain separate so nothing is shown without provenance."
                />
                <div className="mt-300 flex flex-wrap gap-200">
                  <ActionLink href="/dua" variant="secondary" size="sm">Open Dua module</ActionLink>
                  <DemoNotice compact />
                </div>
              </div>
              <Card className="bg-brand-ivory">
                <p className="text-caption-3 uppercase text-brand-gold">Display model</p>
                <dl className="mt-300 grid gap-200">
                  <div className="rounded-lg border border-brand-line bg-brand-surface px-200 py-100">
                    <dt className="text-title-4 text-brand-forest">Arabic</dt>
                    <dd className="mt-50 text-body-6 text-brand-muted">Canonical source field</dd>
                  </div>
                  <div className="rounded-lg border border-brand-line bg-brand-surface px-200 py-100">
                    <dt className="text-title-4 text-brand-forest">Transliteration</dt>
                    <dd className="mt-50 text-body-6 text-brand-muted">Rendering layer</dd>
                  </div>
                  <div className="rounded-lg border border-brand-line bg-brand-surface px-200 py-100">
                    <dt className="text-title-4 text-brand-forest">Translation</dt>
                    <dd className="mt-50 text-body-6 text-brand-muted">Licensed and reviewed</dd>
                  </div>
                  <div className="rounded-lg border border-brand-line bg-brand-surface px-200 py-100">
                    <dt className="text-title-4 text-brand-forest">Reference</dt>
                    <dd className="mt-50 text-body-6 text-brand-muted">Required before publication</dd>
                  </div>
                </dl>
              </Card>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="fundamentals" aria-label="Islamic fundamentals" className="border-y border-brand-line bg-brand-ivory py-600">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Islamic fundamentals"
              title="Learn the essentials step by step"
              description="Foundational topics are organized for new learners while preserving the distinction between Quranic text, Hadith, scholarly interpretation and editorial explanation."
              action={<ActionLink href="/concepts" variant="secondary" size="sm">Study concepts</ActionLink>}
            />
            <ul className="grid gap-100 sm:grid-cols-2 lg:grid-cols-3">
              {fundamentals.map((topic) => (
                <li key={topic}>
                  <Link href="/concepts" className="interactive block rounded-lg border border-brand-line bg-brand-surface px-200 py-100 text-body-5 text-brand-forest hover:border-brand-primary hover:bg-state-hover">
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section id="teachings" aria-label="Prophet teachings" className="bg-brand-surface py-600">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Prophet's teachings"
              title="Teachings rooted in Sunnah"
              description="Character, mercy, honesty, justice, family life and social responsibility will be presented with supporting Quranic and authentic Hadith references."
              action={<ActionLink href="/teachings" variant="secondary" size="sm">Explore teachings</ActionLink>}
            />
            <div className="grid gap-200 lg:grid-cols-2">
              <Card>
                <h3 className="text-heading-6 text-brand-forest">Character and manners</h3>
                <p className="mt-200 text-body-3 text-brand-muted">
                  A structured area for Sunnah, mercy, honesty, justice and conduct with clear evidence separation.
                </p>
              </Card>
              <Card>
                <h3 className="text-heading-6 text-brand-forest">Family and society</h3>
                <p className="mt-200 text-body-3 text-brand-muted">
                  Rights, responsibilities, neighbour relations and community conduct organized for practical study.
                </p>
              </Card>
            </div>
          </Reveal>
        </Container>
      </section>

      <section id="daily-life" aria-label="Daily life guidance" className="border-y border-brand-line bg-brand-ivory py-600">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Daily life guidance"
              title="Islam in everyday conduct"
              description="Family life, business ethics, cleanliness, eating, sleeping and time management will be organized into readable practical guidance."
              action={<ActionLink href="/daily-life" variant="secondary" size="sm">Open daily life</ActionLink>}
            />
            <ul className="grid gap-200 sm:grid-cols-2 lg:grid-cols-4">
              {dailyTopics.map((topic) => (
                <li key={topic}>
                  <Card className="h-full">
                    <h3 className="text-title-2 text-brand-forest">{topic}</h3>
                    <p className="mt-100 text-body-6 text-brand-muted">Planned guidance section</p>
                  </Card>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section id="myth-vs-fact" aria-label="Myth versus fact" className="bg-brand-surface py-600">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Myth vs Fact"
              title="Clarify questions with evidence"
              description="Established facts, scholarly differences and matters that need further investigation are presented as distinct categories."
              action={<ActionLink href="/myth-vs-fact" variant="secondary" size="sm">Browse clarifications</ActionLink>}
            />
            <Card className="bg-brand-ivory">
              <p className="text-title-3 text-brand-forest">Editorial rule</p>
              <p className="mt-100 text-body-3 text-brand-muted">
                Disputed matters are never presented as universally agreed. Scholarly context is shown where relevant.
              </p>
            </Card>
          </Reveal>
        </Container>
      </section>

      <section id="prophets" aria-label="Stories of Prophets" className="border-y border-brand-line bg-brand-ivory py-600">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Stories of Prophets"
              title="Narratives grounded in evidence"
              description="Prophet stories distinguish Quranic evidence, reliable Hadith and later historical narratives. Unverified details are not presented as established fact."
              action={<ActionLink href="/prophets" variant="secondary" size="sm">Explore stories</ActionLink>}
            />
            <ul className="grid gap-200 lg:grid-cols-3">
              {prophetGroups.map((group) => (
                <li key={group}>
                  <Card className="h-full">
                    <h3 className="text-title-2 text-brand-forest">{group}</h3>
                    <p className="mt-100 text-body-6 text-brand-muted">
                      Structured with introduction, Quranic references, authentic Hadith where applicable and key lessons.
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="tagline-heading" className="bg-brand-surface py-800">
        <Container>
          <Reveal>
            <p id="tagline-heading" className="mb-300 text-caption-3 uppercase text-brand-gold">Our standard</p>
            <TaglineReveal text="Learn with evidence. Understand with clarity." />
            <p className="mt-300 text-body-3 text-brand-muted">
              Knowledge is most useful when its source, meaning and limits are clear.
            </p>
          </Reveal>
        </Container>
      </section>

      <section id="about" aria-labelledby="about-heading" className="bg-brand-forest py-700 text-brand-surface">
        <Container>
          <Reveal>
            <div className="grid gap-500 lg:grid-cols-2">
              <div>
                <p className="text-caption-3 uppercase text-brand-gold">About Noor-e-Islam</p>
                <h2 id="about-heading" className="text-balance mt-200 max-w-prose text-heading-4 sm:text-heading-3">
                  A dependable Islamic knowledge library for life
                </h2>
                <p className="mt-300 max-w-prose text-body-3 text-brand-surface/75">
                  This foundation build establishes the architecture, design system, governance model and navigation required for a long term educational ecosystem.
                </p>
                <div className="mt-400">
                  <ActionLink href="/quran" variant="gold" size="md">Explore the Quran</ActionLink>
                </div>
              </div>
              <ul className="grid gap-200">
                {principles.map((principle) => (
                  <li key={principle.title} className="rounded-lg border border-brand-surface/20 bg-brand-surface/5 px-300 py-200">
                    <p className="text-title-3">{principle.title}</p>
                    <p className="mt-100 text-body-6 text-brand-surface/70">{principle.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>

      <FaqSection />
    </>
  );
}
