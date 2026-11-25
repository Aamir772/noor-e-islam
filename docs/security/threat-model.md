# Architecture Risks and Gap Register

| ID | Risk / gap | Severity | Mitigation in foundation | Remaining work |
|---|---|---|---|---|
| R-01 | No licensed Quran translation selected | Critical | No Quran text seeded; demo records marked | Acquire license/attribution before content phase |
| R-02 | Fabricated Hadith risk | Critical | No Hadith text seeded; grading requires provenance object | Qualified reviewer and source edition verification |
| R-03 | Translator approving own work | High | `assertCanApproveTranslation` test and policy | Enforce in admin UI and API workflow |
| R-04 | Client-side role spoofing | Critical | Server RBAC policy tests; Auth.js JWT config | Query fresh role from DB in every protected service call |
| R-05 | Prisma 8 RC instability | Medium | Pinned Prisma 7.10.1 stable | Re-evaluate after 8.0 stable |
| R-06 | Auth.js v5 beta | Medium | Pinned beta with peer compatibility verified | Re-evaluate stable release before production |
| R-07 | PostgreSQL FTS limitations for Arabic/Urdu/Hindi/Roman Urdu | High | Search normalization isolated behind service; trigram fallback planned | Add language analyzers/dictionaries and relevance tuning |
| R-08 | Distributed rate limiting absent | High | Interface + in-memory dev adapter with tests | Redis/provider adapter before launch |
| R-09 | Donation compliance | Critical | Module disabled; no card storage | Provider selection, webhook verification, legal approval |
| R-10 | File upload abuse | High | Upload deferred; schema only | Signature/MIME scanning and private object storage before enabling |
| R-11 | RTL/mixed-direction defects | Medium | Locale definitions + RTL root attributes | Full visual QA with native Arabic/Urdu content |
| R-12 | Backup/restore unverified | High | Documentation created | Execute restore drill in staging |
| R-13 | Query performance at scale | Medium | Index strategy + pagination planned | Load test with realistic content volume |
| R-14 | Audit records mutable | High | Audit model + service contract | Append-only DB role and immutable storage policy |
| R-15 | Demo content mistaken for religious fact | Critical | `isDemo` flag and visible `DemoNotice` | Editorial review before any public launch |

## Current unresolved decisions

1. Approved Quran translation source(s) and license text.
2. Approved Hadith collections, translation editions, and grading references.
3. Named Research Reviewers and approval quorum.
4. Production auth provider strategy (credentials-only vs email/OAuth).
5. Hosting/CDN and production secret manager.
6. Donation provider and jurisdiction-specific compliance requirements.

Safe defaults used until decisions are made: no source text, no publication, no payments, no uploads, no production deployment.
