// src/components/ui/Button/Button.tsx
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
      aria-busy={loading ? true : undefined}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : startIcon}
      {...props}
    >
      {children}
    </MuiButton>
  )
);

Button.displayName = "Button";
