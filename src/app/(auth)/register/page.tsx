import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a Noor-e-Islam account for bookmarks and reading progress.",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="text-heading-5 text-brand-forest">Create your account</h1>
      <p className="mt-100 text-body-6 text-brand-muted">Registration is optional. All public knowledge remains available to guests.</p>
      <div className="mt-400"><RegisterForm /></div>
      <p className="mt-300 text-body-6 text-brand-muted">
        Already registered? <Link href="/login" className="interactive text-body-4 text-brand-primary hover:text-brand-primary-dark">Sign in</Link>
      </p>
    </div>
  );
}
