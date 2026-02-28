# GearBoard Backend

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

## Getting Started

### 1. Start the Database

We use Docker to run PostgreSQL. You can start it with a single command:

```bash
npm run db.create
# OR
docker-compose up -d db
```

### 2. Setup Schema

Push the Prisma schema to your database:

```bash
npm run db.push
```

### 3. Seed Data (Optional)

Populate the database with initial testing data:

```bash
npm run db.seed
```

### 4. Run the Server

Start the development server:

```bash
npm run dev
```

The server will start at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run server in watch mode |
| `npm run build` | Build TypeScript code |
| `npm run start` | Run built server |
| `npm run check` | Type check without emitting files |
| `npm run db.create` | Start DB container |
| `npm run db.start` | Start DB container (if stopped) |
| `npm run db.stop` | Stop DB container |
| `npm run db.down` | Remove DB container and volumes |
| `npm run db.studio` | Open Prisma Studio GUI |
| `npm run db.push` | Sync schema with DB (Prototyping) |
| `npm run db.migrate` | Create/Run migrations (Production) |
| `npm run db.seed` | Run seed script |

## Database Connection

The database connects via the URL defined in `.env`:
`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gearboard?schema=public"`
