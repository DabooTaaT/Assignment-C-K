# CLAUDE.md — Assignment-C-K

## Project Overview
Customer-facing web app built with React + TypeScript + Vite.

## Architecture
Feature-based MVC. See `docs/plans/2026-02-24-react-project-design.md`.

## Key Conventions

### Layer Rules
- `src/features/*/components/` — View only, no business logic
- `src/features/*/hooks/` — Controller: orchestrate services, manage state
- `src/features/*/services/` — Model: business logic, data transforms
- `src/core/network/` — Apollo Client + Links (never import in features directly)
- `src/core/data/` — MSW handlers + repositories
- `src/components/ui/` — shadcn wrappers ONLY, never import shadcn directly in features

### Import Rules
- Use `@/` path alias for all src imports (e.g. `import { Button } from "@/components/ui/Button"`)
- NEVER import from `shadcn/ui` or `@radix-ui` directly in features
- NEVER import from `src/core/network/` directly in features — use hooks/services

### Component File Structure
Each component lives in its own subfolder with a barrel export:
```
ComponentName/
├── ComponentName.tsx       # component implementation
├── ComponentName.test.tsx  # co-located test
└── index.ts                # barrel: export * from "./ComponentName"
```
Import via the folder name (resolves through `index.ts`):
```ts
import { ComponentName } from "@/features/home/components/ComponentName"
import { Button } from "@/components/ui/Button"
```

### Testing
- Tests co-located: `ComponentName.test.tsx` inside `ComponentName/` subfolder
- Run tests: `npm test`
- Run with coverage: `npm test -- --coverage`

### Mock Data
- Enable MSW: set `VITE_USE_MSW=true` in `.env.local`
- MSW handlers live in `src/core/data/mocks/handlers/`

### i18n
- `useTranslation('common')` for shared strings
- `useTranslation('auth')` inside auth feature
- Add new namespaces in `src/core/i18n/locales/en/` and `src/core/i18n/locales/th/`

## Commands
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm test` — run Jest tests
- `npm run lint` — ESLint
