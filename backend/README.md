# GearBoard Backend

## Project structure

```text
backend/
├── src/
│   ├── app.ts               # Express app, middleware, auth, Swagger
│   ├── server.ts            # Starts HTTP server
│   ├── routes.ts            # Mounts feature routes under /api
│   ├── config/             # env + Prisma client
│   ├── modules/            # user, post, comment, auth
│   └── common/             # middleware, errors, utils, shared types
├── prisma/
│   ├── schema.prisma       # DB schema
│   ├── migrations/
│   └── seed.ts
├── generated/              # Prisma client output
├── openapi.yaml            # Swagger spec
└── docker-compose.yml      # Local PostgreSQL
```

## API pattern

Every API must follow this flow:

`route -> validation -> controller -> service -> repository -> mapper/dto`

| Layer        | Responsibility                                                   |
| ------------ | ---------------------------------------------------------------- |
| Route        | Define path, auth, validation middleware, controller             |
| Schema       | Define Zod schemas for params, query, body                       |
| Controller   | Read validated data, call service, return `successResponse(...)` |
| Service      | Apply business rules, throw app errors, map result               |
| Repository   | Prisma access only                                               |
| Mapper / DTO | Separate API shape from Prisma model shape                       |

- Base path: `/api`
- Success response: `{ success: true, data }`
- Error response: `{ success: false, message }`
- Validation middleware: `validateBody`, `validateParams`, `validateQuery`
- Error types: `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`

## How to create one API

Use this order:

1. Add schema in `src/modules/<feature>/<feature>.schema.ts`
2. Add repository method in `src/modules/<feature>/<feature>.repository.ts`
3. Add service method in `src/modules/<feature>/<feature>.service.ts`
4. Add controller method in `src/modules/<feature>/<feature>.controller.ts`
5. Mount route in `src/modules/<feature>/<feature>.route.ts`
6. Register route in `src/routes.ts` if it is a new module
7. Update `openapi.yaml` if the contract changes

## Example: `GET /api/users/:id`

### 1. Schema

```ts
// src/modules/user/user.schema.ts
import { z } from "zod";

export const getUserByIdSchema = z.object({
  id: z.string().trim().min(1, { message: "Invalid user id" }),
});
```

### 2. Repository

```ts
// src/modules/user/user.repository.ts
async findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
```

### 3. Service

```ts
// src/modules/user/user.service.ts
async getById(id: string): Promise<UserResponseDto> {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  return toDto(user);
}
```

### 4. Controller

```ts
// src/modules/user/user.controller.ts
async getById(req: Request, res: Response) {
  try {
    const { id } = (req as Request & { validatedParams: { id: string } }).validatedParams;
    const data = await userService.getById(id);
    res.status(200).json(successResponse(data));
  } catch (error) {
    handleHttpError(res, error);
  }
}
```

### 5. Route

```ts
// src/modules/user/user.route.ts
userRoute.get(
  "/:id",
  validateParams(getUserByIdSchema),
  userController.getById.bind(userController)
);
```

## Rules to follow

- Validate at the route boundary, not inside service or repository.
- Keep controllers thin; do not query Prisma in controllers.
- Keep services responsible for business rules and existence checks.
- Keep repositories responsible for DB access only.
- Return DTOs, not raw Prisma models.
- Reuse `successResponse(...)` and `handleHttpError(...)`.
- Add auth middleware in the route when the endpoint requires authentication.

## Run database and server

### 1. Copy env

```bash
cp .env.example .env
# Edit .env: set DATABASE_URL and PORT if needed
```

### 2. Start PostgreSQL

```bash
npm run db.create
# or: docker-compose up -d db
```

### 3. Apply schema and seed

```bash
npm run db.push
npm run db.seed   # optional
```

### 4. Run the server

```bash
npm run dev
```

Server runs at `http://localhost:4000` unless `PORT` is overridden.

## TablePlus

1. Create a PostgreSQL connection.
2. Use host `localhost` and port `5432`.
3. Use credentials from `DATABASE_URL`.
4. Test and connect.

If Docker is used, make sure the DB container is running and `.env` matches the container credentials.

## Swagger

- URL: `http://localhost:4000/docs`
- Spec source: `openapi.yaml`
