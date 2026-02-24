// src/components/ui/Label/index.tsx
import React from "react";
import MuiFormLabel, { type FormLabelProps } from "@mui/material/FormLabel";

export type { FormLabelProps };

export const Label = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (props, ref) => <MuiFormLabel ref={ref} {...props} />
);
Label.displayName = "Label";
