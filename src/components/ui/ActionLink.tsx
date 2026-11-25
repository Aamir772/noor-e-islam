import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "onDark";

interface ActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand-primary text-brand-surface hover:bg-brand-primary-dark",
  secondary: "border border-brand-line bg-brand-surface text-brand-forest hover:border-brand-primary hover:bg-state-hover",
  ghost: "text-brand-primary hover:bg-state-hover",
  gold: "bg-brand-gold text-brand-surface hover:bg-brand-primary",
  onDark: "border border-brand-surface/30 bg-transparent text-brand-surface hover:bg-brand-surface/10",
};

const sizes: Record<"sm" | "md" | "lg", string> = {
  sm: "px-100 py-75 text-button-sm",
  md: "px-100 py-75 text-button-md",
  lg: "px-200 py-75 text-button-lg",
};

export function ActionLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ActionLinkProps) {
  return (
    <Link
      href={href}
      className={`interactive inline-flex items-center justify-center gap-100 rounded-md ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
