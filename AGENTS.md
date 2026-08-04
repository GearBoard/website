# GearBoard — Agent Guide

Forum platform for CU intania students to post questions, answers, and comments.

---

## Repo layout

```
gearboard/
├── apps/api/   Hono REST API  (Node.js, Prisma, Better-Auth, PostgreSQL)
├── apps/web/   Next.js 16 frontend (React 19, SWR, Tailwind v4, Hono RPC)
└── docs/       codebase.html + codebase.md  ← read these first for a full map
```

Single `yarn.lock` at root. Run all commands from the repo root unless noted.

---

## Essential commands

```bash
# Start everything
yarn db:create        # spin up PostgreSQL container (first time only)
yarn db:generate      # generate Prisma client after schema changes
yarn api:dev          # Hono dev server
yarn web:dev          # Next.js dev server

# Database
yarn db:migrate       # create + apply a new migration (dev)
yarn db:apply         # apply existing migrations (CI / prod)
yarn db:studio        # Prisma Studio GUI
yarn db:seed          # seed data
yarn db:reset         # drop + recreate + re-migrate (destructive)

# Frontend
yarn web:storybook    # Storybook on port 6006
yarn web:build

# API
yarn api:build        # tsc → dist/
```

---

## API conventions

### One file per endpoint

Every endpoint gets its own DTO file and service file. Never add to an existing service to handle a second endpoint.

```
apps/api/src/modules/<module>/
├── <module>.route.ts
├── <module>.repository.ts
├── dto/
│   └── <action>-<resource>.dto.ts   ← InputDTO (Zod) + OutputDTO class
└── service/
    └── <action>-<resource>.service.ts
```

### Route chaining is mandatory

Routes **must** use method chaining. Imperative calls break Hono's TypeScript type inference for the RPC client.

```ts
// CORRECT
export const postRoute = new Hono<{ Variables: AppVariables }>()
  .get("/:id", zValidator(...), async (c) => { ... })
  .post("/",   requireAuth, zValidator(...), async (c) => { ... });

// WRONG — breaks AppType inference
export const postRoute = new Hono<{ Variables: AppVariables }>();
postRoute.get("/:id", ...);
```

### Response shape

Always wrap with `successResponse()`. Never return raw data.

```ts
return c.json(successResponse(result), 200);
return c.json(successResponse(result, "Post created"), 201);
return c.json(successResponse(null, "Post deleted successfully"), 200);
```

Shape: `{ success: true, message: string, data: T }` / `{ success: false, message: string }`

### Errors

Throw typed errors from the `AppError` hierarchy — never return error objects manually:

```
NotFoundError · ForbiddenError · UnauthorizedError · BadRequestError · ConflictError
```

`app.onError` in `app.ts` catches everything and serialises to the response.

### Validation

Use `zValidator("param" | "query" | "json", Schema, validationHook)` in the route.
Read validated input with `c.req.valid(...)` — never `c.req.param()` or `c.req.json()` directly.

### Image uploads

Profile and post images both use the authenticated `POST /api/uploads/image` endpoint.
It accepts multipart form data in the `file` field, uploads JPEG/PNG files (maximum
10 MB) to GCS, and returns `{ url }`.

### Auth context

Authenticated user is injected into Hono context by `requireAuth` middleware.
Read it in the handler with `c.get("user")` — type is `AuthenticatedUser` from `common/types`.

### `AppType` and `routes.ts`

`apps/api/src/routes.ts` is the only place that defines `AppType`. Keep it a clean chain of `.route()` calls — no middleware, no `onError`, no `.on()`. Those belong in `app.ts`.

### Generated files

**Never edit** anything inside `apps/api/generated/`. Regenerate with `yarn db:generate`.

---

## Frontend conventions

### Data fetching — SWR hooks only

Components must not call `client` directly. Always use (or create) a hook in `apps/web/src/shared/hooks/`.

```ts
import { useGetPostList } from "@/shared/hooks";
const { data, isLoading } = useGetPostList({ page: "1" });
```

Hook naming: `useGet<Resource>` for reads, `useCreate/useUpdate/useDelete<Resource>` for mutations.

### No axios

The HTTP layer is Hono RPC via `client` in `shared/libs/api-client.ts`. Do not add axios or fetch wrappers.

### Path alias

All imports within `apps/web/src` use `@/`. Cross-workspace imports (e.g. `AppType`) use relative paths: `../../../../api/src/routes`.

### Styling

Tailwind CSS v4. Use design tokens from `globals.css` (`text-primary-red`, `bg-primary-navy`, etc.).
Utility merging: `cn()` from `@/shared/libs/utils`.

### Shared UI components

`@/shared/components` — `Button`, `Input`, `Modal`, `Dropdown`, `Textarea`, `Navbar`.
Add stories (`*.stories.tsx`) alongside every new shared component.

---

## Keeping docs in sync

When you change anything that affects project conventions, commands, or architecture, update these three files before committing:

| What changed                                   | Files to update                                                   |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| New endpoint, module, or architectural pattern | `AGENTS.md` · `docs/codebase.md` · `docs/codebase.html`           |
| New/changed root script or command             | `AGENTS.md` (Essential commands) · `docs/codebase.md`             |
| New convention or constraint                   | `AGENTS.md` · `docs/codebase.md` · `docs/codebase.html`           |
| Schema change (Prisma)                         | `docs/codebase.md` (Database schema table) · `docs/codebase.html` |
| New shared hook or UI component                | `docs/codebase.md` · `docs/codebase.html`                         |

If the change is minor (a rename, a small addition), a targeted edit to the relevant section is enough — no need to regenerate the whole doc.

---

## Git

- Never commit directly to `main`.
- One logical change per commit; follow conventional commits (`feat:`, `fix:`, `refactor:`).
- Do not use `--no-verify`.
- Staged files run ESLint + Prettier automatically via lint-staged.
