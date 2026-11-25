# Noor-e-Islam — System Architecture

## 1. Repository state at architecture time

- Empty Git repository on `master`, no commits, no tracked files, no remotes.
- Node.js `v26.13.1`, npm `11.20.0`.
- No pnpm, yarn, or Docker CLI available locally.
- No existing framework, dependencies, configuration, or user work to preserve.

## 2. Architectural decision

Noor-e-Islam will be implemented as a **modular monolith** using Next.js App Router, TypeScript strict mode, Tailwind CSS, PostgreSQL, and Prisma. Business logic lives in domain modules and application services; UI components never access the database directly.

This choice avoids premature microservices while preserving a clean path to future mobile applications through a versioned REST API (`/api/v1`) that shares the same database and domain services.

## 3. Request flow

```text
Browser / future mobile app
        |
        v
Next.js routes + API v1 route handlers
        |
        v
Validation (Zod) -> Authorization policy -> Application service
        |
        v
Domain module (pure rules: RBAC, publishing state machine, search)
        |
        v
Repository / data-access layer
        |
        v
PostgreSQL (Prisma)
```

Server Components call application services directly for public reads. Client Components call only documented API endpoints. All protected operations are authorized again on the server.

## 4. Layering rules

| Layer | Responsibility | May depend on | Must not depend on |
|---|---|---|---|
| `src/app` | Routing, Server Components, API route handlers | `components`, `server`, `lib`, `modules` | Direct Prisma calls |
| `src/components` | Presentational and reusable UI | `lib`, typed props, `modules/navigation` | Database, auth internals, business rules |
| `src/server/services` | Use-case orchestration, transactions | `modules`, repositories, `lib` | UI components |
| `src/server/repositories` | Data access only | Prisma client, `lib/db` | UI, business policy |
| `src/modules/*` | Domain types and pure rules | Other domain modules via explicit contracts | UI, Next.js APIs, Prisma |
| `src/lib/*` | Cross-cutting infrastructure | External libraries | Domain business rules |

## 5. Technology decisions

| Concern | Decision | Reason |
|---|---|---|
| Framework | Next.js 16.4.6, App Router | SSR/SSG, server-first rendering, API routes, mobile-ready backend surface |
| Language | TypeScript 6.0.3, `strict: true` | Latest version compatible with the Next 16 ESLint toolchain |
| Styling | Tailwind CSS 4.3.5 | Design tokens, responsive/RTL-ready utility system |
| ORM | Prisma 7.10.1 stable | Versioned schema, migrations, relational constraints |
| Prisma generator | `prisma-client` with explicit output | Prisma 7 default; avoids deprecated `prisma-client-js` |
| DB driver | `@prisma/adapter-pg` + `pg` | Required by Prisma 7 Rust-free client |
| Validation | Zod 4.6.7 | Shared server/client schemas |
| Auth | Auth.js 5.0.0-beta.32 with JWT sessions | Next 16/React 19 compatible; Credentials provider foundation; no custom session store |
| Password hashing | `bcryptjs` | Maintained library; no custom cryptography |
| Unit tests | Vitest 5.1.1 | Fast TypeScript-native tests |
| E2E tests | Playwright 1.65.1 | Real browser smoke tests |
| Lint | ESLint 9.39.5 + `eslint-config-next` | Framework-aware linting with compatible plugin peers |
| Package manager | npm with committed `package-lock.json` | Available locally; deterministic installs |
| Prisma 8 | Rejected for now | Latest tag is release candidate; unstable for foundation |

## 6. Data architecture summary

The schema is normalized around content provenance and governance:

- `User`, `Role`, `Permission`, `UserRole`, `SessionAudit`
- `Language`, `Source`, `License`, `Reference`, `HadithGrading`
- `ContentItem`, `TextVariant`, `Translation`, `Transliteration`, `Explanation`, `ScholarlyOpinion`, `ContentVersion`
- `Topic`, `Tag`, `ContentTopic`, `MediaAsset`
- `ReviewAudit`, `CorrectionSubmission`
- `Bookmark`, `ReadingList`, `ReadingProgress`, `UserPreference`, `FavoriteDua`
- `Donation`, `DonationEvent`

Canonical Arabic source text is immutable through ordinary editorial operations. Translations, transliterations, and explanations are separate entities with their own source, license, language, reviewer, and version history.

## 7. Editorial governance model

Publishing is a server-enforced state machine:

```text
draft -> translated -> referenced -> reviewed -> approved -> published -> archived
```

Transition validation requires:

1. Valid source and license.
2. Structured reference.
3. Translation provenance where applicable.
4. Research Reviewer approval for religious authenticity.
5. Reviewer is not the translator for that text variant.
6. Content version snapshot created on publication.
7. Immutable audit record for every transition.

## 8. Search architecture

Initial implementation uses PostgreSQL full-text search plus trigram fallback through a dedicated search layer. Canonical religious text is never normalized in place; normalization, aliases, and transliteration variants are stored separately in `SearchDocument`.

The search interface is isolated so OpenSearch or Meilisearch can replace the engine later without changing UI or public API contracts.

## 9. Security posture

- Zod validation on every external input.
- Server-side RBAC on every protected action.
- Security headers via `next.config.ts`.
- Same-origin checks for state-changing API routes.
- In-memory rate limiter interface for development; production adapter required before launch.
- Structured logging with redaction of secrets and credentials.
- Secrets supplied only through environment variables; `.env.example` contains placeholders.
- No card data stored; donation module remains disabled until a PCI-compliant provider is configured.

## 10. Internationalization

- Locale-aware routes and metadata are prepared through `src/lib/i18n/locales.ts`.
- Arabic and Urdu use RTL; English and Hindi use LTR.
- Roman Urdu is modeled as transliteration/rendering, not authoritative translation.
- Full UI translation is not claimed in the foundation phase; language infrastructure and provenance rules are implemented.

## 11. Performance strategy

- Server Components by default.
- Pagination for all collection queries.
- Selective caching with explicit invalidation.
- Indexes on content type, status, language, reference, and search vectors.
- Generated Prisma client checked into CI build step rather than committed.

## 12. Explicit non-goals for the foundation phase

- No real Quran or Hadith text will be inserted.
- No copyrighted translation will be copied.
- No production payment processing.
- No distributed Redis rate limiting.
- No mobile application yet.
- No claim of production readiness until security, backup, restore, and content-review verification are complete.
