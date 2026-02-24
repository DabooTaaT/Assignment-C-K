// src/components/ui/Badge/Badge.tsx
import React from "react";
import MuiChip, { type ChipProps } from "@mui/material/Chip";

export type BadgeProps = ChipProps;

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>((props, ref) => (
  <MuiChip ref={ref} {...props} />
));
Badge.displayName = "Badge";
