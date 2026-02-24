// src/core/theme/index.ts
import { createTheme } from "@mui/material/styles";

/** Convert Tailwind's space-separated HSL ("222.2 47.4% 11.2%") to "hsl(222.2, 47.4%, 11.2%)" */
function cssVar(name: string, fallback = "#000"): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return fallback;
  const parts = raw.split(/\s+/);
  if (parts.length < 3) return fallback;
  const [h, s, l] = parts;
  return `hsl(${h}, ${s}, ${l})`;
}

/** Convert --radius to px number; supports both rem and px values */
function cssVarRadius(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--radius")
    .trim();
  const num = parseFloat(raw);
  if (isNaN(num)) return 8;
  if (raw.endsWith("px")) return num;
  const base = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return num * (isNaN(base) ? 16 : base);
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
