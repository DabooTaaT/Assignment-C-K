# React Project Design — Assignment-C-K

**Date:** 2026-02-24
**Type:** Customer-facing web app
**Stack:** React + TypeScript + Vite + Apollo GraphQL + shadcn/ui + i18next + React Router v6 + Jest + MSW

---

## 1. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 (`createBrowserRouter`) |
| API | Apollo Client (GraphQL) |
| Mock data | MSW (Mock Service Worker) |
| UI primitives | shadcn/ui (via component wrappers only) |
| Styling | Tailwind CSS (required by shadcn) |
| i18n | i18next + react-i18next + i18next-browser-languagedetector |
| Languages | English (en), Thai (th) |
| Testing | Jest + ts-jest + React Testing Library |
| State | React Query via Apollo cache (no extra state library unless needed) |

---

## 2. Folder Structure

```
Assignment-C-K/
├── public/
│   └── mockServiceWorker.js        # MSW service worker (generated)
├── src/
│   ├── features/                   # Domain features (MVC per feature)
│   │   ├── auth/
│   │   │   ├── components/         # View: LoginForm, RegisterForm
│   │   │   ├── hooks/              # Controller: useLogin, useLogout, useRegister
│   │   │   ├── services/           # Model: authService
│   │   │   └── types/              # AuthUser, LoginInput, etc.
│   │   └── [feature-name]/         # Same pattern per feature
│   │
│   ├── core/
│   │   ├── network/                # Apollo Client + Links
│   │   │   ├── apolloClient.ts     # Assembled Apollo Client
│   │   │   ├── links/
│   │   │   │   ├── authLink.ts     # Inject Authorization header
│   │   │   │   ├── errorLink.ts    # Handle GraphQL/network errors
│   │   │   │   └── index.ts        # Compose link chain
│   │   │   └── index.ts
│   │   ├── data/                   # Data layer — MSW mock/real toggle
│   │   │   ├── mocks/
│   │   │   │   ├── handlers/       # MSW request handlers per feature
│   │   │   │   │   └── auth.ts
│   │   │   │   └── browser.ts      # MSW worker setup
│   │   │   └── repositories/       # Abstract data access interfaces
│   │   ├── i18n/
│   │   │   ├── index.ts            # i18next init + config
│   │   │   └── locales/
│   │   │       ├── en/
│   │   │       │   ├── common.json
│   │   │       │   └── auth.json
│   │   │       └── th/
│   │   │           ├── common.json
│   │   │           └── auth.json
│   │   ├── router/
│   │   │   ├── index.tsx           # createBrowserRouter definition
│   │   │   ├── guards/
│   │   │   │   └── RequireAuth.tsx # Auth guard (Outlet pattern)
│   │   │   └── routes.ts           # Route path constants
│   │   └── middleware/
│   │       └── ErrorBoundary.tsx   # Global React error boundary
│   │
│   ├── components/                 # Shared UI — shadcn wrappers + layout
│   │   ├── ui/
│   │   │   ├── Button.tsx          # Wraps shadcn Button
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Dialog.tsx
│   │   │   ├── Form.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Table.tsx
│   │   └── layout/
│   │       └── AppLayout.tsx
│   │
│   ├── types/                      # Global types, GraphQL generated types
│   ├── utils/
│   │   └── cn.ts                   # Tailwind class merge utility
│   ├── App.tsx
│   └── main.tsx                    # MSW bootstrap + React root
│
├── docs/
│   └── plans/                      # Design documents
├── jest.config.ts
├── jest.setup.ts
├── .gitignore
├── CLAUDE.md
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 3. Layer Architecture & Data Flow

```
GraphQL Server
      ↓
[Network Layer]     src/core/network/
  Apollo Client
  Links: authLink → errorLink → httpLink
      ↓  (MSW intercepts HTTP here when VITE_USE_MSW=true)
[Data Layer]        src/core/data/
  MSW handlers mock GraphQL responses at HTTP level
  Repositories abstract data access behind interfaces
      ↓
[Model Layer]       src/features/*/services/
  Business logic, data transformation, domain rules
      ↓
[Controller Layer]  src/features/*/hooks/
  React hooks — orchestrate services, manage state, expose actions to views
      ↓
[View Layer]        src/features/*/components/ + src/components/
  React components — consume hooks, render wrapped shadcn components
```

### Apollo Links Chain

```
authLink → errorLink → httpLink
```

- **authLink**: Reads token from storage, injects `Authorization: Bearer <token>`
- **errorLink**: Catches GraphQL errors and network errors; triggers logout on 401/UNAUTHENTICATED
- **httpLink**: Points to GraphQL endpoint URI

### MSW Toggle

`main.tsx` conditionally starts MSW before mounting React:

```ts
async function bootstrap() {
  if (import.meta.env.VITE_USE_MSW === "true") {
    const { worker } = await import("./core/data/mocks/browser");
    await worker.start();
  }
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
}
bootstrap();
```

Zero runtime cost in production — MSW bundle is never loaded.

---

## 4. Middleware

| Middleware | Location | Purpose |
|---|---|---|
| `authLink` | `core/network/links/authLink.ts` | Inject auth headers on every Apollo request |
| `errorLink` | `core/network/links/errorLink.ts` | Handle GraphQL errors, auto-logout on 401 |
| `RequireAuth` | `core/router/guards/RequireAuth.tsx` | Block unauthenticated access to guarded routes |
| `ErrorBoundary` | `core/middleware/ErrorBoundary.tsx` | Catch unhandled React render errors globally |

---

## 5. Component System (shadcn Wrappers)

**Rule:** No feature code imports directly from `shadcn/ui` or `@radix-ui`.
All imports go through `src/components/ui/*`.

**Wrapper pattern:**

```tsx
// src/components/ui/Button.tsx
import { Button as ShadcnButton, type ButtonProps } from "@/components/ui/button"; // shadcn internal path
import { cn } from "@/utils/cn";

interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button = ({ loading, className, children, ...props }: AppButtonProps) => (
  <ShadcnButton
    className={cn(className)}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <span className="animate-spin">…</span> : children}
  </ShadcnButton>
);
```

**Initial wrappers:** `Button`, `Input`, `Select`, `Dialog`, `Form`, `Card`, `Badge`, `Table`

---

## 6. i18n (i18next)

- **Languages:** English (`en`), Thai (`th`)
- **Detection:** `i18next-browser-languagedetector` (localStorage → navigator)
- **Loading:** Lazy per-namespace — only load active language bundle
- **Namespaces:** `common` (shared), plus one per feature (e.g. `auth`, `home`)
- **Usage:** `useTranslation('auth')` inside auth feature, `useTranslation('common')` for shared

---

## 7. Routing (React Router v6)

```
/                         AppLayout (root layout)
├── /                     Home page (public)
├── /login                Login (public)
├── /register             Register (public)
├── /*                    404 Not Found
└── RequireAuth (guard)   — redirects to /login if unauthenticated
    ├── /dashboard        Dashboard (protected)
    └── /profile          Profile (protected)
```

**Auth guard:**

```tsx
// core/router/guards/RequireAuth.tsx
const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
```

---

## 8. Testing Strategy (Jest)

### jest.config.ts

```ts
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};
```

### jest.setup.ts

```ts
import "@testing-library/jest-dom";
import { server } from "@/core/data/mocks/browser";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Test Layers

| Layer | Tool | What to test |
|---|---|---|
| View (components) | React Testing Library | Render, user events, conditional display |
| Controller (hooks) | `renderHook` | State transitions, effect side effects |
| Services (model) | Pure Jest | Business logic, data transforms |
| MSW handlers | MSW + Jest | Mock responses return correct shape |

**Test location:** Co-located as `*.test.tsx` / `*.test.ts` next to source files.

---

## 9. Project Init Checklist

- [ ] `npm create vite@latest` with React + TypeScript template
- [ ] Install and configure Tailwind CSS
- [ ] Install and init shadcn/ui
- [ ] Install React Router v6
- [ ] Install Apollo Client + GraphQL
- [ ] Install i18next + react-i18next + i18next-browser-languagedetector
- [ ] Install MSW
- [ ] Install Jest + ts-jest + @testing-library/react + @testing-library/jest-dom
- [ ] Create `.gitignore`
- [ ] Create `CLAUDE.md`
- [ ] Scaffold folder structure
- [ ] Create `jest.config.ts` + `jest.setup.ts`
- [ ] Create initial shadcn wrappers
- [ ] Create Apollo Client + Links
- [ ] Create MSW handlers + browser worker
- [ ] Create i18n config + locale files (en, th)
- [ ] Create router + auth guard
- [ ] Create global ErrorBoundary
