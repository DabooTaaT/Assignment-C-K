// src/components/ui/Label/label.tsx
import MuiFormLabel, { type FormLabelProps } from "@mui/material/FormLabel";

export type { FormLabelProps };
export const Label = (props: FormLabelProps) => <MuiFormLabel {...props} />;
