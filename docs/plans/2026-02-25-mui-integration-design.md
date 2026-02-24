# MUI Integration Design

**Goal:** Replace shadcn/ui as the underlying component source with Material UI. The `index.tsx` wrappers expose MUI's native prop API. MUI theme tokens are driven by the existing Tailwind CSS variables so both systems share one palette.

**Architecture:** Clean replace — raw `component.tsx` shadcn files deleted, each `index.tsx` wrapper rewritten to import directly from `@mui/material`. A new `src/core/theme/` module bridges Tailwind CSS vars into MUI's `createTheme`. Unused Radix/shadcn deps removed.

**Tech Stack:** `@mui/material`, `@emotion/react`, `@emotion/styled`, existing `react-hook-form`, existing Tailwind CSS variables.

---

## Theme Bridge

**File:** `src/core/theme/index.ts`

A `cssVar` helper reads each CSS variable at runtime via `getComputedStyle(document.documentElement)`, converts space-separated HSL (`222.2 47.4% 11.2%`) to comma-separated (`hsl(222.2, 47.4%, 11.2%)`) for MUI's color parser, then passes into `createTheme`.

| CSS Variable | MUI Palette Key |
|---|---|
| `--primary` | `palette.primary.main` |
| `--secondary` | `palette.secondary.main` |
| `--destructive` | `palette.error.main` |
| `--background` | `palette.background.default` |
| `--card` | `palette.background.paper` |
| `--foreground` | `palette.text.primary` |
| `--muted-foreground` | `palette.text.secondary` |
| `--radius` | `shape.borderRadius` (parsed to px number) |

**App.tsx** wraps existing providers with `<ThemeProvider theme={muiTheme}><CssBaseline />`.

---

## Component Mapping

| Folder | MUI Component | Key changes |
|---|---|---|
| `Button/` | `MuiButton` | Keep `loading` prop; map to MUI `loading` |
| `Input/` | `MuiTextField` | Adds `label`, `helperText`, `error` props |
| `Card/` | `MuiCard` + `MuiCardContent` + `MuiCardHeader` + `MuiCardActions` | Direct mapping |
| `Select/` | `MuiSelect` + `MuiMenuItem` + `MuiFormControl` + `MuiInputLabel` | FormControl wrapper needed |
| `Dialog/` | `MuiDialog` + sub-components | Direct mapping |
| `Table/` | `MuiTable` + `MuiTableContainer` + sub-components | Direct mapping |
| `Badge/` | `MuiChip` | MUI `Badge` = notification dot; `Chip` matches label/pill style |
| `Form/` | react-hook-form + `MuiFormControl` + `MuiFormHelperText` | Form logic unchanged |
| `Label/` | `MuiFormLabel` | Direct mapping |

---

## Cleanup

- Delete all raw `*.tsx` shadcn source files (`button.tsx`, `card.tsx`, etc.)
- Remove from `package.json`: `@radix-ui/react-dialog`, `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `class-variance-authority`
- Keep: `clsx`, `tailwind-merge` (used by `lib/utils.ts` for page-level Tailwind)

---

## Testing

- Update `Button/Button.test.tsx` — MUI Button renders a `<button>` role, tests remain valid
- Update `Input/Input.test.tsx` — MUI TextField renders `<input>` inside, `getByRole("textbox")` still works
- No new test files needed; existing assertions stay structurally the same
