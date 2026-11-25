# Access Control

## Permission model

Permissions are explicit keys checked on the server. UI visibility is not an authorization control.

## Roles

| Role | Intended use |
|---|---|
| `guest` | Unauthenticated public reading |
| `registered_user` | Bookmarks, reading lists, preferences, progress |
| `content_editor` | Draft and translate content |
| `translator` | Produce translation records and provenance |
| `research_reviewer` | Verify sources, grades, and religious claims |
| `moderator` | Triage corrections and user reports |
| `finance_team` | View donation records; no card access |
| `administrator` | Publish content and manage system configuration |

## Permission matrix

| Permission | Guest | User | Editor | Translator | Reviewer | Moderator | Finance | Admin |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Read public content | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Manage bookmarks | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Create/edit draft | No | No | Yes | Yes | Yes | No | No | Yes |
| Add translation | No | No | No | Yes | Yes | No | No | Yes |
| Review religious claims | No | No | No | No | Yes | No | No | No |
| Approve own translation | No | No | No | No | No | No | No | No |
| Triage corrections | No | No | No | No | Yes | Yes | No | Yes |
| View donations | No | No | No | No | No | No | Yes | Yes |
| Publish content | No | No | No | No | No | No | No | Yes |
| Manage roles | No | No | No | No | No | No | No | Yes |

## Enforcement points

- API routes call `assertPermission` before protected operations.
- Publishing transitions call `assertCanTransitionTo`.
- Translation approval checks that reviewer identity differs from translator identity.
- Protected pages are resolved server-side with `requireSession` and fresh database roles.
- JWT role claims are revalidated against the database for sensitive routes.

## Design rules

- Never infer a permission from a page being visible.
- Never trust a role supplied by the client.
- Never allow an administrator to bypass religious review.
- Expired role assignments are ignored.
- Every authorization failure is logged without exposing sensitive request data.
