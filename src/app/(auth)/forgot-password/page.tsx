import type { Metadata } from "next";
import Link from "next/link";
import { DemoNotice } from "@/components/content/DemoNotice";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Password recovery is not yet connected to an email provider.",
};

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-heading-5 text-brand-forest">Reset password</h1>
      <p className="mt-100 text-body-6 text-brand-muted">Secure password recovery requires an email provider and verified sender configuration.</p>
      <div className="mt-400"><DemoNotice compact /></div>
      <p className="mt-300 text-body-6">
        <Link href="/login" className="interactive text-body-4 text-brand-primary hover:text-brand-primary-dark">Return to login</Link>
      </p>
    </div>
  );
}
