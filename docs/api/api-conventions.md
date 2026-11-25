# API Conventions

## Versioning

Public endpoints are versioned under `/api/v1`. Future mobile applications consume the same endpoints as the website. Breaking changes require a new version prefix.

## Response envelope

Success:

```json
{
  "ok": true,
  "data": {}
}
```

Failure:

```json
{
  "ok": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Request validation failed",
    "details": {}
  }
}
```

## Status codes

| Code | Meaning |
|---|---|
| 200 | Successful read |
| 201 | Resource created |
| 400 | Validation failure |
| 401 | Authentication required |
| 403 | Authorization denied or cross-origin rejected |
| 404 | Resource not found |
| 409 | State conflict, including invalid publishing transitions |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error; details are not exposed |

## Validation

- Request bodies, query parameters, and route parameters must be parsed with Zod.
- Unknown fields are ignored only where the schema explicitly permits it.
- All errors are returned through `withApiHandler`.
- Stack traces and sensitive values are never returned to clients.

## State-changing requests

POST, PUT, PATCH, and DELETE endpoints require:

1. Same-origin `Origin` header for browser requests.
2. Rate-limit pass.
3. Server-side authorization where the endpoint is protected.
4. Zod validation.

Bearer-token flows for future mobile clients require a separate CSRF-exempt design and must not weaken browser protections.

## Current endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/health` | Health and API version |
| GET | `/api/v1/search` | Demonstration search with filters |
| POST | `/api/v1/auth/register` | Registered-user account creation |
| POST | `/api/v1/corrections` | Public correction submission |
| GET/POST | `/api/auth/[...nextauth]` | Auth.js session and credentials endpoints |

## Search endpoint

Query parameters:

- `q` — required, 1–120 characters
- `module` — optional module slug
- `limit` — optional integer 1–20, default 10

Results include `isDemo: true` until licensed religious content is indexed.
