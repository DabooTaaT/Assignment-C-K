// src/components/ui/Card/index.tsx
import React from "react";
import MuiCard, { type CardProps } from "@mui/material/Card";
import MuiCardContent, { type CardContentProps } from "@mui/material/CardContent";
import MuiCardHeader, { type CardHeaderProps } from "@mui/material/CardHeader";
import MuiCardActions, { type CardActionsProps } from "@mui/material/CardActions";

export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <MuiCard ref={ref} {...props} />
));
Card.displayName = "Card";

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>((props, ref) => (
  <MuiCardContent ref={ref} {...props} />
));
CardContent.displayName = "CardContent";

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>((props, ref) => (
  <MuiCardHeader ref={ref} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>((props, ref) => (
  <MuiCardActions ref={ref} {...props} />
));
CardActions.displayName = "CardActions";
