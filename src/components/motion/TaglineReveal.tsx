"use client";

import { useEffect, useRef } from "react";

export function TaglineReveal({ text }: { text: string }) {
  const words = text.split(" ");
  const refs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const nodes = refs.current.filter((node): node is HTMLSpanElement => node !== null);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      for (const node of nodes) node.classList.add("is-active");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.75, rootMargin: "0px 0px -12% 0px" },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [text]);

  return (
    <p className="text-balance max-w-prose text-heading-3 text-brand-forest sm:text-heading-2" aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          ref={(node) => {
            refs.current[index] = node;
          }}
          className="tagline-word inline-block"
          aria-hidden="true"
        >
          {word}
          {index < words.length - 1 ? "\u00a0" : ""}
        </span>
      ))}
    </p>
  );
}
