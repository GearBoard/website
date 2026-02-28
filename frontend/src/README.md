# Frontend structure (feature-based)

- **`app/`** – Next.js App Router: routes, layout, global styles only. Keep pages thin; they import from `features/`.
- **`features/`** – One folder per feature (e.g. `auth`). Each feature can have:
  - `components/` – feature-specific UI
  - `hooks/` – feature-specific hooks
  - `constants/` – feature constants
  - `types/` – feature types
  - `index.ts` – barrel export (public API of the feature)
- **`shared/`** – Shared across features: `lib/` (utils), `components/` (Button, Input…), `types/`, `hooks/`.

Import from features via alias: `@/features/auth`, `@/shared`.
