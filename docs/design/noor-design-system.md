# Noor-e-Islam Design System

This document is the concrete implementation reference derived from `docs/design/landing-page-design.md`. The source skill is mandatory. Where this platform has a stricter religious content rule, that rule wins. Where the official brand colors are supplied by the user, they replace the generic dark mode palette.

## 1. Design intent

Noor-e-Islam is an educational discovery platform, not a commercial conversion funnel. The homepage helps visitors find reliable Islamic knowledge and understand how content is sourced, reviewed, and organized. The primary action is **Explore the Quran**. Every module remains reachable through secondary navigation.

Page outline used for the homepage:

1. Navigation
2. Hero
3. Quran exploration
4. Hadith library
5. Daily Dua
6. Islamic fundamentals
7. Prophet's teachings
8. Daily life guidance
9. Myth vs Fact
10. Stories of Prophets
11. Independent tagline reveal
12. About Noor-e-Islam
13. FAQ
14. Footer

Layout choice: classic hero plus sections. The content is understandable from a hero card, and the audience needs a guided tour of multiple knowledge modules. The tagline reveal sits after Myth vs Fact and before About so it is a distinct moment rather than an extension of the hero.

## 2. Brand system

| Token | Value | Use |
|---|---:|---|
| `brand-primary` | `#075B46` | Primary actions, active states, links |
| `brand-forest` | `#123C32` | Dark surfaces, headings on light surfaces |
| `brand-gold` | `#C6A45A` | Restrained accents and metadata |
| `brand-ivory` | `#F8F6EF` | Page background |
| `brand-charcoal` | `#242923` | Primary body text |

Derived tokens are declared once in CSS and must not be invented in components.

## 3. Typography

Primary Latin interface font: **Geist**, loaded locally through the `geist` package. No Inter, Roboto, Arial, Open Sans, or Helvetica. No italic styling. No ultra bold weights. Maximum weight is semibold or bold.

Script specific fallbacks are mandatory and must not be replaced by a single Latin font:

| Script | Fallback stack |
|---|---|
| Arabic | Noto Naskh Arabic, Amiri, Geeza Pro, Traditional Arabic |
| Urdu | Noto Nastaliq Urdu, Jameel Noori Nastaleeq, Geeza Pro |
| Devanagari | Noto Sans Devanagari, Mangal, Nirmala UI |

Canonical Arabic text is rendered with the Arabic stack and is never rewritten for styling or search normalization.

All text uses named style classes generated from tokens:

- `text-heading-1` through `text-heading-6`
- `text-title-1` through `text-title-5`
- `text-body-1` through `text-body-6`
- `text-button-lg`, `text-button-md`, `text-button-sm`, `text-button-xsm`
- `text-caption-1` through `text-caption-5`

Headings use `text-wrap: balance`. Body copy uses `text-wrap: pretty`. Write in sentence case. Avoid hyphens inside new copy except the official brand name and established module names. Avoid orphans by using capped line lengths and meaningful line breaks in the hero and tagline.

## 4. Spacing

Allowed spacing values only:

`0`, `2px`, `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `40px`, `48px`, `64px`, `80px`, `96px`.

Tailwind token names:

`spacing-0`, `spacing-25`, `spacing-50`, `spacing-75`, `spacing-100`, `spacing-200`, `spacing-300`, `spacing-400`, `spacing-500`, `spacing-600`, `spacing-700`, `spacing-800`, `spacing-900`.

Use `px-100 py-75` for main buttons. Never mix a named spacing token with an arbitrary pixel value.

## 5. Corner radius

Use Tailwind radius steps only: `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`.

Nested radius formula: when a child sits inside a parent with a gap under 32px, set the child radius to the parent radius minus the gap when the result is greater than 2px. A `rounded-2xl` card with `p-200` uses `rounded-lg` children.

Borders go all the way around a card or are omitted. Backgrounds are flat. The only gradient allowed is the hero heading text.

## 6. Layout width and breakpoints

| Token | Value |
|---|---:|
| `layout-prose` | 680px |
| `layout-content` | 1280px |
| `layout-wide` | 1536px |

Breakpoints remain Tailwind defaults: `sm`, `md`, `lg`, `xl`, `2xl`. The 390px viewport is the mandatory mobile check. Content must not overflow horizontally, buttons must keep their text, and the primary action must be visible in the first screen.

## 7. Navigation

Desktop navigation is a compact floating bar with a translucent surface and blur, centered below the top edge. Active pages use `aria-current="page"` and a visible emerald indicator. The bar contains search, language selection, and links to every module through the secondary menu.

Mobile navigation is a full height panel with animated open and close states, a visible close button, Escape handling, keyboard accessible focus order, logical properties for RTL, and no horizontal overflow. Menu links enter one after another with 60ms steps capped at 400ms.

## 8. Components

Reusable components live in `src/components` and are composed rather than duplicated. Every interactive component implements:

- Hover: background, border, or transform change.
- Active: `scale(0.98)` or `translateY(1px)`.
- Focus: visible gold or emerald focus ring.
- Loading: skeleton shaped like final content.
- Empty: composed guidance, never a blank region.
- Error: inline message with a recovery action.

No dead links. Buttons that cannot act are visibly disabled. Every page has a route back home.

## 9. Motion

Base curve: `cubic-bezier(0.22, 1, 0.36, 1)`.

- Layout and position changes use 500ms.
- Color and opacity changes use 300ms and never less than 200ms.
- Scroll reveals use 600ms to 800ms.
- Animate only `transform` and `opacity`.
- Do not animate `top`, `left`, `width`, or `height`.
- Reveals fire once through `IntersectionObserver`.
- The tagline reveal activates words individually in reading order.
- Under `prefers-reduced-motion`, movement becomes a plain opacity change or the final state is shown immediately.

## 10. Accessibility

Target WCAG 2.2 AA.

- Semantic `header`, `nav`, `main`, `section`, `article`, `aside`, and `footer`.
- Skip link before navigation.
- Visible focus rings on all interactive elements.
- Correct `lang` and `dir` updated for EN, AR, UR, HI, and Roman Urdu.
- Accessible names for icon only controls.
- Decorative SVG hidden with `aria-hidden`.
- Meaningful images require alt text.
- Forms use labels, required states, inline validation, and error roles.
- No color as the only status signal.
- Motion respects reduced motion preferences.

## 11. SEO and AEO

- Unique title and meta description for every page.
- Open Graph metadata with branded image.
- Dynamic sitemap and robots routes.
- FAQ in plain question and answer form with optional FAQ schema.
- Canonical origin from `NEXT_PUBLIC_APP_URL`.
- Public content indexable; private dashboard and admin routes excluded.
- Branded 404 with a route back to learning.

## 12. Content integrity

Design never overrides content governance.

- Never invent Quranic text, Hadith, translations, references, grades, endorsements, statistics, or scholarly approvals.
- Demonstration content is visibly labelled.
- Canonical Arabic remains unchanged by editorial UI and search normalization.
- Translations, transliterations, explanations, and grading records stay separate.
- Editorial copy describes architecture and process, not unverified religious claims.

## 13. Checks before merge

- Typecheck, lint, unit tests, and production build pass.
- Review at desktop, tablet, and 390px mobile.
- Review English, Arabic RTL, Urdu RTL, Hindi, and Roman Urdu query states.
- Verify active navigation, keyboard navigation, focus rings, and reduced motion.
- Verify no dead links and no fabricated proof.
