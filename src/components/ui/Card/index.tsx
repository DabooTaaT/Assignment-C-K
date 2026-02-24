// src/components/ui/Card/index.tsx
import MuiCard, { type CardProps } from "@mui/material/Card";
import MuiCardContent, { type CardContentProps } from "@mui/material/CardContent";
import MuiCardHeader, { type CardHeaderProps } from "@mui/material/CardHeader";
import MuiCardActions, { type CardActionsProps } from "@mui/material/CardActions";

export const Card = (props: CardProps) => <MuiCard {...props} />;
export const CardContent = (props: CardContentProps) => <MuiCardContent {...props} />;
export const CardHeader = (props: CardHeaderProps) => <MuiCardHeader {...props} />;
export const CardActions = (props: CardActionsProps) => <MuiCardActions {...props} />;
