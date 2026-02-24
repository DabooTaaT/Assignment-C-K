# Project Structure

## Overview

A production-ready **React 19 + TypeScript** single-page application built with a **feature-based MVC architecture**. Each feature owns its own controller (logic), interface (types), page component, and views folder — making the codebase easy to navigate and extend.

---

## Tech Stack

| Category | Technology |
|---|---|
| UI Framework | React 19 + TypeScript 5.9 |
| Build Tool | Vite 7 |
| Routing | React Router v6 (`createBrowserRouter`) |
| API Layer | Apollo Client 4 (GraphQL) |
| Mock Layer | MSW v2 (Mock Service Worker) |
| Styling | Tailwind CSS v3 + Material UI (wrapped) |
| Forms | react-hook-form + Zod |
| i18n | i18next (English + Thai) |
| Testing | Jest + React Testing Library + ts-jest |
| State | Apollo InMemoryCache |

---

## Architecture Diagram

```mermaid
flowchart LR
  subgraph Entry["Entry Point"]
    main["main.tsx\nBootstrap + MSW init"]
    App["App.tsx\nApolloProvider + RouterProvider + i18n"]
  end

  subgraph Core["Core Layer"]
    direction TB
    network["network/\napolloClient\nauthLink errorLink httpLink"]
    router["router/\ncreateBrowserRouter\nRequireAuth guard"]
    i18n["i18n/\nen + th\ncommon auth namespaces"]
    middleware["middleware/\nErrorBoundary"]
    data["data/mocks/\nMSW browser server\nauth handlers"]
  end

  subgraph Features["Features - MVC Pattern"]
    direction TB
    auth["auth/\nLoginPage RegisterPage\ncontroller.ts interface.ts views/"]
    dashboard["dashboard/\nDashboardPage\ncontroller.ts interface.ts views/"]
    home["home/\nHomePage\ncontroller.ts interface.ts views/"]
    profile["profile/\nProfilePage\ncontroller.ts interface.ts views/"]
    notFound["notFound/\nNotFoundPage\ncontroller.ts interface.ts views/"]
  end

  subgraph UI["Shared UI"]
    direction TB
    layout["layout/\nAppLayout"]
    ui["components/ui/\nButton Card Dialog Form\nInput Select Table Badge"]
    lib["lib/utils.ts\ncn utility"]
  end

  subgraph External["External"]
    gql["GraphQL API\nlocalhost:4000/graphql"]
    msw["MSW Mock\nVITE_USE_MSW=true"]
  end

  main --> App
  App --> network
  App --> router
  App --> i18n
  router --> middleware
  middleware --> layout
  layout --> auth
  layout --> dashboard
  layout --> home
  layout --> profile
  layout --> notFound
  auth --> ui
  dashboard --> ui
  home --> ui
  profile --> ui
  notFound --> ui
  network --> gql
  network --> msw
  data --> msw
```

---

## Directory Structure

```
src/
├── main.tsx                  # Bootstrap: MSW toggle + React root
├── App.tsx                   # Root: ApolloProvider + RouterProvider + i18n
├── index.css                 # Global Tailwind CSS
│
├── core/                     # Shared infrastructure (non-feature)
│   ├── network/              # Apollo GraphQL client
│   │   ├── apolloClient.ts   # Client setup: authLink → errorLink → httpLink
│   │   ├── index.ts          # Barrel export
│   │   └── links/
│   │       ├── authLink.ts   # Injects Bearer token from localStorage
│   │       └── errorLink.ts  # Handles 401 → clearToken + redirect /login
│   │
│   ├── router/               # React Router v6
│   │   ├── index.tsx         # createBrowserRouter with all routes
│   │   ├── routes.ts         # ROUTES constant map
│   │   └── guards/
│   │       └── RequireAuth.tsx  # Outlet-based auth guard
│   │
│   ├── i18n/                 # Internationalisation
│   │   ├── index.ts          # i18next init (en + th, auto-detect)
│   │   └── locales/
│   │       ├── en/           # common.json + auth.json
│   │       └── th/           # common.json + auth.json
│   │
│   ├── theme/
│   │   └── index.ts          # createTheme: reads Tailwind CSS vars → MUI palette
│   │
│   ├── middleware/
│   │   └── ErrorBoundary.tsx # React class error boundary
│   │
│   └── data/
│       └── mocks/            # MSW handlers (browser + Node)
│           ├── browser.ts    # setupWorker for browser
│           ├── server.ts     # setupServer for Jest
│           └── handlers/     # Per-feature mock handlers
│
├── features/                 # Feature modules — each follows MVC pattern
│   ├── auth/
│   │   ├── LoginPage.tsx     # Page entry (route target)
│   │   ├── RegisterPage.tsx  # Page entry (route target)
│   │   ├── controller.ts     # useAuth hook (logic)
│   │   ├── interface.ts      # AuthState type
│   │   └── views/            # Sub-components used inside pages
│   │
│   ├── dashboard/
│   │   ├── DashboardPage.tsx
│   │   ├── controller.ts
│   │   ├── interface.ts
│   │   └── views/
│   │
│   ├── home/
│   │   ├── HomePage.tsx
│   │   ├── controller.ts
│   │   ├── interface.ts
│   │   └── views/
│   │
│   ├── profile/
│   │   ├── ProfilePage.tsx
│   │   ├── controller.ts
│   │   ├── interface.ts
│   │   └── views/
│   │
│   └── notFound/
│       ├── NotFoundPage.tsx
│       ├── controller.ts
│       ├── interface.ts
│       └── views/
│
├── components/               # Shared, feature-agnostic components
│   ├── layout/
│   │   └── AppLayout.tsx     # Root layout: ErrorBoundary + Outlet
│   └── ui/                   # MUI wrappers (never import MUI directly — use @/components/ui)
│       ├── index.ts          # Barrel export — only import from here
│       ├── Badge/
│       │   └── index.tsx     # MUI Chip wrapper (label/pill style)
│       ├── Button/
│       │   ├── index.tsx     # MUI Button wrapper (adds loading prop + aria-busy)
│       │   └── Button.test.tsx
│       ├── Card/
│       │   └── index.tsx     # MUI Card + CardContent + CardHeader + CardActions
│       ├── Dialog/
│       │   └── index.tsx     # MUI Dialog + sub-components
│       ├── Form/
│       │   └── index.tsx     # react-hook-form + MUI FormControl/FormLabel/FormHelperText
│       ├── Input/
│       │   ├── index.tsx     # MUI TextField wrapper
│       │   └── Input.test.tsx
│       ├── Label/
│       │   └── index.tsx     # MUI FormLabel
│       ├── Select/
│       │   └── index.tsx     # MUI Select + MenuItem + FormControl + InputLabel
│       └── Table/
│           └── index.tsx     # MUI Table + sub-components
│
├── lib/
│   └── utils.ts              # cn() — clsx + tailwind-merge
│
└── types/                    # Global shared TypeScript types
```

---

## Layer Descriptions

### Entry Point
| File | Role |
|---|---|
| `main.tsx` | Bootstraps the app. If `VITE_USE_MSW=true`, starts the MSW service worker before rendering. |
| `App.tsx` | Top-level providers: `ApolloProvider` (GraphQL), `RouterProvider` (routing), and i18n import. |

### Core — Network
The Apollo Client uses a **link chain**: `authLink → errorLink → httpLink`.

- **authLink** — Reads `auth_token` from `localStorage` and injects `Authorization: Bearer <token>` on every request.
- **errorLink** — Intercepts GraphQL/network errors. On `401` or `UNAUTHENTICATED`, clears the token and redirects to `/login`.
- **httpLink** — Sends the request to `VITE_GRAPHQL_URL` (defaults to `http://localhost:4000/graphql`).

### Core — Router
React Router v6 `createBrowserRouter` with an `AppLayout` shell wrapping all routes.
Protected routes use `<RequireAuth />` — an `Outlet`-based guard that checks `useAuth().isAuthenticated`.

### Core — i18n
Two locales (`en`, `th`), two namespaces (`common`, `auth`).
Language is auto-detected from `localStorage`, then browser `navigator`, falling back to `en`.

### Core — Middleware
`ErrorBoundary` wraps the entire app (via `AppLayout`) to catch unhandled render errors.

### Core — Data / Mocks
MSW handlers intercept GraphQL or REST requests during development (`VITE_USE_MSW=true`) and testing (Jest uses `server.ts`). Add new mock handlers under `handlers/` per feature.

### Features — MVC Pattern
Every feature follows the same four-file pattern:

| File | Role |
|---|---|
| `FeaturePage.tsx` | Route-level page component. Composes views/, calls controller. |
| `controller.ts` | Business logic: custom hooks, data fetching, state management. |
| `interface.ts` | TypeScript types and interfaces scoped to this feature. |
| `views/` | Smaller components used only within this feature's page. |

### Shared UI — MUI Wrappers
**Rule:** Never import from `@mui/material` directly. Always import from `@/components/ui`.

Each component folder contains only `index.tsx` — the wrapper that exposes MUI's native prop API.
The MUI theme is driven by Tailwind CSS variables via `src/core/theme/index.ts`, so both systems share one palette.

Badge maps to MUI `Chip` (not MUI `Badge` which is a notification-dot component).

---

## Routes

| Path | Component | Protected |
|---|---|---|
| `/` | `HomePage` | No |
| `/login` | `LoginPage` | No |
| `/register` | `RegisterPage` | No |
| `/dashboard` | `DashboardPage` | Yes |
| `/profile` | `ProfilePage` | Yes |
| `*` | `NotFoundPage` | No |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_USE_MSW` | `false` | Set to `true` to enable MSW mock layer |
| `VITE_GRAPHQL_URL` | `http://localhost:4000/graphql` | GraphQL API endpoint |

---

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report (70% threshold)
```

Tests use **Jest + ts-jest + React Testing Library**. MSW's Node `server` is started globally via `jest.setup.ts` to intercept requests in tests.

Test files sit alongside the code they test (`*.test.ts` / `*.test.tsx`).

---

## Key Conventions

- **Path alias:** `@/` maps to `src/` — use it everywhere instead of relative paths.
- **MUI imports:** Always via `@/components/ui` barrel, never direct. Each component folder has `index.tsx` wrapping the MUI component.
- **Controller = hooks:** Feature business logic lives in `controller.ts` as custom hooks.
- **Interface = types:** Feature-scoped TypeScript types live in `interface.ts`.
- **Views = sub-components:** Reusable pieces inside a feature page live in `views/`.
- **i18n namespace per feature:** Use `useTranslation("auth")`, `useTranslation("common")`, etc.
