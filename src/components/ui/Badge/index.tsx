// src/components/ui/Badge/index.tsx
import MuiChip, { type ChipProps } from "@mui/material/Chip";

export type BadgeProps = ChipProps;

export const Badge = (props: ChipProps) => <MuiChip {...props} />;
