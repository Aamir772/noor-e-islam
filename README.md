# Noor-e-Islam

Foundation build of an enterprise-grade Islamic knowledge and learning platform.

## Current status

This repository contains a **foundation implementation**, not a public religious-content release. All content modules, layouts, governance models, and APIs use clearly marked demonstration records. No Quranic verses, Hadith, translations, or authenticity grades have been added.

## Stack

- Next.js 16 App Router, React 19, TypeScript strict mode
- Tailwind CSS 4 design tokens
- PostgreSQL 16 + Prisma 7
- Auth.js 5 with JWT sessions
- Zod validation, Vitest, Playwright, ESLint
- Modular monolith with versioned REST API under `/api/v1`

## Quick start

```powershell
npm ci
npm run prisma:generate
Copy-Item .env.example .env
# Update DATABASE_URL and AUTH_SECRET in .env
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build validation |
| `npm run typecheck` | TypeScript strict check |
| `npm run lint` | ESLint |
| `npm run test` | Unit and integration tests |
| `npm run test:e2e` | Playwright browser tests |
| `npm run prisma:validate` | Validate schema |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate:deploy` | Apply migrations in staging/production |
| `npm run prisma:seed` | Insert demonstration-only records |
| `npm run check` | Typecheck, lint, tests, build |

## Architecture

See `docs/architecture/system-architecture.md` and `docs/architecture/module-boundaries.md`.

Key rules:

- UI components never access the database.
- Business rules live in domain modules and server services.
- All external input is validated with Zod.
- Authorization is enforced on the server.
- Publishing is a state machine with mandatory reviewer approval.
- Canonical Arabic text is never modified by ordinary editorial operations.

## Content safety

- No fabricated religious content is seeded.
- Demonstration records are marked `isDemo: true` and visibly labeled.
- Hadith grading requires grade, grader, grading source, edition, and verification status.
- Translation and transliteration are stored separately from canonical source text.
- Publication is blocked unless source, reference, license, provenance, and reviewer approval exist.

## Important limitations

- Admin dashboard is a protected shell; editing/publishing screens are not implemented.
- Bookmarks, reading lists, preferences, and progress are modeled but not exposed in the UI.
- Password reset requires an email provider and is not connected.
- Payments are disabled; no card data is collected.
- File uploads are not enabled.
- Rate limiting uses an in-memory development adapter; a distributed adapter is required before production.
- Full RTL and multilingual content QA remains pending.

## Verification

Run `npm run check` before committing changes. Production readiness additionally requires security testing, backup/restore drills, licensed content, qualified editorial review, and deployment approval.
