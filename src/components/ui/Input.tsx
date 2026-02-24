import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Input as ShadcnInput } from "@/components/ui/input-shadcn";

export type InputProps = ComponentPropsWithoutRef<typeof ShadcnInput>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <ShadcnInput ref={ref} {...props} />;
});

Input.displayName = "Input";
