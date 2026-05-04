# Project Overview

- Q&A platform (auth, users, posts, comments)
- Backend serves API; frontend is Next.js app
- Shared contracts across frontend/backend/Prisma
- DB changes are high risk

# Tech Stack

- TypeScript, Node.js (Express)
- Prisma + PostgreSQL
- Better Auth
- Next.js App Router, React 19
- Tailwind CSS

# Structure

- backend: modular (route → controller → service → repository)
- frontend: app/ thin, logic in features/, shared in shared/
- prisma: schema + migrations in backend/prisma

# Patterns

- Validate all inputs with Zod
- Use flow: route → validate → controller → service → repository
- Use successResponse / errorResponse only
- Throw AppError only
- No raw Prisma models in API (use DTO mapper)
- Controllers = HTTP only; Services = business logic

# Rules (STRICT)

- Do not break API contract or auth behavior
- Do not commit secrets or edit generated files
- Do not bypass validation, auth, or error handling
- No destructive DB changes or unsafe migrations
- Keep TypeScript strict (no any / ts-ignore)
- Prefer minimal diffs and reuse patterns
- Ask when unsure

# Commands

- dev, build, lint, typecheck

# Commit

- Conventional Commits `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`
- One logical change per commit

# References
