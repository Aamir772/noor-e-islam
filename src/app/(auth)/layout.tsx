import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-ivory">
      <header className="border-b border-brand-line bg-brand-surface">
        <Container className="flex h-700 items-center justify-between">
          <Logo />
          <Link href="/" className="interactive text-body-5 text-brand-muted hover:text-brand-primary">Back to home</Link>
        </Container>
      </header>
      <main className="flex flex-1 items-center justify-center px-200 py-600">
        <div className="w-full max-w-md rounded-xl border border-brand-line bg-brand-surface p-300 shadow-floating">{children}</div>
      </main>
    </div>
  );
}
