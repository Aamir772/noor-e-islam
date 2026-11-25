import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "onDark";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand-primary text-brand-surface hover:bg-brand-primary-dark",
  secondary: "border border-brand-line bg-brand-surface text-brand-forest hover:border-brand-primary hover:bg-state-hover",
  ghost: "text-brand-forest hover:bg-state-hover",
  gold: "bg-brand-gold text-brand-surface hover:bg-brand-primary",
  onDark: "border border-brand-surface/30 bg-transparent text-brand-surface hover:bg-brand-surface/10",
};

const sizes: Record<"sm" | "md" | "lg", string> = {
  sm: "px-100 py-75 text-button-sm",
  md: "px-100 py-75 text-button-md",
  lg: "px-200 py-75 text-button-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`interactive inline-flex items-center justify-center gap-100 rounded-md disabled:cursor-not-allowed disabled:bg-state-disabled disabled:text-brand-surface ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="h-200 w-200 animate-pulse rounded-full bg-current opacity-40" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
