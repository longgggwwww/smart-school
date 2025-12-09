/**
 * Auth Feature Routes
 */
import { RouteObject } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

/**
 * Auth feature routes
 * These routes use the AuthLayout
 */
export const authRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
];

export default authRoutes;
