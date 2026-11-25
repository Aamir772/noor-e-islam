import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-content px-200 sm:px-300 lg:px-400 ${className}`}>{children}</div>;
}
