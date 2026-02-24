import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Input as ShadcnInput } from "./input";

export type InputProps = ComponentPropsWithoutRef<typeof ShadcnInput>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <ShadcnInput ref={ref} {...props} />;
});

Input.displayName = "Input";
