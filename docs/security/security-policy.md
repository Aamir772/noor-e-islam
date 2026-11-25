# Security Policy

## Scope

This policy applies to the web application, API, database, administrative tooling, and deployment pipeline.

## Implemented controls

- Strict TypeScript and centralized Zod validation.
- Server-side RBAC with role expiration support.
- Publishing state machine with reviewer independence.
- Same-origin enforcement for browser state-changing requests.
- Per-endpoint in-memory rate limiting.
- bcrypt password hashing.
- JWT sessions with short-lived tokens.
- PostgreSQL parameterization through Prisma.
- Security headers including HSTS, frame denial, nosniff, and referrer policy.
- Audit logging foundation.
- Centralized API error envelope that does not expose stack traces.
- No card data or file upload handling.

## Development-only limitations

The following controls are **not production ready**:

- In-memory rate limiting must be replaced by Redis or an equivalent distributed store.
- CSP currently permits `'unsafe-inline'` because of Next.js runtime requirements; use per-request nonces before launch.
- Password reset requires an approved email provider.
- CSRF handling for native mobile bearer-token clients requires a separate design.
- Audit log shipping to immutable storage is not configured.
- Secret rotation and key management are not automated.

## Required before production

1. External penetration test.
2. Dependency and container scanning in CI.
3. Secret manager integration.
4. Backup and restore drill.
5. Production CSP nonce implementation.
6. Account lockout and email verification.
7. Distributed rate limiting.
8. Log retention policy and alerting.
9. Incident response playbook.
10. Qualified editorial sign-off on all content.

## Data minimization

- Do not store raw IP addresses in audit logs.
- Do not store payment credentials.
- Do not collect forced registration for reading public content.
- Do not log request bodies containing credentials or personal data.

## Vulnerability response

Security issues must be reported privately. Maintainers triage within two business days, reproduce, patch, test, and publish an advisory after the fix is deployed.
