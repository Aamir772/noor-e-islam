# Admin CMS Plan

## Goal

Build a protected editorial console for preparing, reviewing, publishing, and auditing demonstration-safe religious content. The console must not publish any Quranic verse, Hadith, tafsir, translation, grade, or supplication unless licensed source data, provenance, review, and approval records exist.

## Non-Goals

- No mobile application.
- No licensed religious text is created by this plan.
- No public release or editorial sign-off.
- No payment processing or card-data collection.
- No email delivery provider.
- No direct database writes from client components.

## Roles and Permissions

Use `src/modules/auth/rbac.ts` as the only permission matrix. Every privileged page and API route must call `requireApiPermission` from `src/server/security/authorization.ts`, which re-reads the user status and lifecycle-aware role assignments (`expiresAt`, `revokedAt`) from PostgreSQL.

| Area | Minimum permission |
|---|---|
| Content workspace | `CONTENT_READ` |
| Create/edit content | `CONTENT_CREATE`, `CONTENT_UPDATE` |
| Submit for review | `CONTENT_UPDATE` |
| Approve/review | `RELIGIOUS_REVIEW`, `CONTENT_APPROVE` |
| Publish/archive | `CONTENT_PUBLISH` |
| Translation editor | `TRANSLATION_CREATE`, `TRANSLATION_UPDATE` |
| Source/license editor | `CONTENT_UPDATE` or `SETTINGS_MANAGE` |
| Correction queue | `CORRECTION_REVIEW` |
| Media library | `MEDIA_MANAGE` |
| User/role management | `USER_MANAGE` |
| Audit viewer | `AUDIT_VIEW` |
| Donation viewer | `DONATION_VIEW` |
| Settings | `SETTINGS_MANAGE` |

Reviewers must not approve their own translations. The existing `assertCanApproveTranslation` helper must be used before any approval mutation.

## Information Architecture

- `/admin` — overview, queues, recent audits, and urgent review counts.
- `/admin/content` — filterable content table by module, type, status, language, source, license, and demo flag.
- `/admin/content/[id]` — metadata, canonical text, variants, references, versions, review history, and status actions.
- `/admin/quran`, `/admin/hadith`, `/admin/dua` — module-specific views over the same `ContentItem` model with type filters.
- `/admin/translations` — translation variants, translator, language, methodology, reviewer, and review state.
- `/admin/sources` — source records, edition, verification status, and notes.
- `/admin/licenses` — license records, holder, attribution requirements, and usage permissions.
- `/admin/references` — reference links with canonical URLs and display labels.
- `/admin/review` — submit-for-review queue, reviewer assignment, approve/reject, and evidence capture.
- `/admin/corrections` — public correction submissions with triage, status, and linked content item.
- `/admin/media` — media assets, mime type, storage key, license, and attribution.
- `/admin/users` — user status, suspension, and role assignments with expiry/revocation.
- `/admin/audit` — admin, review, and session audit history.
- `/admin/donations` — donation events; view only, no payment execution.
- `/admin/settings` — operational configuration; never secret values in plain text.

## Data Model Reuse

Do not create a parallel CMS datastore. Reuse the existing Prisma models: `User`, `Role`, `Permission`, `UserRole`, `ContentItem`, `TextVariant`, `Translation`, `Transliteration`, `ReferenceTextVariant`, `Source`, `License`, `MediaAsset`, `ContentVersion`, `ReviewAudit`, `CorrectionSubmission`, `SessionAudit`, `AdminAuditLog`, and `RateLimitCounter`.

Rules:

- Canonical religious text is immutable once published. Corrections create new versions or correction records, never in-place edits to published canonical text.
- Search normalization, aliases, and transliteration variants are stored separately from canonical text.
- Every publishable item requires a verified source, a valid license, provenance metadata, and an approving reviewer who is not the translator.
- Seeded records remain `isDemo: true` and `status: DRAFT` until real licensed content and review exist.

## Server-Side API Pattern

Every privileged route handler follows this order:

1. `withApiHandler` for consistent envelope and error mapping.
2. `requireSameOrigin(request)` for state-changing requests.
3. `requireApiPermission(...)` for fresh authentication and authorization.
4. `assertRateLimit(...)` with `getClientKey(request, scope)`.
5. Zod validation of the request body or query.
6. Prisma transaction for the mutation plus version/audit rows.
7. `apiSuccess` or a mapped `AppError`.

Route handlers must not call Prisma before authorization. Client-side role checks are only for display and must never decide access.

## Editorial Workflow

`DRAFT -> IN_REVIEW -> APPROVED -> PUBLISHED -> ARCHIVED` with rejection returning to `DRAFT`.

- Draft creation records `VersionCreator` and initial `ContentVersion`.
- Submit-for-review writes `ReviewAudit` with the actor role snapshot.
- Approval checks source, license, provenance, translation independence, and `assertCanPublishContent`.
- Publish writes a new `ContentVersion`, updates `publishedAt`, and writes `ReviewAudit` with `APPROVED`/`PUBLISHED`.
- Archive writes `ReviewAudit` with `ARCHIVED`.
- Every status transition writes `AdminAuditLog` with target type, target id, and metadata.

## Translation Workflow

- Each `TextVariant` keeps translation, transliteration, and explanation data separate.
- `Translation.translatorId` is set from the authenticated actor, never from request input.
- `Translation.reviewerId` is set only after review and must not equal `translatorId`.
- Methodology, language, source, license, and review status are required before review submission.
- Rejected translations remain attached to their version history and are never deleted.

## Audit and Accountability

- `writeAdminAudit` for every privileged create, update, delete, status change, role assignment, and settings change.
- `writeReviewAudit` for review and publish transitions.
- `writeSessionAudit` for sign-in and sign-out events.
- Store only hashed IP and user-agent values; do not log credentials, tokens, secret values, or raw personal data.
- Audit rows are append-only from the application perspective. Retention and external immutability are operational follow-ups.

## Security Checklist

- No direct Prisma access from client components.
- No privileged action based only on JWT claims.
- No role without active, unexpired, non-revoked assignment.
- No unsafe inline scripts; CSP nonce is generated per request in `src/proxy.ts`.
- No trusted `x-forwarded-for` unless `TRUST_PROXY=true`.
- No production start without `assertProductionSecrets` passing.
- No content published without source, license, provenance, review, and version records.
- No fabricated verses, grades, tafsir, or references in demo records.

## Delivery Phases

1. **Read-only shell** — server-rendered tables for content, review, corrections, audit, users, and donations with fresh role checks and no mutation forms.
2. **Draft editor** — create/update drafts, sources, licenses, references, and translations with Zod validation and version records.
3. **Review and publish** — review queue, independence check, approve/reject, publish/archive, and audit transitions.
4. **Moderation and users** — correction triage, role assignment with expiry/revocation, suspension, and audit viewer.
5. **Hardening and handoff** — load tests, abusive-input tests, audit review, backup/restore drill, and editorial sign-off.

## Acceptance Criteria

- Unauthenticated and under-privileged requests to every privileged page and API route fail server-side.
- Expired or revoked roles are ignored without waiting for token expiry.
- Reviewers cannot approve their own translations.
- Published content cannot be edited in place.
- Every privileged mutation creates an audit row in the same transaction.
- No seeded demonstration record can be published through the CMS without real source, license, provenance, and approval data.
- Typecheck, lint, unit/integration tests, build, database verification, and E2E tests pass.
