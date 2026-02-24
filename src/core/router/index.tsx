import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "./guards/RequireAuth";
import { ROUTES } from "./routes";
import { HomePage } from "@/features/home/components/HomePage";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { RegisterPage } from "@/features/auth/components/RegisterPage";
import { DashboardPage } from "@/features/dashboard/components/DashboardPage";
import { ProfilePage } from "@/features/profile/components/ProfilePage";
import { NotFoundPage } from "@/components/ui/NotFoundPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.LOGIN, element: <LoginPage /> },
      { path: ROUTES.REGISTER, element: <RegisterPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: ROUTES.PROFILE, element: <ProfilePage /> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
