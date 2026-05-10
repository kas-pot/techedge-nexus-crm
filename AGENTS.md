# TechEdge Nexus — Agent Instructions

Full-stack loyalty management CRM running on **Cloudflare Workers + Durable Objects** (backend) and **React + Vite** (frontend).

## Commands

| Task | Command |
|------|---------|
| Dev server | `bun dev` (http://localhost:3000, hot-reload for both frontend and Worker) |
| Build | `bun build` |
| Deploy | `bun deploy` |
| Lint | `bun lint` |
| CF type generation | `bun cf-typegen` |

No test runner is configured. Validate changes via `bun dev` + manual API calls.

## Architecture

```
shared/        ← types.ts + mock-data.ts shared by frontend & backend
worker/        ← Cloudflare Worker (Hono) backend
src/           ← React frontend (Vite)
```

**Path aliases**: `@/` → `src/`, `@shared/` → `shared/`

### Frontend

- Routing: React Router v6 with `createBrowserRouter` — all routes are flat, declared in [`src/main.tsx`](src/main.tsx). All pages lazy-loaded via `React.lazy`.
- State/data: **TanStack Query** — generic hooks in [`src/lib/api-hooks.ts`](src/lib/api-hooks.ts) via `useEntities<T>()` / `useEntityMutation<T>()`.
- HTTP: [`src/lib/api-client.ts`](src/lib/api-client.ts) — single `api<T>(path, init?)` function; throws on non-2xx.
- UI: **shadcn/ui** components in `src/components/ui/`. Always use existing components before creating new ones.
- Animations: Framer Motion. Forms: React Hook Form + Zod. Theme: `next-themes`.

### Backend

- Framework: **Hono** on Cloudflare Workers.
- Storage: Single `GlobalDurableObject` used as KV-like storage for ALL entities (see [`worker/core-utils.ts`](worker/core-utils.ts)).
- API response shape: `{ success: boolean, data?: T, error?: string }` — use helpers `ok()`, `bad()`, `notFound()` from `core-utils`.

## Where to Make Changes

### Adding a new backend entity / API route

1. **Define the type** in [`shared/types.ts`](shared/types.ts).
2. **Add mock seed data** in [`shared/mock-data.ts`](shared/mock-data.ts).
3. **Create the entity class** in [`worker/entities.ts`](worker/entities.ts) by extending `IndexedEntity<T>` (list + CRUD) or `Entity<T>` (singleton). See existing classes for the pattern.
4. **Register it** in `ENTITY_MAP` inside [`worker/user-routes.ts`](worker/user-routes.ts) — this auto-wires standard CRUD routes.
5. **Add custom routes** (if needed) in `worker/user-routes.ts` inside `export function userRoutes(app)`.
6. **Add TanStack Query hooks** in [`src/lib/api-hooks.ts`](src/lib/api-hooks.ts) using `useEntities` / `useEntityMutation`.

### Adding a new page

1. Create the page component in the appropriate `src/pages/<domain>/` folder, exporting a named export.
2. Add a lazy import + route in [`src/main.tsx`](src/main.tsx), wrapping in `<Suspense>`.
3. Add a nav entry in [`src/components/app-sidebar.tsx`](src/components/app-sidebar.tsx).

## ⛔ Files That Must Not Be Modified

| File | Reason |
|------|--------|
| `worker/index.ts` | Core Worker bootstrap — strictly forbidden |
| `worker/core-utils.ts` | DO framework utilities — strictly forbidden |
| `vite.config.ts` | Build config — strictly forbidden |
| `wrangler.jsonc` | Cloudflare deployment config — strictly forbidden |

## Key Conventions

- **All new API routes go in `worker/user-routes.ts` only** — never edit `worker/index.ts`.
- All mutations auto-log via `logActivity()` in `user-routes.ts`; preserve this for new write routes.
- `shared/types.ts` is the source of truth for types shared between frontend and backend — update it first, then generate CF types with `bun cf-typegen`.
- Use `uuid` (`crypto.randomUUID()`) for all new entity IDs.
- The `GlobalDurableObject` is a singleton per Cloudflare account — all entities share its namespace; prefix keys accordingly (handled by `IndexedEntity`).
- Immer `enableMapSet()` is called globally in `main.tsx`; use Immer for complex state mutations in hooks.
