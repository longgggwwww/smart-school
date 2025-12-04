import { createHashRouter, Outlet } from "react-router-dom";
import { PageDepthProvider } from "../contexts/PageDepthContext";
import { AuthLayout, MainLayout } from "../components/layouts";

// Lazy load pages for better performance
import LoginPage from "./(auth)/login/page";
import ForgotPasswordPage from "./(auth)/forgot-password/page";
import DashboardPage from "./(main)/dashboard/page";

/**
 * Router configuration using createHashRouter (required for Tauri file:// protocol)
 *
 * Structure mirrors Next.js app directory:
 * - (auth) group: login, forgot-password - shares AuthLayout
 * - (main) group: dashboard, future pages - shares MainLayout
 */
export const router = createHashRouter([
  {
    // Root element wraps everything with PageDepthProvider
    element: (
      <PageDepthProvider>
        <Outlet />
      </PageDepthProvider>
    ),
    children: [
      // Auth routes - share AuthLayout (TitleBar + Logo + Footer)
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/",
            element: <LoginPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
        ],
      },
      // Main app routes - share MainLayout
      {
        element: <MainLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          // Future routes:
          // { path: "/settings", element: <SettingsPage /> },
          // { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);
