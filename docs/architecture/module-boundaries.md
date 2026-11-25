# Module Boundaries

## Domain modules

| Module | Purpose | Current foundation status |
|---|---|---|
| `auth` | Identity, roles, permission checks, session contract | Implemented as pure RBAC rules + Auth.js config |
| `users` | User profiles and preferences contract | Schema + policy foundation |
| `quran` | Surah/Ayah domain rules | Module contract; no source text |
| `hadith` | Collection/book/chapter/number and grading rules | Module contract; no source text |
| `dua` | Dua metadata and occasion model | Module contract; no source text |
| `teachings` | Prophet teachings content model | Module contract |
| `daily-life` | Daily life guidance content model | Module contract |
| `concepts` | Basic Islamic concepts content model | Module contract |
| `myth-fact` | Myth/fact evidence separation | Module contract |
| `prophets` | Prophets stories with evidence separation | Module contract |
| `translations` | Language, translation provenance, transliteration rules | Implemented locale definitions |
| `references` | Source reference and grading provenance rules | Schema + types |
| `search` | Normalization, indexing contract, filters | Implemented demo search service |
| `bookmarks` | User bookmark ownership rules | Schema + policy foundation |
| `corrections` | Public correction submission workflow | Schema + validation foundation |
| `donations` | Payment metadata, webhook idempotency | Schema only; disabled |
| `audit` | Immutable activity records | Service contract + schema |

## Dependency rule

```text
app -> components/server -> modules -> lib
```

- Domain modules must not import from `src/app` or `src/components`.
- Domain modules must not import Prisma or Next.js runtime APIs.
- Domain modules may import Zod schemas and other domain modules.
- Repositories are the only layer that constructs Prisma queries.
- Services orchestrate repositories and domain rules; they do not render UI.

## UI boundaries

- `components/ui`: generic primitives with no domain knowledge.
- `components/layout`: header, footer, mobile navigation, language selector.
- `components/content`: content cards, notices, reference badges.
- `components/search`: search inputs and results; calls documented API only.
- `components/forms`: form UI; submission goes through API services.

## Server boundaries

- `server/services`: application use cases (publishing, audit).
- `server/repositories`: data access implementation.
- `server/policies`: authorization and state-transition policies.
- `server/validators`: Zod schemas for API boundaries.
- `server/security`: rate limiting, same-origin, redaction helpers.

## Forbidden shortcuts

- No `prisma` import inside a React component.
- No role check based only on client state.
- No publishing transition without `assertCanPublishContent`.
- No bare Hadith grade without `HadithGrading` provenance.
- No canonical Arabic mutation through an editorial form.
- No public correction directly modifying published content.
