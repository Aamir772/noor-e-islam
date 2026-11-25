import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const css = readFileSync(fileURLToPath(new URL("../../src/app/globals.css", import.meta.url)), "utf8");

describe("design tokens", () => {
  it("defines the official brand palette", () => {
    expect(css).toContain("--color-brand-primary: #075b46");
    expect(css).toContain("--color-brand-forest: #123c32");
    expect(css).toContain("--color-brand-gold: #c6a45a");
    expect(css).toContain("--color-brand-ivory: #f8f6ef");
    expect(css).toContain("--color-brand-charcoal: #242923");
  });

  it("uses Geist and script specific fallbacks without banned fonts", () => {
    expect(css).toContain("--font-geist-sans");
    expect(css).toContain("Noto Naskh Arabic");
    expect(css).toContain("Noto Nastaliq Urdu");
    expect(css).toContain("Noto Sans Devanagari");
    expect(css).not.toContain("Roboto");
    expect(css).not.toContain("Arial");
    expect(css).not.toContain("Helvetica");
  });

  it("defines the approved spacing scale", () => {
    for (const token of [0, 25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      expect(css).toContain(`--spacing-${token}:`);
    }
  });

  it("defines named text styles and component states", () => {
    for (const style of ["heading-1", "heading-6", "title-3", "body-3", "button-md", "caption-5"]) {
      expect(css).toContain(`--text-${style}:`);
    }
    for (const state of ["hover", "active", "disabled", "error"]) {
      expect(css).toContain(`--color-state-${state}:`);
    }
  });

  it("defines the motion system without browser default curves", () => {
    expect(css).toContain("cubic-bezier(0.22, 1, 0.36, 1)");
    expect(css).toContain("--duration-reveal: 700ms");
    expect(css).not.toContain("ease-in-out");
  });

  it("keeps backgrounds flat and permits text gradients only", () => {
    expect(css).toContain(".hero-heading-text");
    expect(css).toContain("background-clip: text");
    expect(css).not.toContain("background-image: radial-gradient");
    expect(css).not.toContain("background-image: linear-gradient(180deg");
  });
});
