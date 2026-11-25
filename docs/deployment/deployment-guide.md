# Deployment Guide

## Prerequisites

- Node.js 20.19+ or 22+
- PostgreSQL 16
- HTTPS termination
- Secret manager or encrypted environment store
- Backup destination outside the application database

## Environment

Copy `.env.example` and set:

| Variable | Requirement |
|---|---|
| `DATABASE_URL` | Pooled PostgreSQL connection string used by Prisma |
| `AUTH_SECRET` | Long random secret; rotate on exposure |
| `AUTH_TRUST_HOST` | `true` only behind trusted host/proxy configuration |
| `NEXT_PUBLIC_APP_URL` | Public canonical origin for sitemap and callbacks |
| `LOG_LEVEL` | `info` or `debug` in non-production |

Never commit `.env`.

## Build and migration

```powershell
npm ci
npm run prisma:generate
npm run typecheck
npm run lint
npm run test
npm run build
npm run prisma:migrate:deploy
npm run prisma:seed
npm start
```

Run migrations as a separate deployment job. Do not run `prisma migrate dev` in production.

## Docker

```powershell
docker compose up --build
```

The compose file starts PostgreSQL and the application. Replace all example secrets before any non-local deployment.

## Health check

`GET /api/v1/health` returns API identity and version. It does not prove database connectivity; add a database health probe before production monitoring.

## Reverse proxy requirements

- Force HTTPS and HSTS.
- Forward `X-Forwarded-For` only from trusted proxies.
- Preserve the `Origin` header for state-changing requests.
- Do not cache authenticated responses.
- Set `NEXT_PUBLIC_APP_URL` to the exact canonical origin.

## Production gates

Do not deploy publicly until:

- Licensed content is approved.
- Editorial workflow has been exercised end to end.
- Distributed rate limiting is configured.
- CSP nonce strategy is implemented.
- Backup/restore drill passes.
- Security review is complete.
- Payment provider approval exists if donations are enabled.

## Rollback

Keep the previous image tag and database migration identifier. Roll back application code first, then assess whether a forward migration fix is safer than a database rollback. Never roll back a migration blindly after dependent data has been written.
