# React Project Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a production-ready React + TypeScript customer-facing web app with layered architecture (Network → Data → Model → Controller → View), Apollo GraphQL, MSW mocks, i18next (en/th), React Router v6, shadcn component wrappers, and Jest testing.

**Architecture:** Feature-based MVC where each feature owns its View (components), Controller (hooks), and Model (services). Shared infrastructure lives in `src/core/` (network, data, i18n, router, middleware). All shadcn primitives are accessed only through wrapper components in `src/components/ui/`. The `cn` utility lives at `src/lib/utils.ts` (shadcn's canonical location) — import as `@/lib/utils` everywhere.

**Tech Stack:** React 18, TypeScript, Vite, Apollo Client, MSW v2, shadcn/ui, Tailwind CSS, i18next, React Router v6, Jest + ts-jest + React Testing Library, react-hook-form

---

## Task 1: Init Vite Project + Install All Dependencies

**Files:**
- Create: `package.json` (via Vite scaffolding)
- Create: `vite.config.ts`
- Create: `tsconfig.json`

**Step 1: Scaffold Vite project**

Run from `/Users/thanapat.khumprom/Assignment-C-K`:

```bash
npm create vite@latest . -- --template react-ts
```

When prompted "Current directory is not empty. Remove existing files and continue?" → select **Yes** (it will preserve `.git`).

**Step 2: Verify scaffold succeeded**

```bash
ls src/
```

Expected output: `App.css  App.tsx  assets/  index.css  main.tsx  vite-env.d.ts`

**Step 3: Install core dependencies**

```bash
npm install \
  react-router-dom@6 \
  @apollo/client graphql \
  i18next react-i18next i18next-browser-languagedetector \
  msw@2 \
  react-hook-form @hookform/resolvers \
  clsx tailwind-merge
```

**Step 4: Install dev dependencies**

```bash
npm install -D \
  jest ts-jest @types/jest \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event \
  jest-environment-jsdom \
  tailwindcss postcss autoprefixer \
  @types/node
```

**Step 5: Install shadcn peer requirements**

```bash
npm install class-variance-authority lucide-react @radix-ui/react-slot
```

**Step 6: Init Tailwind**

```bash
npx tailwindcss init -p
```

**Step 7: Verify node_modules installed**

```bash
npm ls react-router-dom @apollo/client i18next msw react-hook-form jest --depth=0
```

Expected: all packages listed with their versions, no errors.

**Step 8: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json
git commit -m "chore: init vite react-ts project and install dependencies"
```

---

## Task 2: Create .gitignore and CLAUDE.md

**Files:**
- Create: `.gitignore`
- Create: `CLAUDE.md`

**Step 1: Create `.gitignore`**

> Note: `.env` (non-sensitive defaults) is NOT ignored — it is committed to the repo. Only `.env.local` and `.env.*.local` (secrets) are ignored.

Create file `.gitignore`:

```
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Environment secrets (non-secret .env IS committed)
.env.local
.env.*.local

# Test coverage
coverage/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# MSW
public/mockServiceWorker.js

# TypeScript
*.tsbuildinfo
```

**Step 2: Create `CLAUDE.md`**

Create file `CLAUDE.md`:

```markdown
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
- Use `@/lib/utils` for the `cn` utility — NOT `@/utils/cn`
- NEVER import from `shadcn/ui` or `@radix-ui` directly in features
- NEVER import from `src/core/network/` directly in features — use hooks/services

### Testing
- Tests co-located: `MyComponent.test.tsx` next to `MyComponent.tsx`
- Run tests: `npm test`
- Run with coverage: `npm run test:coverage`

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
- `npm run test:coverage` — run tests with coverage report
```

**Step 3: Commit**

```bash
git add .gitignore CLAUDE.md
git commit -m "chore: add .gitignore and CLAUDE.md with project conventions"
```

---

## Task 3: Configure TypeScript Path Aliases + Vite

**Files:**
- Modify: `tsconfig.json`
- Modify: `vite.config.ts`

**Step 1: Update `tsconfig.json`** — add `baseUrl` and `paths`:

Replace the full file content with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Step 2: Update `vite.config.ts`** — add path alias resolver:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

**Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 4: Commit**

```bash
git add tsconfig.json vite.config.ts
git commit -m "chore: configure @/ path alias for TypeScript and Vite"
```

---

## Task 4: Configure Tailwind CSS

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

**Step 1: Update `tailwind.config.js`**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
```

**Step 2: Replace `src/index.css`** with Tailwind directives + shadcn CSS variables:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server starts on port 5173, no CSS errors in console.

**Step 4: Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "chore: configure Tailwind CSS with shadcn CSS variables"
```

---

## Task 5: Install and Configure shadcn/ui

**Files:**
- Create: `components.json`
- Create: `src/lib/utils.ts`

**Step 1: Create `components.json`**

> The `aliases.utils` points to `@/lib/utils` — this is where shadcn puts its `cn` utility and where all project code should import `cn` from.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Step 2: Add shadcn components via CLI**

```bash
npx shadcn@latest add button input select dialog form card badge table
```

When prompted about overwriting files, select **Yes**.

This creates: `src/lib/utils.ts` (the `cn` function) and `src/components/ui/button.tsx`, `input.tsx`, etc. (lowercase — shadcn internals).

**Step 3: Verify shadcn components and utils were added**

```bash
ls src/components/ui/ && ls src/lib/
```

Expected:
- `src/components/ui/`: `button.tsx  input.tsx  select.tsx  dialog.tsx  form.tsx  card.tsx  badge.tsx  table.tsx`
- `src/lib/`: `utils.ts`

**Step 4: Commit**

```bash
git add components.json src/lib/ src/components/ui/
git commit -m "chore: configure shadcn/ui and add base components"
```

---

## Task 6: Create `jest.config.ts` and `jest.setup.ts`

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `__mocks__/fileMock.ts`

**Step 1: Create `__mocks__/fileMock.ts`** (stub for non-JS imports like images/CSS):

```typescript
export default "test-file-stub";
```

**Step 2: Create `jest.config.ts`**

> Critical: the correct Jest option is `setupFilesAfterEnv` — not `setupFilesAfterFramework`.

```typescript
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/fileMock.ts",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;
```

**Step 3: Create `jest.setup.ts`** (MSW wiring added in Task 9 after MSW is configured):

```typescript
import "@testing-library/jest-dom";
```

**Step 4: Add test scripts to `package.json`**

Open `package.json` and add to the `"scripts"` section:

```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

**Step 5: Write smoke test for cn utility**

Create `src/lib/utils.test.ts`:

```typescript
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("resolves Tailwind conflicts — last wins", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("handles falsy values", () => {
    expect(cn("foo", false, undefined, "bar")).toBe("foo bar");
  });
});
```

**Step 6: Run the smoke test**

```bash
npm test src/lib/utils.test.ts
```

Expected: PASS — 3 tests passing.

**Step 7: Commit**

```bash
git add jest.config.ts jest.setup.ts __mocks__/ package.json src/lib/utils.test.ts
git commit -m "chore: add Jest configuration with setupFilesAfterEnv and cn utility tests"
```

---

## Task 7: Scaffold Folder Structure

**Files:**
- Create: directory tree

**Step 1: Create all directories**

```bash
mkdir -p \
  src/features/auth/components \
  src/features/auth/hooks \
  src/features/auth/services \
  src/features/auth/types \
  src/features/home/components \
  src/features/dashboard/components \
  src/features/profile/components \
  src/features/notFound/components \
  src/core/network/links \
  src/core/data/mocks/handlers \
  src/core/data/repositories \
  src/core/i18n/locales/en \
  src/core/i18n/locales/th \
  src/core/router/guards \
  src/core/middleware \
  src/components/layout \
  src/types
```

**Step 2: Verify structure**

```bash
find src -type d | sort
```

Expected: all directories listed above appear in output.

**Step 3: Commit**

```bash
git add src/
git commit -m "chore: scaffold feature-based MVC folder structure"
```

---

## Task 8: Create Shared UI Component Wrappers

**Files:**
- Create: `src/components/ui/Button.tsx` + `Button.test.tsx`
- Create: `src/components/ui/Input.tsx` + `Input.test.tsx`
- Create: `src/components/ui/Form.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/Dialog.tsx`
- Create: `src/components/ui/Table.tsx`
- Create: `src/components/ui/index.ts`

> **Rule:** No feature code imports from shadcn's lowercase files (`button.tsx`, `input.tsx`, etc.) or from `@radix-ui`. All imports go through these PascalCase wrappers.

**Step 1: Write failing test for Button wrapper**

Create `src/components/ui/Button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when loading prop is true", () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
```

**Step 2: Run test to verify it fails**

```bash
npm test src/components/ui/Button.test.tsx
```

Expected: FAIL — "Cannot find module '@/components/ui/Button'"

**Step 3: Create `src/components/ui/Button.tsx`**

```tsx
import { forwardRef } from "react";
import {
  Button as ShadcnButton,
  type ButtonProps,
} from "@/components/ui/button";

export interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ loading, disabled, children, ...props }, ref) => {
    return (
      <ShadcnButton ref={ref} disabled={loading || disabled} {...props}>
        {loading ? (
          <span
            className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </ShadcnButton>
    );
  }
);

Button.displayName = "Button";
```

**Step 4: Run test to verify it passes**

```bash
npm test src/components/ui/Button.test.tsx
```

Expected: PASS — 4 tests passing.

**Step 5: Write failing test for Input wrapper**

Create `src/components/ui/Input.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders with placeholder", () => {
    render(<Input placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("calls onChange when user types", async () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });
});
```

**Step 6: Create `src/components/ui/Input.tsx`**

```tsx
import { forwardRef } from "react";
import {
  Input as ShadcnInput,
  type InputProps,
} from "@/components/ui/input";

export type { InputProps };

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <ShadcnInput ref={ref} {...props} />;
});

Input.displayName = "Input";
```

**Step 7: Run Input test to verify it passes**

```bash
npm test src/components/ui/Input.test.tsx
```

Expected: PASS — 2 tests passing.

**Step 8: Create remaining wrappers**

Create `src/components/ui/Form.tsx`:

```tsx
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
```

Create `src/components/ui/Card.tsx`:

```tsx
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
export const Card = ShadcnCard;
```

Create `src/components/ui/Badge.tsx`:

```tsx
import {
  Badge as ShadcnBadge,
  type BadgeProps,
} from "@/components/ui/badge";

export type { BadgeProps };
export const Badge = ShadcnBadge;
```

Create `src/components/ui/Select.tsx`:

```tsx
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
```

Create `src/components/ui/Dialog.tsx`:

```tsx
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
```

Create `src/components/ui/Table.tsx`:

```tsx
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
```

**Step 9: Create barrel export `src/components/ui/index.ts`**

```typescript
export { Button } from "./Button";
export type { AppButtonProps } from "./Button";
export { Input } from "./Input";
export type { InputProps } from "./Input";
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./Form";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./Card";
export { Badge } from "./Badge";
export type { BadgeProps } from "./Badge";
export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "./Select";
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./Dialog";
export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./Table";
```

**Step 10: Run all wrapper tests**

```bash
npm test src/components/ui/
```

Expected: PASS — all tests passing.

**Step 11: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add shadcn component wrappers — Button, Input, Form, Card, Badge, Select, Dialog, Table"
```

---

## Task 9: Configure MSW (Mock Service Worker)

**Files:**
- Create: `src/core/data/mocks/handlers/auth.ts`
- Create: `src/core/data/mocks/handlers/index.ts`
- Create: `src/core/data/mocks/browser.ts`
- Create: `src/core/data/mocks/server.ts`
- Modify: `jest.setup.ts`

**Step 1: Generate MSW service worker to `public/`**

```bash
npx msw init public/ --save
```

Expected: `public/mockServiceWorker.js` created.

**Step 2: Create auth MSW handlers**

Create `src/core/data/mocks/handlers/auth.ts`:

```typescript
import { graphql, HttpResponse } from "msw";

export const authHandlers = [
  graphql.mutation("Login", ({ variables }) => {
    const { email, password } = variables as { email: string; password: string };

    if (email === "test@example.com" && password === "password") {
      return HttpResponse.json({
        data: {
          login: {
            token: "mock-jwt-token",
            user: {
              id: "1",
              email: "test@example.com",
              name: "Test User",
            },
          },
        },
      });
    }

    return HttpResponse.json({
      errors: [{ message: "Invalid credentials" }],
    });
  }),

  graphql.query("Me", () => {
    return HttpResponse.json({
      data: {
        me: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        },
      },
    });
  }),
];
```

**Step 3: Create handlers index**

Create `src/core/data/mocks/handlers/index.ts`:

```typescript
import { authHandlers } from "./auth";

export const handlers = [...authHandlers];
```

**Step 4: Create browser MSW worker** (used in Vite dev server)

Create `src/core/data/mocks/browser.ts`:

```typescript
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

**Step 5: Create Node server** (used by Jest)

Create `src/core/data/mocks/server.ts`:

```typescript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

**Step 6: Update `jest.setup.ts`** to wire MSW server lifecycle into Jest:

```typescript
import "@testing-library/jest-dom";
import { server } from "@/core/data/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Step 7: Verify MSW wiring by running existing tests**

```bash
npm test
```

Expected: all existing tests still pass. MSW server starts/stops correctly around each test file.

**Step 8: Commit**

```bash
git add public/mockServiceWorker.js src/core/data/mocks/ jest.setup.ts package.json
git commit -m "feat: configure MSW v2 with auth handlers and Jest server integration"
```

---

## Task 10: Configure Apollo Client + Links (Network Layer)

**Files:**
- Create: `.env`
- Create: `src/core/network/links/authLink.ts` + `authLink.test.ts`
- Create: `src/core/network/links/errorLink.ts`
- Create: `src/core/network/links/index.ts`
- Create: `src/core/network/apolloClient.ts`
- Create: `src/core/network/index.ts`

**Step 1: Create `.env`** (committed — contains non-sensitive defaults only)

```
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_USE_MSW=false
```

Create `.env.local` (NOT committed — developer's local overrides):

```
VITE_USE_MSW=true
```

**Step 2: Write failing test for authLink helpers**

Create `src/core/network/links/authLink.test.ts`:

```typescript
import { setAuthToken, clearAuthToken } from "@/core/network/links/authLink";

describe("authLink token helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("setAuthToken stores token in localStorage", () => {
    setAuthToken("abc123");
    expect(localStorage.getItem("auth_token")).toBe("abc123");
  });

  it("clearAuthToken removes token from localStorage", () => {
    localStorage.setItem("auth_token", "abc123");
    clearAuthToken();
    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});
```

**Step 3: Run to verify it fails**

```bash
npm test src/core/network/links/authLink.test.ts
```

Expected: FAIL — "Cannot find module"

**Step 4: Create `src/core/network/links/authLink.ts`**

```typescript
import { ApolloLink } from "@apollo/client";

const TOKEN_KEY = "auth_token";

export const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(TOKEN_KEY);

  operation.setContext(({ headers = {} }: { headers: Record<string, string> }) => ({
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }));

  return forward(operation);
});

export const setAuthToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
```

**Step 5: Run test to verify it passes**

```bash
npm test src/core/network/links/authLink.test.ts
```

Expected: PASS — 2 tests passing.

**Step 6: Create `src/core/network/links/errorLink.ts`**

```typescript
import { onError } from "@apollo/client/link/error";
import { clearAuthToken } from "./authLink";

export const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      console.error(`[GraphQL error] Operation: ${operation.operationName} — ${message}`);

      if (extensions?.code === "UNAUTHENTICATED") {
        clearAuthToken();
        window.location.href = "/login";
      }
    });
  }

  if (networkError) {
    console.error(`[Network error] ${networkError.message}`);

    if ("statusCode" in networkError && networkError.statusCode === 401) {
      clearAuthToken();
      window.location.href = "/login";
    }
  }
});
```

**Step 7: Create `src/core/network/links/index.ts`**

```typescript
export { authLink, setAuthToken, clearAuthToken } from "./authLink";
export { errorLink } from "./errorLink";
```

**Step 8: Create `src/core/network/apolloClient.ts`**

```typescript
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { authLink } from "./links/authLink";
import { errorLink } from "./links/errorLink";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL ?? "http://localhost:4000/graphql",
});

export const apolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
```

**Step 9: Create `src/core/network/index.ts`**

```typescript
export { apolloClient } from "./apolloClient";
export { setAuthToken, clearAuthToken } from "./links";
```

**Step 10: Run all network tests**

```bash
npm test src/core/network/
```

Expected: PASS — 2 tests passing.

**Step 11: Commit**

```bash
git add src/core/network/ .env
git commit -m "feat: add Apollo Client with authLink, errorLink, and httpLink chain"
```

---

## Task 11: Configure i18next (en + th)

**Files:**
- Create: `src/core/i18n/index.ts`
- Create: `src/core/i18n/locales/en/common.json`
- Create: `src/core/i18n/locales/en/auth.json`
- Create: `src/core/i18n/locales/th/common.json`
- Create: `src/core/i18n/locales/th/auth.json`
- Create: `src/core/i18n/i18n.test.ts`

**Step 1: Write failing test**

Create `src/core/i18n/i18n.test.ts`:

```typescript
import i18n from "@/core/i18n";

describe("i18n configuration", () => {
  it("initializes with English as default", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
  });

  it("translates common:appName in English", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("common:appName")).toBe("My App");
  });

  it("translates common:appName in Thai", async () => {
    await i18n.changeLanguage("th");
    expect(i18n.t("common:appName")).toBe("แอปของฉัน");
  });

  it("translates auth:loginTitle in English", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("auth:loginTitle")).toBe("Sign In");
  });
});
```

**Step 2: Run to verify it fails**

```bash
npm test src/core/i18n/i18n.test.ts
```

Expected: FAIL — "Cannot find module '@/core/i18n'"

**Step 3: Create locale files**

Create `src/core/i18n/locales/en/common.json`:

```json
{
  "appName": "My App",
  "loading": "Loading...",
  "error": "Something went wrong",
  "retry": "Try again",
  "cancel": "Cancel",
  "save": "Save",
  "delete": "Delete",
  "confirm": "Confirm",
  "back": "Back",
  "notFound": "Page not found"
}
```

Create `src/core/i18n/locales/en/auth.json`:

```json
{
  "loginTitle": "Sign In",
  "registerTitle": "Create Account",
  "email": "Email",
  "password": "Password",
  "loginButton": "Sign In",
  "registerButton": "Create Account",
  "noAccount": "Don't have an account?",
  "haveAccount": "Already have an account?",
  "signUp": "Sign up",
  "signIn": "Sign in",
  "invalidCredentials": "Invalid email or password"
}
```

Create `src/core/i18n/locales/th/common.json`:

```json
{
  "appName": "แอปของฉัน",
  "loading": "กำลังโหลด...",
  "error": "เกิดข้อผิดพลาด",
  "retry": "ลองอีกครั้ง",
  "cancel": "ยกเลิก",
  "save": "บันทึก",
  "delete": "ลบ",
  "confirm": "ยืนยัน",
  "back": "กลับ",
  "notFound": "ไม่พบหน้านี้"
}
```

Create `src/core/i18n/locales/th/auth.json`:

```json
{
  "loginTitle": "เข้าสู่ระบบ",
  "registerTitle": "สร้างบัญชี",
  "email": "อีเมล",
  "password": "รหัสผ่าน",
  "loginButton": "เข้าสู่ระบบ",
  "registerButton": "สร้างบัญชี",
  "noAccount": "ยังไม่มีบัญชี?",
  "haveAccount": "มีบัญชีอยู่แล้ว?",
  "signUp": "สมัครสมาชิก",
  "signIn": "เข้าสู่ระบบ",
  "invalidCredentials": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
}
```

**Step 4: Create `src/core/i18n/index.ts`**

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "./locales/en/common.json";
import enAuth from "./locales/en/auth.json";
import thCommon from "./locales/th/common.json";
import thAuth from "./locales/th/auth.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, auth: enAuth },
      th: { common: thCommon, auth: thAuth },
    },
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
```

**Step 5: Run test to verify it passes**

```bash
npm test src/core/i18n/i18n.test.ts
```

Expected: PASS — 4 tests passing.

**Step 6: Commit**

```bash
git add src/core/i18n/
git commit -m "feat: configure i18next with English and Thai locales (common + auth namespaces)"
```

---

## Task 12: Create Global Error Boundary (Middleware)

**Files:**
- Create: `src/core/middleware/ErrorBoundary.tsx`
- Create: `src/core/middleware/ErrorBoundary.test.tsx`

**Step 1: Write failing test**

Create `src/core/middleware/ErrorBoundary.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/core/middleware/ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error("Test error");
  return <div>No error</div>;
};

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("renders fallback UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("renders custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText("Custom error UI")).toBeInTheDocument();
  });
});
```

**Step 2: Run to verify it fails**

```bash
npm test src/core/middleware/ErrorBoundary.test.tsx
```

Expected: FAIL — "Cannot find module"

**Step 3: Create `src/core/middleware/ErrorBoundary.tsx`**

```tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-destructive">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
            <button
              className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Step 4: Run test to verify it passes**

```bash
npm test src/core/middleware/ErrorBoundary.test.tsx
```

Expected: PASS — 3 tests passing.

**Step 5: Commit**

```bash
git add src/core/middleware/
git commit -m "feat: add global ErrorBoundary with custom fallback support"
```

---

## Task 13: Create Router + Auth Guard + Page Placeholders

**Files:**
- Create: `src/core/router/routes.ts`
- Create: `src/core/router/guards/RequireAuth.tsx` + `RequireAuth.test.tsx`
- Create: `src/core/router/index.tsx`
- Create: `src/features/auth/hooks/useAuth.ts`
- Create: `src/features/auth/components/LoginPage.tsx`
- Create: `src/features/auth/components/RegisterPage.tsx`
- Create: `src/features/home/components/HomePage.tsx`
- Create: `src/features/dashboard/components/DashboardPage.tsx`
- Create: `src/features/profile/components/ProfilePage.tsx`
- Create: `src/features/notFound/components/NotFoundPage.tsx`
- Create: `src/components/layout/AppLayout.tsx`

**Step 1: Create route constants**

Create `src/core/router/routes.ts`:

```typescript
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
} as const;
```

**Step 2: Write failing test for RequireAuth guard**

Create `src/core/router/guards/RequireAuth.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/core/router/guards/RequireAuth";

jest.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/features/auth/hooks/useAuth";
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const ProtectedPage = () => <div>Protected content</div>;

const renderWithRouter = (isAuthenticated: boolean) => {
  mockUseAuth.mockReturnValue({ isAuthenticated, token: null });

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<div>Login page</div>} />
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<ProtectedPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("RequireAuth", () => {
  it("renders protected content when authenticated", () => {
    renderWithRouter(true);
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    renderWithRouter(false);
    expect(screen.getByText("Login page")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
```

**Step 3: Run to verify it fails**

```bash
npm test src/core/router/guards/RequireAuth.test.tsx
```

Expected: FAIL — module not found errors.

**Step 4: Create `src/features/auth/hooks/useAuth.ts`** (stub — expanded when auth feature is built)

```typescript
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
}

export const useAuth = (): AuthState => {
  const token = localStorage.getItem("auth_token");
  return {
    isAuthenticated: !!token,
    token,
  };
};
```

**Step 5: Create `src/core/router/guards/RequireAuth.tsx`**

```tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/core/router/routes";

export const RequireAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};
```

**Step 6: Run test to verify it passes**

```bash
npm test src/core/router/guards/RequireAuth.test.tsx
```

Expected: PASS — 2 tests passing.

**Step 7: Create page placeholder components**

Create `src/features/auth/components/LoginPage.tsx`:

```tsx
import { useTranslation } from "react-i18next";

export const LoginPage = () => {
  const { t } = useTranslation("auth");
  return <div><h1>{t("loginTitle")}</h1></div>;
};
```

Create `src/features/auth/components/RegisterPage.tsx`:

```tsx
import { useTranslation } from "react-i18next";

export const RegisterPage = () => {
  const { t } = useTranslation("auth");
  return <div><h1>{t("registerTitle")}</h1></div>;
};
```

Create `src/features/home/components/HomePage.tsx`:

```tsx
export const HomePage = () => <div>Home</div>;
```

Create `src/features/dashboard/components/DashboardPage.tsx`:

```tsx
export const DashboardPage = () => <div>Dashboard</div>;
```

Create `src/features/profile/components/ProfilePage.tsx`:

```tsx
export const ProfilePage = () => <div>Profile</div>;
```

Create `src/features/notFound/components/NotFoundPage.tsx`:

```tsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ROUTES } from "@/core/router/routes";

export const NotFoundPage = () => {
  const { t } = useTranslation("common");
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted-foreground">{t("notFound")}</p>
        <Link to={ROUTES.HOME} className="mt-4 inline-block text-primary underline">
          {t("back")}
        </Link>
      </div>
    </div>
  );
};
```

Create `src/components/layout/AppLayout.tsx`:

```tsx
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/core/middleware/ErrorBoundary";

export const AppLayout = () => (
  <ErrorBoundary>
    <Outlet />
  </ErrorBoundary>
);
```

**Step 8: Create `src/core/router/index.tsx`**

```tsx
import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "./guards/RequireAuth";
import { ROUTES } from "./routes";
import { HomePage } from "@/features/home/components/HomePage";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { RegisterPage } from "@/features/auth/components/RegisterPage";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { ProfilePage } from "@/features/profile/components/ProfilePage";
import { NotFoundPage } from "@/features/notFound/components/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.PROFILE, element: <ProfilePage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
```

**Step 9: Commit**

```bash
git add src/core/router/ src/features/ src/components/layout/
git commit -m "feat: add React Router v6 with auth guard, route constants, and page placeholders"
```

---

## Task 14: Wire Everything Together in App.tsx + main.tsx

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Step 1: Update `src/App.tsx`**

```tsx
import { RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/core/network";
import { router } from "@/core/router";
import "@/core/i18n";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  );
}

export default App;
```

**Step 2: Update `src/main.tsx`** with MSW bootstrap:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

async function bootstrap() {
  if (import.meta.env.VITE_USE_MSW === "true") {
    const { worker } = await import("./core/data/mocks/browser");
    await worker.start({ onUnhandledRequest: "warn" });
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
```

**Step 3: Delete Vite boilerplate files**

```bash
rm src/App.css src/assets/react.svg
```

**Step 4: Start dev server and verify the app loads**

```bash
npm run dev
```

Open browser at `http://localhost:5173`. Expected: page loads with no console errors.

**Step 5: Run all tests**

```bash
npm test
```

Expected: all tests PASS.

**Step 6: Commit**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: wire ApolloProvider, RouterProvider, i18n, and MSW bootstrap in App + main"
```

---

## Task 15: Final Verification

**Step 1: Run full test suite with coverage**

```bash
npm run test:coverage
```

Expected: all tests pass, coverage report in `coverage/`.

**Step 2: TypeScript type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Production build**

```bash
npm run build
```

Expected: `dist/` created, no build errors.

**Step 4: Final commit**

```bash
git status
```

Review — confirm no `.env.local` is staged, then:

```bash
git add -A
git commit -m "chore: final project scaffold — all tests pass, TypeScript clean, build succeeds"
```

---

## Summary of All Files

| File | Purpose |
|---|---|
| `.gitignore` | Ignores `node_modules`, `dist`, `.env.local`, coverage |
| `CLAUDE.md` | Project conventions for Claude |
| `components.json` | shadcn/ui config (aliases utils to `@/lib/utils`) |
| `jest.config.ts` | Jest with ts-jest, jsdom, `setupFilesAfterEnv` |
| `jest.setup.ts` | jest-dom matchers + MSW server lifecycle |
| `__mocks__/fileMock.ts` | Stub for CSS/image imports in Jest |
| `src/lib/utils.ts` | `cn` utility — generated by shadcn CLI, imported as `@/lib/utils` |
| `src/lib/utils.test.ts` | Tests for cn utility |
| `src/components/ui/Button.tsx` | Wrapped shadcn Button with `loading` prop |
| `src/components/ui/Input.tsx` | Wrapped shadcn Input |
| `src/components/ui/Form.tsx` | Wrapped shadcn Form + FormField etc. |
| `src/components/ui/Card.tsx` | Wrapped shadcn Card + sub-components |
| `src/components/ui/Badge.tsx` | Wrapped shadcn Badge |
| `src/components/ui/Select.tsx` | Wrapped shadcn Select + sub-components |
| `src/components/ui/Dialog.tsx` | Wrapped shadcn Dialog + sub-components |
| `src/components/ui/Table.tsx` | Wrapped shadcn Table + sub-components |
| `src/components/ui/index.ts` | Barrel export — the only import path for features |
| `src/components/layout/AppLayout.tsx` | Root layout wrapping Outlet in ErrorBoundary |
| `src/core/network/apolloClient.ts` | Apollo Client with link chain |
| `src/core/network/links/authLink.ts` | Injects auth headers; exposes token helpers |
| `src/core/network/links/errorLink.ts` | Handles GraphQL/network errors, auto-logout |
| `src/core/network/links/index.ts` | Re-exports all links |
| `src/core/network/index.ts` | Public API of the network layer |
| `src/core/data/mocks/browser.ts` | MSW browser worker (Vite dev server) |
| `src/core/data/mocks/server.ts` | MSW Node server (Jest) |
| `src/core/data/mocks/handlers/auth.ts` | Auth GraphQL mock handlers |
| `src/core/data/mocks/handlers/index.ts` | Combines all handlers |
| `src/core/i18n/index.ts` | i18next config with en + th |
| `src/core/i18n/locales/en/common.json` | English shared strings |
| `src/core/i18n/locales/en/auth.json` | English auth strings |
| `src/core/i18n/locales/th/common.json` | Thai shared strings |
| `src/core/i18n/locales/th/auth.json` | Thai auth strings |
| `src/core/router/index.tsx` | createBrowserRouter with all routes |
| `src/core/router/routes.ts` | Route path constants |
| `src/core/router/guards/RequireAuth.tsx` | Auth guard — redirects unauthenticated users |
| `src/core/middleware/ErrorBoundary.tsx` | React class component error boundary |
| `src/features/auth/hooks/useAuth.ts` | Auth state hook (stub) |
| `src/features/auth/components/LoginPage.tsx` | Login page placeholder |
| `src/features/auth/components/RegisterPage.tsx` | Register page placeholder |
| `src/features/home/components/HomePage.tsx` | Home page placeholder |
| `src/features/dashboard/components/DashboardPage.tsx` | Dashboard placeholder |
| `src/features/profile/components/ProfilePage.tsx` | Profile placeholder |
| `src/features/notFound/components/NotFoundPage.tsx` | 404 page |

## What Was Removed vs Original Plan

| Removed | Why |
|---|---|
| `src/utils/cn.ts` | Redundant re-export of `src/lib/utils.ts`. Use `@/lib/utils` directly |
| `src/components/ui/NotFoundPage.tsx` | Wrong location — moved to `src/features/notFound/components/NotFoundPage.tsx` |
| `src/core/data/mocks/handlers/auth.test.ts` (raw fetch) | MSW graphql handlers cannot be tested via relative `fetch()` in Node/Jest — test them through consuming components instead |

## Bugs Fixed vs Original Plan

| Bug | Fix |
|---|---|
| `setupFilesAfterFramework` (invalid key) | Corrected to `setupFilesAfterEnv` |
| `.env` in `.gitignore` | Removed — `.env` with non-sensitive defaults is committed; only `.env.local` is ignored |
| Missing `react-hook-form` + `@hookform/resolvers` | Added to Task 1 dependencies |
| `apolloClient.test.ts` listed but never created | Removed from Files list; authLink helpers tested instead |
| `mkdir` missing 6 directories | All feature + layout directories added to Task 7 |
| `Form.tsx` wrapper missing | Added to Task 8 with barrel export |
