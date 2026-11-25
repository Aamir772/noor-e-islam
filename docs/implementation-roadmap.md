# Implementation Roadmap

## Status legend

- **Done** — implemented and verified in this session.
- **Partial** — foundation exists but feature is intentionally incomplete.
- **Planned** — not implemented yet.

| Phase | Deliverable | Status | Verification |
|---|---|---|---|
| 0 | Repository inspection and architecture proposal | Done | This document + system architecture |
| 1 | Project foundation, pinned deps, config, design tokens | Done | `npm run typecheck`, `npm run lint` |
| 2 | Public layout, homepage, navigation, footer | Done | Build + Playwright smoke test |
| 3 | Eight module pages and demo notices | Done | Build route list + Playwright demo-notice test |
| 4 | Prisma schema, migration, demo seed | Partial | `prisma validate`, `prisma generate`, migration SQL; seed not run without DB |
| 5 | Auth boundaries, RBAC, publishing policy, API v1 | Partial | Unit + integration tests; admin CMS and password reset not implemented |
| 6 | Search service and search page | Done | Unit tests + API validation |
| 7 | Security helpers, CI, unit tests, E2E smoke tests | Partial | Unit/integration/security tests pass; distributed rate limiting and production CSP pending |
| 8 | Docs, deployment config, final verification | Done | `npm run check`, audit, Playwright; see implementation report |
| 9 | Official landing-page design system integration | Done | Visual report, 33 unit tests, 18 E2E tests across desktop/tablet/mobile and locales |

## Controlled execution order

1. Write architecture/risk/roadmap docs.
2. Create `package.json`, TypeScript, Next, Tailwind, ESLint, Vitest, Playwright configs.
3. Install pinned dependencies and commit lockfile via npm.
4. Implement design system primitives and brand/logo.
5. Implement public layout, homepage, and eight module routes.
6. Implement Prisma schema and generate migration SQL from schema.
7. Implement domain policies and server services.
8. Implement API v1 health/search endpoints and Auth.js route.
9. Add unit, integration, security, and E2E tests.
10. Add Docker, CI, and remaining documentation.
11. Apply `docs/design/landing-page-design.md` through `docs/design/noor-design-system.md`, homepage, shared components, and supporting pages.
12. Run typecheck, lint, unit tests, production build, audit, and Playwright E2E; report actual results in the implementation and visual reports.

## Phase gates

- No content may be marked `PUBLISHED` until licensing and reviewer approval are recorded.
- No payment code may be activated without provider credentials and approval.
- No production deployment is part of this implementation.
- Every phase must leave the build passing.

## Roadmap beyond foundation

- Phase A: licensed Quran and approved Hadith content pipeline.
- Phase B: full multilingual UI and RTL content QA.
- Phase C: admin CMS with complete editorial workflow.
- Phase D: production search analyzer tuning.
- Phase E: mobile API hardening and Flutter client.
