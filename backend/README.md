# GearBoard Backend

## Project structure

```
backend/
├── src/
│   ├── app.ts              # Express app, middleware, Swagger
│   ├── server.ts            # Entry: starts HTTP server
│   ├── routes.ts            # Mounts all API routes under /api
│   ├── config/
│   │   ├── env.ts           # Loads PORT, DATABASE_URL
│   │   └── prisma.ts        # Prisma client
│   ├── modules/             # Feature modules
│   │   ├── user/            # controller, service, route, dto, schema, mapper, repository
│   │   └── auth/
│   └── common/
│       ├── middleware/      # error, auth, validate
│       └── utils/           # response, jwt, pagination
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── generated/               # Prisma Client (do not edit)
├── prisma.config.ts
├── openapi.yaml             # Swagger spec
└── docker-compose.yml       # PostgreSQL (and optional app)
```

---

## API structure

Each feature module (e.g. `user`) is built from these pieces:

| Layer          | Role                                                                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Route**      | Declares HTTP paths and methods, wires **validation middleware** and controller (e.g. `GET /:id` → `validateParams(getUserByIdSchema)` → `userController.getById`).                                                |
| **Validation** | Middleware (`validateBody` / `validateParams`) runs Zod schemas on `req.body` or `req.params`; on success overwrites `req.body` or sets `req.validatedParams`, then `next()`. On failure returns 400 with message. |
| **Controller** | HTTP layer: uses validated `req.body` or `req.validatedParams`, calls the service, returns response (success/error + DTO). No business logic.                                                                      |
| **Service**    | Business logic: calls repository, maps results to DTOs and returns them.                                                                                                                                           |
| **Repository** | Data access: uses Prisma, returns Prisma model types.                                                                                                                                                              |
| **Schema**     | Zod schemas for request validation (params, body); inferred types become request DTOs.                                                                                                                             |
| **DTO**        | Shape of data at the API boundary: request (from schema) and response (e.g. ids as strings, dates as ISO).                                                                                                         |
| **Mapper**     | Maps Prisma/model types to response DTOs.                                                                                                                                                                          |

- **Base path:** `/api`
- **Response:** Success `{ "success": true, "data": ..., "message": "..." }` · Error `{ "success": false, "message": "..." }`

**Current endpoints (user module):**

| Method | Path             | Description    |
| ------ | ---------------- | -------------- |
| GET    | `/api/users/:id` | Get user by id |
| POST   | `/api/users`     | Create user    |

---

## Run database and server

**1. Copy env and set your DB URL:**

```bash
cp .env.example .env
# Edit .env: set DATABASE_URL (and PORT if needed)
```

**2. Start PostgreSQL (Docker):**

```bash
npm run db.create
# or: docker-compose up -d db
```

**3. Apply schema and (optional) seed:**

```bash
npm run db.push
npm run db.seed   # optional
```

**4. Run the server:**

```bash
npm run dev
```

Server runs at `http://localhost:4000` (or the `PORT` in `.env`).

---

## TablePlus

1. **New connection** → PostgreSQL.
2. **Host:** `localhost` · **Port:** `5432`
3. **User / Password / Database:** use the same values as in your `DATABASE_URL` (e.g. user from the URL, password, and database name).
4. Test and connect.

If the DB is in Docker, ensure the container is running (`docker-compose up -d db`) and that `DATABASE_URL` in `.env` matches the credentials you configured for the container (e.g. Bitnami image: `POSTGRESQL_USER`, `POSTGRESQL_PASSWORD`, `POSTGRESQL_DATABASE` in the same `.env` or in docker-compose).

---

## Swagger

- **URL:** `http://localhost:4000/docs` (with server running).
- **Spec:** Served from `openapi.yaml`.
- Use the UI to try endpoints and see request/response schemas.
