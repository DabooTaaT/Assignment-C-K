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
