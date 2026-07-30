# GearBoard — Codebase Reference

> Dense AI-optimised reference. Real paths, real snippets, real conventions.

---

## Stack & Versions

| Layer              | Technology                      | Version        |
| ------------------ | ------------------------------- | -------------- |
| Monorepo           | Yarn Berry workspaces           | 4.17.0         |
| Backend framework  | Hono                            | 4.12.27        |
| Backend runtime    | Node.js via `@hono/node-server` | —              |
| ORM                | Prisma (PrismaPg adapter)       | 7.0.0          |
| Database           | PostgreSQL                      | —              |
| Auth               | Better-Auth                     | 1.5.5          |
| Validation         | Zod + @hono/zod-validator       | 3.24.0 / 0.8.0 |
| Frontend framework | Next.js (App Router)            | 16.1.6         |
| Frontend runtime   | React                           | 19.2.3         |
| Data fetching      | SWR + Hono RPC client           | 2.4.2          |
| Styling            | Tailwind CSS v4                 | —              |
| UI primitives      | Radix UI (Dialog, Popover)      | —              |
| Component styling  | Class Variance Authority        | —              |
| Component dev      | Storybook (nextjs-vite)         | —              |
| Language           | TypeScript                      | 5.3.3          |
| Linter/formatter   | ESLint 9 + Prettier             | —              |
| Pre-commit         | Husky + lint-staged             | —              |

---

## Repo Layout

```
gearboard/                     ← monorepo root
├── package.json               ← workspaces: ["apps/*", "packages/*"], root scripts
├── .yarnrc.yml                ← nodeLinker: node-modules, enableScripts: true
├── yarn.lock                  ← single lock file
├── eslint.config.js           ← per-app rules (api: strict TS; web: next.js)
├── docs/                      ← this directory
├── apps/
│   ├── api/                   ← Hono REST API
│   │   ├── package.json
│   │   ├── tsconfig.json      ← target ES2020, moduleResolution NodeNext
│   │   ├── docker-compose.yml ← postgres + optional app service
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── server.ts      ← node entry point
│   │       ├── app.ts         ← Hono app, middleware stack
│   │       ├── routes.ts      ← route aggregator + AppType export
│   │       ├── config/        ← env, auth, prisma
│   │       ├── common/        ← errors, middleware, utils, types
│   │       └── modules/       ← post/, comment/, user/
│   └── web/                   ← Next.js frontend
│       ├── package.json
│       ├── tsconfig.json      ← "@/*": ["./src/*"]
│       ├── next.config.ts
│       ├── .storybook/
│       └── src/
│           ├── app/           ← Next.js App Router pages
│           ├── features/      ← feature modules (auth, ...)
│           └── shared/        ← libs, hooks, components
└── packages/                  ← (empty, reserved for shared packages)
```

---

## Root Scripts (`package.json`)

```
web:dev          yarn workspace @gearboard/web dev
web:build        yarn workspace @gearboard/web build
web:storybook    yarn workspace @gearboard/web storybook
api:dev          yarn workspace @gearboard/api dev
api:build        yarn workspace @gearboard/api build
db:create        docker compose -f apps/api/docker-compose.yml up -d postgres
db:start / db:stop / db:down
db:generate      prisma generate (in api workspace)
db:push          prisma db push
db:studio        prisma studio
db:migrate       prisma migrate dev
db:apply         prisma migrate deploy
db:seed          tsx prisma/seed.ts
db:reset         prisma migrate reset
```

---

## API — Architecture

### Boot sequence

```
apps/api/src/server.ts          ← @hono/node-server, reads PORT from env
  → apps/api/src/app.ts         ← Hono(), cors, auth handler, apiRoutes, onError
    → apps/api/src/routes.ts    ← chained .route() calls, exports AppType
      → modules/*/  *.route.ts  ← per-module chained Hono instances
```

### `app.ts` — middleware stack

```ts
// apps/api/src/app.ts
const app = new Hono();
app.use(cors({ origin: env.BETTER_AUTH_TRUSTED_ORIGIN, credentials: true }));
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.get("/", (c) => c.text("Hello World!"));
app.route("/", apiRoutes);
app.onError((err, c) => {
  const { statusCode, message } = resolveHttpError(err);
  return c.json({ success: false, message }, statusCode as Parameters<typeof c.json>[1]);
});
```

### `routes.ts` — AppType (critical for RPC)

```ts
// apps/api/src/routes.ts
export const apiRoutes = new Hono()
  .route("/api/posts", postRoute)
  .route("/api/comments", commentRoute)
  .route("/api/users", userRoute);

export type AppType = typeof apiRoutes;
```

**Why separate from `app.ts`**: `app.ts` has `.on()` and `.onError()` which break TypeScript's type inference chain. `routes.ts` is a clean chain — only `.route()` calls — so `typeof apiRoutes` resolves to the full typed schema for Hono RPC.

---

### Layering convention (per module)

```
<module>.route.ts       ← mount middleware + inline handler (no separate controller)
<module>.repository.ts  ← Prisma queries only; exports Post/Comment/User type alias
dto/
  <action>-<resource>.dto.ts  ← InputDTO (Zod schema) + OutputDTO class with toDTO()
service/
  <action>-<resource>.service.ts  ← business logic: repo call + DTO transform
```

Dependency direction: route → service → repository → Prisma

---

### Request lifecycle

```
Request
  → cors middleware (global)
  → requireAuth middleware (optional, per-route)
  → requireAdmin middleware (optional, per-route)
  → zValidator("param"|"query"|"json", ZodSchema, validationHook)
  → handler: c.req.valid() → service() → c.json(successResponse(result), status)
```

### Auth middleware (`apps/api/src/common/middleware/auth.middleware.ts`)

```ts
export const requireAuth = createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) return c.json({ success: false, message: "Unauthorized" }, 401);
  const dbUser = await userRepository.findById(session.user.id);
  if (!dbUser) return c.json({ success: false, message: "Unauthorized" }, 401);
  c.set("user", {
    id: dbUser.id,
    name: dbUser.name,
    image: dbUser.image ?? null,
    role: dbUser.role,
    email: dbUser.email,
    username: dbUser.username ?? null,
  });
  await next();
});

export const requireAdmin = createMiddleware<{ Variables: AppVariables }>(async (c, next) => {
  const user = c.get("user");
  if (user?.role !== "ADMIN") return c.json({ success: false, message: "Forbidden" }, 403);
  await next();
});
```

Context variable type: `apps/api/src/common/types/index.ts`

```ts
export type AppVariables = { user: AuthenticatedUser };
```

---

### Validation hook (`apps/api/src/common/utils/validation-hook.ts`)

```ts
export function validationHook(result: { success: boolean; error?: ZodError }, c: Context) {
  if (!result.success) {
    const message = result.error?.issues[0]?.message ?? "Validation error";
    return c.json({ success: false, message }, 400);
  }
}
```

Returns first Zod error message. Used as third arg to every `zValidator()` call.

---

### DTO pattern

**Input DTO** — Zod schema constant, exported and used directly in `zValidator()`:

```ts
// dto/create-post.dto.ts
export const CreatePostBodyInputDTO = z.object({
  title: z.string().trim().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().trim().min(1, "Description is required"),
  tagIds: z
    .array(z.string().trim().min(1, "Invalid tag id"))
    .optional()
    .default([])
    .transform((tagIds) => [...new Set(tagIds)]),
  images: z.array(z.string().url("Invalid image URL")).optional().default([]),
});
export type CreatePostBody = z.infer<typeof CreatePostBodyInputDTO>;
```

**Output DTO** — class with static `toDTO()` factory:

```ts
export class GetPostByIdOutputDTO {
  id!: string;
  title!: string;
  description!: string;
  tags!: string[];
  images!: string[];
  likeCount!: number;
  commentCount!: number;
  isClosed!: boolean;
  authorInfo!: { id: string; username: string | null; image: string | null };
  createdAt!: string;
  updatedAt!: string;

  static toDTO(post: Post): GetPostByIdOutputDTO {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      tags: post.tags.map((pt) => pt.tag.name),
      images: post.images.map((pi) => pi.url),
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      isClosed: post.isClosed,
      authorInfo: { id: post.user.id, username: post.user.username, image: post.user.image },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
```

---

### Service pattern

```ts
// service/create-post.service.ts
export async function createPostService(
  data: CreatePostBody,
  userId: string
): Promise<CreatePostOutputDTO> {
  const tags = await Promise.all(
    data.tagIds.map(async (tagId) => {
      const tag = await tagRepository.findById(tagId);
      if (!tag) throw new NotFoundError("Tag not found");
      return tag;
    })
  );
  const post = await postRepository.create({ ...data, tags }, userId);
  return CreatePostOutputDTO.toDTO(post);
}

// service/update-post.service.ts — ownership check
export async function updatePostService(id: string, data: UpdatePostBody, userId: string) {
  const post = await postRepository.findById(id);
  if (!post) throw new NotFoundError("Post not found");
  if (post.userId !== userId) throw new ForbiddenError("Forbidden");
  const updated = await postRepository.update(id, data);
  return UpdatePostOutputDTO.toDTO(updated);
}
```

Services throw typed `AppError` subclasses; `app.onError` catches and serializes.

---

### Repository pattern (`apps/api/src/modules/post/post.repository.ts`)

```ts
const postInclude = {
  user: { select: { id: true, username: true, image: true } },
  tags: { include: { tag: true } },
  images: true,
};
export type Post = Prisma.PostGetPayload<{ include: typeof postInclude }>;

export const postRepository = {
  async findById(id: string): Promise<Post | null> {
    return prisma.post.findUnique({ where: { id, deletedAt: null }, include: postInclude });
  },
  async softDelete(id: string): Promise<void> {
    await prisma.post.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date() } });
  },
  // ...
};
```

- Soft deletes: every query filters `deletedAt: null`; delete sets `deletedAt: new Date()`
- Type alias `Post` = `Prisma.PostGetPayload<...>` (private to module, reused by DTOs)
- Create Post resolves `tagIds` in the service and connects the existing tags by ID
- Update Post retains its tag `connectOrCreate` pattern
- Multi-step mutations: `prisma.$transaction([...])`

---

### Response shape

```ts
// apps/api/src/common/utils/response.ts
export type SuccessResponse<T> = { success: true; message: string; data: T };
export type ErrorResponse = { success: false; message: string };

export function successResponse<T>(data: T, message = "OK"): SuccessResponse<T> {
  return { success: true, message, data };
}
```

Status codes: 200 (read/update/delete), 201 (create), 400 (validation), 401/403 (auth), 404/409 (domain errors), 500 (unhandled).

---

### Error hierarchy (`apps/api/src/common/errors/app-error.ts`)

```
AppError(message, statusCode)
  BadRequestError  → 400
  UnauthorizedError → 401
  ForbiddenError   → 403
  NotFoundError    → 404
  ConflictError    → 409
```

`resolveHttpError()` in `common/utils/http-error.ts` maps `AppError` → `{statusCode, message}`; unknown errors → 500 + console.error.

---

### Pagination (`apps/api/src/common/utils/pagination.ts`)

```ts
export function getSkipTake(page = 1, limit = 10): { skip: number; take: number } {
  const take = Math.min(Math.max(1, limit), 100);
  const skip = (Math.max(1, page) - 1) * take;
  return { skip, take };
}
```

Query param validation coerces `page`/`limit` from strings, enforces 1–100 range before passing to `getSkipTake`.

---

### Database schema (Prisma — `apps/api/prisma/schema.prisma`)

| Model      | Key fields                                                               | Notes                            |
| ---------- | ------------------------------------------------------------------------ | -------------------------------- |
| User       | id, email, username, role (USER\|ADMIN), departmentId, deletedAt         | Better-Auth base + custom fields |
| Session    | token, userId, expiresAt                                                 | Better-Auth managed              |
| Account    | providerId, accountId, userId                                            | OAuth account linking            |
| Post       | title, description, likeCount, commentCount, isClosed, userId, deletedAt | Soft delete                      |
| PostImage  | url, postId                                                              | cascade delete                   |
| Tag        | name (unique)                                                            | Global tag registry              |
| PostTag    | postId + tagId (composite PK)                                            | Join table                       |
| Comment    | content, userId, postId, parentId (self-ref for replies), deletedAt      | Cascade delete on post           |
| Like       | userId + postId (composite PK)                                           | —                                |
| Bookmark   | userId + postId (composite PK)                                           | —                                |
| Department | id, name                                                                 | Reference table                  |

---

### Config

**`apps/api/src/config/env.ts`** — `getEnv(key)` throws if missing; `getEnvOptional(key, default)` for optional vars.

Required vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_TRUSTED_ORIGIN`
Optional: Google OAuth (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`), AWS S3, GCS

**`apps/api/src/config/prisma.ts`** — `PrismaPg` adapter; generated client at `generated/prisma/`.

**`apps/api/src/config/auth.ts`** — Better-Auth with `prismaAdapter`, email/password enabled, optional Google OAuth, `databaseHooks.user.create.before` copies username → name.

---

## API — Endpoints

| Method   | Path                             | Auth    | Handler                        |
| -------- | -------------------------------- | ------- | ------------------------------ |
| GET      | /api/posts                       | —       | `getPostByIdService`           |
| GET      | /api/posts                       | —       | `getAllPostsService`           |
| POST     | /api/posts                       | ✓       | `createPostService`            |
| PATCH    | /api/posts/:id                   | ✓       | `updatePostService`            |
| DELETE   | /api/posts/:id                   | ✓       | `deletePostService`            |
| GET      | /api/posts/:postId/comments      | —       | `getCommentsByPostIdService`   |
| POST     | /api/posts/:postId/comment       | ✓       | `createCommentByPostIdService` |
| POST     | /api/comments/:commentId/replies | ✓       | `createReplyService`           |
| DELETE   | /api/comments/:commentId         | ✓       | `deleteCommentService`         |
| GET      | /api/users/me                    | ✓       | `getMeService`                 |
| GET      | /api/users                       | ✓ admin | `getAllUsersService`           |
| GET      | /api/users/:id                   | ✓       | `getUserByIdService`           |
| PATCH    | /api/users/:id                   | ✓       | `updateUserService`            |
| DELETE   | /api/users/:id                   | ✓       | `deleteUserService`            |
| GET      | /api/tags                        | —       | `getTagsService`               |
| POST     | /api/uploads/image               | ✓       | `uploadImageService`           |
| POST/GET | /api/auth/\*\*                   | —       | Better-Auth handler            |

Profile and post-image uploads both send a multipart `file` to `/api/uploads/image`,
which validates JPEG/PNG up to 10 MB and returns a public GCS URL. Create Post sends
selected `tagIds` and includes that URL in the `images` array sent to `POST /api/posts`.

---

## Frontend — Architecture

### Folder structure

```
apps/web/src/
├── app/                     ← Next.js App Router
│   ├── layout.tsx           ← root layout (Noto Sans Thai font)
│   ├── page.tsx             ← home (empty)
│   ├── globals.css          ← Tailwind v4 @theme tokens
│   └── auth/
│       └── page.tsx         ← login/register toggle
├── features/
│   └── auth/
│       ├── components/      ← LoginForm, RegistrationForm
│       └── types/
└── shared/
    ├── libs/
    │   ├── api-client.ts    ← Hono RPC client + unwrap helper
    │   ├── auth-client.ts   ← Better-Auth client + hooks
    │   └── utils.ts         ← cn() tailwind-merge helper
    ├── hooks/
    │   ├── posts.ts         ← useGetPostById, useGetPostList, useCreatePost, ...
    │   ├── comments.ts      ← useCreateReply, useDeleteComment
    │   ├── users.ts         ← useGetMe, useGetUserList, useGetUserById, ...
    │   ├── tags.ts          ← useGetTags
    │   ├── uploads.ts       ← useUploadImage
    │   └── index.ts         ← re-exports all
    └── components/
        └── ui/
            ├── button.tsx   ← CVA variants (color: red/navy/yellow; size: lg/md/sm/xs)
            ├── input.tsx    ← icon, password toggle, error state
            ├── modal.tsx    ← Radix Dialog wrapper
            ├── dropdown.tsx ← Radix Popover, single/multi-select
            ├── textarea.tsx
            └── Navbar.tsx
```

### Path alias

```json
// tsconfig.json
"paths": { "@/*": ["./src/*"] }
```

All project imports use `@/...`. Cross-workspace imports (api → web) use relative paths: `../../../../api/src/routes`.

---

### API client (`apps/web/src/shared/libs/api-client.ts`)

```ts
import { hc } from "hono/client";
import type { AppType } from "../../../../api/src/routes";

export const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!);

export async function unwrap<T extends { data: unknown }>(
  resPromise: Promise<{ ok: boolean; json(): Promise<T> }>
): Promise<T["data"]> {
  const res = await resPromise;
  const body = await res.json();
  if (!res.ok)
    throw new Error((body as unknown as { message: string }).message ?? "Request failed");
  return body.data;
}
```

- `client` is typed via `AppType` from `routes.ts` — TypeScript knows all endpoints, params, query, body, and response shapes
- `unwrap` awaits the Hono `ClientResponse`, checks `ok`, and returns `body.data` (index type `T["data"]` resolves eagerly — not conditional)
- Never use `axios` — Hono RPC client is the only HTTP layer

---

### SWR hooks (`apps/web/src/shared/hooks/`)

**GET → `useSWR`; mutations → `useSWRMutation`**

```ts
// hooks/posts.ts
export function useGetPostById(id: string) {
  return useSWR(["post", id], () => unwrap(client.api.posts[":id"].$get({ param: { id } })));
}
export function useGetPostList(query?: {
  page?: string;
  limit?: string;
  search?: string;
  tag?: string;
  userId?: string;
}) {
  return useSWR(["posts", query], () => unwrap(client.api.posts.$get({ query: query ?? {} })));
}
export function useGetInfinitePostList(limit = 10) {
  return useSWRInfinite(
    (pageIndex, previousPageData) =>
      previousPageData && pageIndex >= previousPageData.totalPages
        ? null
        : ["posts", { page: String(pageIndex + 1), limit: String(limit) }],
    ([, query]) => unwrap(client.api.posts.$get({ query }))
  );
}
export function useCreatePost() {
  return useSWRMutation(
    "posts",
    (
      _key,
      { arg }: { arg: { title: string; description: string; tagIds?: string[]; images?: string[] } }
    ) => unwrap(client.api.posts.$post({ json: arg }))
  );
}
```

SWR cache key conventions:

- Single resource: `["post", id]`
- List: `["posts", query]`
- Infinite feed: paginated `["posts", { page, limit }]` keys managed by `useSWRInfinite`
- Nested: `["post-comments", postId]`
- Current user: `"me"`

Calling a mutation:

```ts
const { trigger, isMutating } = useCreatePost();
await trigger({ title: "...", description: "..." });
```

---

### Auth client (`apps/web/src/shared/libs/auth-client.ts`)

```ts
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "../../../../api/src/config/auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL!,
  plugins: [inferAdditionalFields<typeof auth>()],
});
export const { useSession, signIn, signUp, signOut } = authClient;
```

`inferAdditionalFields` types the session with custom fields (username, role) defined in `auth.ts`.

---

### Styling

Tailwind CSS v4 via `@tailwindcss/postcss`. Semantic design tokens in `globals.css`:

```css
:root {
  --primary-red: #8b0020;
  --primary-navy: #333e55;
  --primary-yellow: #f8d21d;
  --bg-white: #f3eff5;
  --dark-gray: #8b9096;
}
@theme inline {
  --color-primary-red: var(--primary-red);
  --color-primary-navy: var(--primary-navy);
  --font-sans: "Satoshi", var(--font-noto-thai), sans-serif;
}
```

`cn()` utility in `shared/libs/utils.ts` wraps `tailwind-merge`.

### Shared UI components

All in `apps/web/src/shared/components/ui/`. Import via `@/shared/components`.

| Component | Variants / Props                                                                      |
| --------- | ------------------------------------------------------------------------------------- |
| Button    | color: red\|navy\|yellow; size: lg\|md\|sm\|xs; loading, asChild, iconLeft, iconRight |
| Input     | type, icon, error, disabled, password toggle                                          |
| Modal     | open, onOpenChange, title, description                                                |
| ConfirmModal | open, onOpenChange, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, isLoading |
| Dropdown  | options, value, onChange, multi-select                                                |
| Textarea  | standard                                                                              |
| Navbar    | logo, search, login/signup                                                            |

Storybook stories live alongside each component as `*.stories.tsx`.

---

## Build, Test, Run

### Commands

```bash
# Install
yarn install             # from repo root

# Dev
yarn web:dev             # Next.js dev server (port 3000)
yarn api:dev             # Hono tsx watch (reads PORT env)

# Build
yarn web:build
yarn api:build

# Database
yarn db:create           # start postgres container
yarn db:generate         # prisma generate
yarn db:push             # sync schema (no migration file)
yarn db:migrate          # create + apply migration
yarn db:apply            # apply existing migrations (CI/prod)
yarn db:seed             # seed data
yarn db:studio           # Prisma Studio GUI

# Storybook
yarn web:storybook       # port 6006
yarn web:build-storybook
```

### Testing

No test files found in the explored codebase (Storybook has `@storybook/addon-vitest` installed — Vitest tests may be co-located with stories).

### CI / Lint

Pre-commit: Husky + lint-staged runs ESLint + Prettier on staged files.

---

## How to Add a Backend Endpoint

1. **DTO file** — `apps/api/src/modules/<module>/dto/<action>-<resource>.dto.ts`
   - Export `const <Action><Resource>InputDTO = z.object({...})` + inferred type
   - Export `class <Action><Resource>OutputDTO` with `static toDTO(entity: EntityType)`
   - Add re-export to `dto/index.ts`

2. **Service file** — `apps/api/src/modules/<module>/service/<action>-<resource>.service.ts`
   - `export async function <action><Resource>Service(...)` — repo + DTO
   - Throw typed errors: `NotFoundError`, `ForbiddenError`, etc.
   - Add re-export to `service/index.ts`

3. **Route** — add chained method to `apps/api/src/modules/<module>/<module>.route.ts`

   ```ts
   .get("/new-path",
     requireAuth,                                    // if protected
     zValidator("param", InputDTO, validationHook),
     async (c) => {
       const input = c.req.valid("param");
       const result = await newService(input);
       return c.json(successResponse(result), 200);
     }
   )
   ```

   Must stay chained — imperative `.get()` calls break TypeScript type inference.

4. **No changes needed** to `routes.ts`, `app.ts`, or `AppType` — `typeof apiRoutes` updates automatically.

5. **Frontend hook** — `apps/web/src/shared/hooks/<resource>.ts`
   ```ts
   export function useGetNewThing(id: string) {
     return useSWR(["new-thing", id], () =>
       unwrap(client.api.<resource>[":id"].$get({ param: { id } }))
     );
   }
   ```
   Re-export from `hooks/index.ts`.

---

## How to Add a Frontend Page

1. **Create route** — `apps/web/src/app/<path>/page.tsx`
   - Add `"use client"` if using hooks/state
   - Import hooks from `@/shared/hooks`

2. **Feature components** — if complex, add to `apps/web/src/features/<feature>/components/`

3. **Shared UI** — use components from `@/shared/components`

4. **Data fetching**:

   ```tsx
   import { useGetPostList } from "@/shared/hooks";

   export default function PostsPage() {
     const { data, isLoading, error } = useGetPostList({ page: "1", limit: "10" });
     if (isLoading) return <div>Loading...</div>;
     return (
       <ul>
         {data?.data.map((p) => (
           <li key={p.id}>{p.title}</li>
         ))}
       </ul>
     );
   }
   ```

5. **Auth-gated pages** — check `useSession()` from `@/shared/libs/auth-client` and redirect with `useRouter`.
