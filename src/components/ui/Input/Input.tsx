// src/components/ui/Input/Input.tsx
import { forwardRef } from "react";
import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";

export type InputProps = TextFieldProps;

export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => (
  <MuiTextField ref={ref} variant="outlined" fullWidth {...props} />
));

Input.displayName = "Input";
