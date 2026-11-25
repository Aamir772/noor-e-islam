"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password. Check your details and try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-300" noValidate>
      <div>
        <label htmlFor="email" className="text-body-4 text-brand-forest">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="interactive mt-100 w-full rounded-lg border border-brand-line bg-brand-ivory px-100 py-100 text-body-6 hover:border-brand-primary focus:border-brand-primary"
        />
      </div>
      <div>
        <label htmlFor="password" className="text-body-4 text-brand-forest">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="interactive mt-100 w-full rounded-lg border border-brand-line bg-brand-ivory px-100 py-100 text-body-6 hover:border-brand-primary focus:border-brand-primary"
        />
      </div>
      {error ? (
        <p role="alert" className="rounded-lg border border-state-error bg-state-error-surface px-100 py-100 text-body-6 text-state-error">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={isLoading} loading={isLoading} className="w-full">
        {isLoading ? "Signing in" : "Sign in"}
      </Button>
    </form>
  );
}
