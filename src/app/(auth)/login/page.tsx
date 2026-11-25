import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your Noor-e-Islam account.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const params = await searchParams;

  return (
    <div>
      <h1 className="text-heading-5 text-brand-forest">Welcome back</h1>
      <p className="mt-100 text-body-6 text-brand-muted">Sign in to manage bookmarks, reading lists and preferences.</p>
      {params.registered ? (
        <p className="mt-200 rounded-lg border border-brand-primary bg-state-hover px-100 py-100 text-body-6 text-brand-primary-dark" role="status">
          Account created. You can sign in now.
        </p>
      ) : null}
      <div className="mt-400"><LoginForm /></div>
      <p className="mt-300 text-body-6 text-brand-muted">
        New here? <Link href="/register" className="interactive text-body-4 text-brand-primary hover:text-brand-primary-dark">Create an account</Link>
      </p>
    </div>
  );
}
