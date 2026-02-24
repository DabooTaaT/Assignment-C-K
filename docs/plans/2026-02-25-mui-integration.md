# MUI Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace shadcn/ui raw source files with Material UI components, expose MUI's native prop API on each wrapper, and drive MUI's theme from the existing Tailwind CSS variables.

**Architecture:** Each `src/components/ui/<Name>/index.tsx` wrapper is rewritten to import from `@mui/material`. A new `src/core/theme/index.ts` reads Tailwind CSS variables at runtime via `getComputedStyle` and feeds them into `createTheme`. `App.tsx` gains a `ThemeProvider`. Raw `component.tsx` shadcn files are deleted. Unused Radix/shadcn deps are removed.

**Tech Stack:** `@mui/material`, `@emotion/react`, `@emotion/styled`, `react-hook-form` (unchanged), Tailwind CSS variables.

---

### Task 1: Install MUI packages

**Files:**
- Run: `npm install @mui/material @emotion/react @emotion/styled`

**Step 1: Install**

```bash
npm install @mui/material @emotion/react @emotion/styled
```

Expected: packages added to `node_modules`, `package.json` updated.

**Step 2: Verify TypeScript resolves MUI types**

```bash
npx tsc --noEmit
```

Expected: `TS OK` (no errors — nothing imports MUI yet).

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @mui/material @emotion/react @emotion/styled"
```

---

### Task 2: Theme bridge

**Files:**
- Create: `src/core/theme/index.ts`

**Step 1: Create the theme file**

```ts
// src/core/theme/index.ts
import { createTheme } from "@mui/material/styles";

/** Convert Tailwind's space-separated HSL ("222.2 47.4% 11.2%") to "hsl(222.2, 47.4%, 11.2%)" */
function cssVar(name: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const [h, s, l] = raw.split(" ");
  return `hsl(${h}, ${s}, ${l})`;
}

/** Convert --radius ("0.5rem") to px number using document base font size */
function cssVarRadius(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--radius")
    .trim();
  const rem = parseFloat(raw);
  const base = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return isNaN(rem) ? 8 : rem * (isNaN(base) ? 16 : base);
}

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: cssVar("--primary"),
      contrastText: cssVar("--primary-foreground"),
    },
    secondary: {
      main: cssVar("--secondary"),
      contrastText: cssVar("--secondary-foreground"),
    },
    error: {
      main: cssVar("--destructive"),
      contrastText: cssVar("--destructive-foreground"),
    },
    background: {
      default: cssVar("--background"),
      paper: cssVar("--card"),
    },
    text: {
      primary: cssVar("--foreground"),
      secondary: cssVar("--muted-foreground"),
    },
  },
  shape: {
    borderRadius: cssVarRadius(),
  },
});
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/core/theme/index.ts
git commit -m "feat(theme): add MUI theme bridge from Tailwind CSS variables"
```

---

### Task 3: Wrap App with ThemeProvider

**Files:**
- Modify: `src/App.tsx`

**Step 1: Rewrite App.tsx**

```tsx
// src/App.tsx
import { RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { apolloClient } from "@/core/network";
import { router } from "@/core/router";
import { muiTheme } from "@/core/theme";
import "@/core/i18n";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
```

**Step 2: Verify TypeScript + tests**

```bash
npx tsc --noEmit && npx jest --passWithNoTests
```

Expected: TS OK, 20 tests pass.

**Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat(app): wrap with MUI ThemeProvider and CssBaseline"
```

---

### Task 4: Replace Button

**Files:**
- Modify: `src/components/ui/Button/index.tsx`
- Modify: `src/components/ui/Button/Button.test.tsx`

**Step 1: Rewrite the wrapper**

```tsx
// src/components/ui/Button/index.tsx
import { forwardRef } from "react";
import MuiButton, { type ButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

export interface AppButtonProps extends ButtonProps {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ loading, disabled, children, startIcon, ...props }, ref) => (
    <MuiButton
      ref={ref}
      disabled={loading || disabled}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </MuiButton>
  )
);

Button.displayName = "Button";
```

**Step 2: Update Button.test.tsx**

MUI Button renders a `<button>` — all existing role/click/disabled queries remain valid. Only the `loading` spinner test needs updating (MUI uses `startIcon` not a `<span>` with `animate-spin`):

```tsx
// src/components/ui/Button/Button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
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

  it("shows spinner when loading", () => {
    render(<Button loading>Submit</Button>);
    // MUI renders CircularProgress as an svg role="progressbar"
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
```

**Step 3: Run tests**

```bash
npx jest src/components/ui/Button/Button.test.tsx --no-coverage
```

Expected: 5 tests pass.

**Step 4: Commit**

```bash
git add src/components/ui/Button/
git commit -m "feat(ui/Button): replace shadcn with MUI Button"
```

---

### Task 5: Replace Input

**Files:**
- Modify: `src/components/ui/Input/index.tsx`
- Modify: `src/components/ui/Input/Input.test.tsx`

**Step 1: Rewrite the wrapper**

```tsx
// src/components/ui/Input/index.tsx
import { forwardRef } from "react";
import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";

export type InputProps = TextFieldProps;

export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => (
  <MuiTextField ref={ref} variant="outlined" fullWidth {...props} />
));

Input.displayName = "Input";
```

**Step 2: Update Input.test.tsx**

MUI TextField renders an `<input>` with `role="textbox"` inside — existing queries still work:

```tsx
// src/components/ui/Input/Input.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui";

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

**Step 3: Run tests**

```bash
npx jest src/components/ui/Input/Input.test.tsx --no-coverage
```

Expected: 2 tests pass.

**Step 4: Commit**

```bash
git add src/components/ui/Input/
git commit -m "feat(ui/Input): replace shadcn with MUI TextField"
```

---

### Task 6: Replace Card

**Files:**
- Modify: `src/components/ui/Card/index.tsx`

**Step 1: Rewrite the wrapper**

```tsx
// src/components/ui/Card/index.tsx
import MuiCard, { type CardProps } from "@mui/material/Card";
import MuiCardContent, { type CardContentProps } from "@mui/material/CardContent";
import MuiCardHeader, { type CardHeaderProps } from "@mui/material/CardHeader";
import MuiCardActions, { type CardActionsProps } from "@mui/material/CardActions";

export const Card = (props: CardProps) => <MuiCard {...props} />;
export const CardContent = (props: CardContentProps) => <MuiCardContent {...props} />;
export const CardHeader = (props: CardHeaderProps) => <MuiCardHeader {...props} />;
export const CardActions = (props: CardActionsProps) => <MuiCardActions {...props} />;
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: TS OK.

**Step 3: Commit**

```bash
git add src/components/ui/Card/index.tsx
git commit -m "feat(ui/Card): replace shadcn with MUI Card"
```

---

### Task 7: Replace Dialog

**Files:**
- Modify: `src/components/ui/Dialog/index.tsx`

**Step 1: Rewrite the wrapper**

```tsx
// src/components/ui/Dialog/index.tsx
export { default as Dialog } from "@mui/material/Dialog";
export type { DialogProps } from "@mui/material/Dialog";

export { default as DialogTitle } from "@mui/material/DialogTitle";
export type { DialogTitleProps } from "@mui/material/DialogTitle";

export { default as DialogContent } from "@mui/material/DialogContent";
export type { DialogContentProps } from "@mui/material/DialogContent";

export { default as DialogContentText } from "@mui/material/DialogContentText";
export type { DialogContentTextProps } from "@mui/material/DialogContentText";

export { default as DialogActions } from "@mui/material/DialogActions";
export type { DialogActionsProps } from "@mui/material/DialogActions";
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: TS OK.

**Step 3: Commit**

```bash
git add src/components/ui/Dialog/index.tsx
git commit -m "feat(ui/Dialog): replace shadcn with MUI Dialog"
```

---

### Task 8: Replace Select

**Files:**
- Modify: `src/components/ui/Select/index.tsx`

**Step 1: Rewrite the wrapper**

```tsx
// src/components/ui/Select/index.tsx
export { default as Select } from "@mui/material/Select";
export type { SelectProps } from "@mui/material/Select";

export { default as SelectItem } from "@mui/material/MenuItem";
export type { MenuItemProps as SelectItemProps } from "@mui/material/MenuItem";

export { default as SelectFormControl } from "@mui/material/FormControl";
export type { FormControlProps as SelectFormControlProps } from "@mui/material/FormControl";

export { default as SelectLabel } from "@mui/material/InputLabel";
export type { InputLabelProps as SelectLabelProps } from "@mui/material/InputLabel";
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: TS OK.

**Step 3: Commit**

```bash
git add src/components/ui/Select/index.tsx
git commit -m "feat(ui/Select): replace shadcn with MUI Select"
```

---

### Task 9: Replace Table

**Files:**
- Modify: `src/components/ui/Table/index.tsx`

**Step 1: Rewrite the wrapper**

```tsx
// src/components/ui/Table/index.tsx
export { default as Table } from "@mui/material/Table";
export type { TableProps } from "@mui/material/Table";

export { default as TableBody } from "@mui/material/TableBody";
export { default as TableCell } from "@mui/material/TableCell";
export type { TableCellProps } from "@mui/material/TableCell";

export { default as TableContainer } from "@mui/material/TableContainer";
export type { TableContainerProps } from "@mui/material/TableContainer";

export { default as TableHead } from "@mui/material/TableHead";
export { default as TableRow } from "@mui/material/TableRow";
export { default as TableFooter } from "@mui/material/TableFooter";
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: TS OK.

**Step 3: Commit**

```bash
git add src/components/ui/Table/index.tsx
git commit -m "feat(ui/Table): replace shadcn with MUI Table"
```

---

### Task 10: Replace Badge

**Files:**
- Modify: `src/components/ui/Badge/index.tsx`

**Note:** MUI `Badge` is a notification-dot component (e.g. the red circle on icons). The shadcn `Badge` is a label/pill/chip. MUI `Chip` is the correct replacement.

**Step 1: Rewrite the wrapper**

```tsx
// src/components/ui/Badge/index.tsx
import MuiChip, { type ChipProps } from "@mui/material/Chip";

export type BadgeProps = ChipProps;

export const Badge = (props: ChipProps) => <MuiChip {...props} />;
```

**Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: TS OK.

**Step 3: Commit**

```bash
git add src/components/ui/Badge/index.tsx
git commit -m "feat(ui/Badge): replace shadcn Badge with MUI Chip"
```

---

### Task 11: Replace Form + Label

**Files:**
- Modify: `src/components/ui/Form/index.tsx`
- Modify: `src/components/ui/Label/label.tsx`

**Step 1: Rewrite Label**

```tsx
// src/components/ui/Label/label.tsx
import MuiFormLabel, { type FormLabelProps } from "@mui/material/FormLabel";

export type { FormLabelProps };
export const Label = (props: FormLabelProps) => <MuiFormLabel {...props} />;
```

**Step 2: Rewrite Form/index.tsx**

```tsx
// src/components/ui/Form/index.tsx
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import MuiFormControl, { type FormControlProps } from "@mui/material/FormControl";
import MuiFormLabel from "@mui/material/FormLabel";
import MuiFormHelperText from "@mui/material/FormHelperText";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) throw new Error("useFormField should be used within <FormField>");
  if (!itemContext) throw new Error("useFormField should be used within <FormItem>");

  const fieldState = getFieldState(fieldContext.name, formState);
  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  };
};

const FormItem = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ children, ...props }, ref) => {
    const id = React.useId();
    return (
      <FormItemContext.Provider value={{ id }}>
        <MuiFormControl ref={ref} fullWidth {...props}>
          {children}
        </MuiFormControl>
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof MuiFormLabel>
>(({ children, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <MuiFormLabel ref={ref} htmlFor={formItemId} error={!!error} {...props}>
      {children}
    </MuiFormLabel>
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
  const { formItemId, formDescriptionId, formMessageId, error } = useFormField();
  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={
        error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </div>
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  const { formDescriptionId } = useFormField();
  return <MuiFormHelperText ref={ref} id={formDescriptionId} {...props} />;
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  return (
    <MuiFormHelperText ref={ref} id={formMessageId} error={!!error} {...props}>
      {body}
    </MuiFormHelperText>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
```

**Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: TS OK.

**Step 4: Commit**

```bash
git add src/components/ui/Form/ src/components/ui/Label/
git commit -m "feat(ui/Form,Label): replace shadcn with MUI FormControl and FormLabel"
```

---

### Task 12: Update barrel + delete raw files + remove unused deps

**Files:**
- Modify: `src/components/ui/index.ts`
- Delete: `src/components/ui/Button/button.tsx`
- Delete: `src/components/ui/Input/input.tsx`
- Delete: `src/components/ui/Card/card.tsx`
- Delete: `src/components/ui/Dialog/dialog.tsx`
- Delete: `src/components/ui/Select/select.tsx`
- Delete: `src/components/ui/Table/table.tsx`
- Delete: `src/components/ui/Badge/badge.tsx`
- Delete: `src/components/ui/Form/form.tsx`

**Step 1: Update the barrel**

```ts
// src/components/ui/index.ts
export { Button } from "./Button";
export type { AppButtonProps } from "./Button";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
  useFormField,
} from "./Form";

export { Card, CardContent, CardHeader, CardActions } from "./Card";

export { Badge } from "./Badge";
export type { BadgeProps } from "./Badge";

export { Select, SelectItem, SelectFormControl, SelectLabel } from "./Select";

export {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "./Dialog";

export {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
} from "./Table";

export { Label } from "./Label/label";
```

**Step 2: Delete raw shadcn files**

```bash
git rm src/components/ui/Button/button.tsx \
       src/components/ui/Input/input.tsx \
       src/components/ui/Card/card.tsx \
       src/components/ui/Dialog/dialog.tsx \
       src/components/ui/Select/select.tsx \
       src/components/ui/Table/table.tsx \
       src/components/ui/Badge/badge.tsx \
       src/components/ui/Form/form.tsx
```

**Step 3: Remove unused deps**

```bash
npm uninstall @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot class-variance-authority lucide-react
```

**Step 4: Run full test suite**

```bash
npx tsc --noEmit && npx jest --passWithNoTests
```

Expected: TS OK, all tests pass.

**Step 5: Commit**

```bash
git add src/components/ui/index.ts package.json package-lock.json
git commit -m "chore(ui): update barrel, delete raw shadcn files, remove unused deps"
```

---

### Task 13: Update PROJECT_STRUCTURE.md

**Files:**
- Modify: `docs/PROJECT_STRUCTURE.md`

**Step 1: Update the ui section**

In the Directory Structure tree, update each component folder to show only `index.tsx`:

```
│   └── ui/                   # MUI wrappers (never import MUI directly — use @/components/ui)
│       ├── index.ts          # Barrel export — only import from here
│       ├── Badge/
│       │   └── index.tsx     # MUI Chip wrapper (label/pill style)
│       ├── Button/
│       │   ├── index.tsx     # MUI Button wrapper (adds loading prop)
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
│       │   └── label.tsx     # MUI FormLabel
│       ├── Select/
│       │   └── index.tsx     # MUI Select + MenuItem + FormControl + InputLabel
│       └── Table/
│           └── index.tsx     # MUI Table + sub-components
```

Also update the **Shared UI** layer description:

```
### Shared UI — MUI Wrappers
**Rule:** Never import from `@mui/material` directly. Always import from `@/components/ui`.

Each component folder contains only `index.tsx` — the wrapper that exposes MUI's native prop API.
The MUI theme is driven by Tailwind CSS variables via `src/core/theme/index.ts`, so both systems share one palette.
```

Also add a new **Theme** entry in the directory structure under `core/`:

```
│   ├── theme/
│   │   └── index.ts          # createTheme: reads Tailwind CSS vars → MUI palette
```

**Step 2: Verify TypeScript + tests one final time**

```bash
npx tsc --noEmit && npx jest --passWithNoTests
```

Expected: TS OK, all tests pass.

**Step 3: Commit**

```bash
git add docs/PROJECT_STRUCTURE.md
git commit -m "docs: update PROJECT_STRUCTURE.md for MUI integration"
```
