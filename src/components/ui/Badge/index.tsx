// src/components/ui/Badge/index.tsx
import React from "react";
import MuiChip, { type ChipProps } from "@mui/material/Chip";

export type BadgeProps = ChipProps;

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>((props, ref) => (
  <MuiChip ref={ref} {...props} />
));
Badge.displayName = "Badge";
