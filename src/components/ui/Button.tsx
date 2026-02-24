import { forwardRef } from "react";
import {
  Button as ShadcnButton,
  type ButtonProps,
} from "@/components/ui/button-shadcn";

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
