"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name || undefined, email, password }),
    });

    const payload: unknown = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "error" in payload && payload.error && typeof payload.error === "object" && "message" in payload.error && typeof payload.error.message === "string"
          ? payload.error.message
          : "Registration failed. Check your details and try again.";
      setError(message);
      return;
    }

    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-300" noValidate>
      <div>
        <label htmlFor="name" className="text-body-4 text-brand-forest">Name, optional</label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={80}
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="interactive mt-100 w-full rounded-lg border border-brand-line bg-brand-ivory px-100 py-100 text-body-6 hover:border-brand-primary focus:border-brand-primary"
        />
      </div>
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
          maxLength={128}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="interactive mt-100 w-full rounded-lg border border-brand-line bg-brand-ivory px-100 py-100 text-body-6 hover:border-brand-primary focus:border-brand-primary"
        />
        <p className="mt-100 text-caption-2 text-brand-muted">Use at least 8 characters.</p>
      </div>
      {error ? (
        <p role="alert" className="rounded-lg border border-state-error bg-state-error-surface px-100 py-100 text-body-6 text-state-error">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={isLoading} loading={isLoading} className="w-full">
        {isLoading ? "Creating account" : "Create account"}
      </Button>
    </form>
  );
}
