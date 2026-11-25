import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { contentModules } from "@/modules/navigation/catalog";

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-line bg-brand-surface">
      <Container className="py-600">
        <div className="grid gap-500 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-200 max-w-prose text-body-6 text-brand-muted">
              A reference driven Islamic knowledge library designed for clarity and long term learning.
            </p>
          </div>

          <nav aria-label="Module links">
            <h2 id="all-modules-heading" className="text-caption-3 uppercase text-brand-forest">Explore</h2>
            <ul className="mt-200 grid gap-100">
              {contentModules.map((module) => (
                <li key={module.slug}>
                  <Link href={module.href} className="interactive text-body-6 text-brand-muted hover:text-brand-primary">
                    {module.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account links">
            <h2 className="text-caption-3 uppercase text-brand-forest">Account</h2>
            <ul className="mt-200 grid gap-100">
              <li><Link href="/login" className="interactive text-body-6 text-brand-muted hover:text-brand-primary">Login</Link></li>
              <li><Link href="/register" className="interactive text-body-6 text-brand-muted hover:text-brand-primary">Create account</Link></li>
              <li><Link href="/dashboard" className="interactive text-body-6 text-brand-muted hover:text-brand-primary">Dashboard</Link></li>
              <li><Link href="/donate" className="interactive text-body-6 text-brand-muted hover:text-brand-primary">Support the project</Link></li>
            </ul>
          </nav>

          <div>
            <h2 className="text-caption-3 uppercase text-brand-forest">Legal</h2>
            <ul className="mt-200 grid gap-100">
              <li><Link href="/privacy" className="interactive text-body-6 text-brand-muted hover:text-brand-primary">Privacy policy</Link></li>
              <li><Link href="/terms" className="interactive text-body-6 text-brand-muted hover:text-brand-primary">Terms of use</Link></li>
            </ul>
            <p className="mt-300 text-body-6 text-brand-muted">
              Published religious material requires source, reference, license and qualified reviewer approval.
            </p>
          </div>
        </div>

        <div className="mt-500 flex flex-col gap-100 border-t border-brand-line pt-300 text-caption-4 text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Noor-e-Islam. Foundation build.</p>
          <p>Demonstration content only. Not a public religious content release.</p>
        </div>
      </Container>
    </footer>
  );
}
