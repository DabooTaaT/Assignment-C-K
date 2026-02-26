import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "./guards/RequireAuth";
import { ROUTES } from "./routes";
import { HomePage } from "@/features/home/HomePage";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { NotFoundPage } from "@/features/notFound/NotFoundPage";
import { EnhanceHtmlAssignmentPage } from "@/features/enhanceHtmlAssignment/EnhanceHtmlAssignmentPage";

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
          { path: ROUTES.DASHBOARD, element: <div>Dashboard</div> },
          { path: ROUTES.PROFILE, element: <div>Profile</div> },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: ROUTES.ENHANCE_HTML_ASSIGNMENT,
    element: <EnhanceHtmlAssignmentPage />,
  },
]);
