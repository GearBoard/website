# Backend - Docker + Prisma + Postgres

This is the backend service for the Project Action Income website.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js (for local CLI usage and hybrid development)

## Development Workflows

### Option A: Hybrid Mode (Recommended for Development)
Run the Database in Docker, but run the Node.js app on your machine (Host) for faster feedback.

1.  **Start Database Only**:
    ```bash
    docker-compose up -d postgres adminer
    ```
2.  **Start Backend Locally**:
    ```bash
    npm run dev
    ```
    *This uses `nodemon` to restart the server automatically when you save changes.*

### Option B: Full Docker Mode
Run everything (App + DB) inside Docker. Good for testing production-like environment.

1.  **Start All Services**:
    ```bash
    docker-compose up -d
    ```
2.  **View Logs**:
    ```bash
    docker-compose logs -f
    ```
    *Note: Does not auto-reload on code changes unless configured.*

## Database Management

- **Postgres**: Runs on port `5432`.
- **Adminer**: UI available at [http://localhost:8080](http://localhost:8080).
  - System: `PostgreSQL`
  - Server: `postgres`
  - Username: `postgres`
  - Password: `password`
  - Database: `testdb`
- **TablePlus**: Connect via `localhost:5432`.

## Migrations

Whenever you change `prisma/schema.prisma`:

1.  **Update Database**:
    ```bash
    npx prisma migrate dev --name describe_your_change
    ```
2.  **View Data**:
    ```bash
    npx prisma studio
    ```
