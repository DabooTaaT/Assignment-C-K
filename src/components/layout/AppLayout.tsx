import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/core/middleware/ErrorBoundary";

export const AppLayout = () => (
  <ErrorBoundary>
    <Outlet />
  </ErrorBoundary>
);
