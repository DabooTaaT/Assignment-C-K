import { forwardRef } from "react";
import {
  Input as ShadcnInput,
  type InputProps,
} from "@/components/ui/input-shadcn";

export type { InputProps };

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <ShadcnInput ref={ref} {...props} />;
});

Input.displayName = "Input";
