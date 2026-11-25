# Entity Relationship Overview

## Legend

- `1 ── *` means one parent row has many child rows.
- `1 ── 1` means a one-to-one relationship.
- `*` ── `*` is resolved through a join table.

## Access control and identity

```text
User 1 ── * Session
User 1 ── * Account
User * ── * Role (UserRole)
Role 1 ── * RolePermission
Permission 1 ── * RolePermission
User 1 ── * AuditLog
```

`UserRole` includes `assignedById`, `expiresAt`, and `isActive` so temporary and revoked roles remain auditable.

## Content and evidence

```text
Language 1 ── * ContentItemTranslation
ContentItem 1 ── * ContentItemTranslation
ContentItem 1 ── * ContentText
ContentItem 1 ── * ContentReference
ContentItem 1 ── * TranslationEvidence
ContentItem 1 ── * ContentVersion
ContentItem 1 ── * CorrectionReport
Source 1 ── * ContentReference
Source 1 ── * TranslationEvidence
License 1 ── * Source
```

`ContentItem` stores the canonical record and publishing status. Arabic source text, translation, transliteration, and commentary are separated into child tables.

## Hadith-specific evidence

```text
HadithRecord 1 ── 1 ContentItem
HadithRecord 1 ── * GradingRecord
GradingRecord * ── 1 Source
```

Grades are never stored as a single free-text label on the public content item.

## Taxonomy and discovery

```text
ContentItem * ── * Topic
ContentItem * ── * Tag
Language 1 ── * SearchSynonym
```

Search uses normalized `searchVector` and `trigramIndex` fields with PostgreSQL GIN indexes.

## User features

```text
User 1 ── * Bookmark
User 1 ── * ReadingList
ReadingList 1 ── * ReadingListItem
User 1 ── * LearningProgress
User 1 ── * Preference
```

These features are modeled but not exposed in the current UI.

## Governance

```text
ReviewAssignment * ── 1 Reviewer
ReviewAssignment * ── 1 ContentItem
CorrectionReport * ── 1 Resolver
ContentVersion 1 ── * AuditLog
```

## Retention

```text
Donation 1 ── 1 DonationReceipt
```

Donation records contain no card data. Provider identifiers are stored instead of payment credentials.
