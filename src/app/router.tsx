import { createHashRouter, Outlet } from "react-router-dom";
import { PageDepthProvider } from "../contexts/PageDepthContext";
import { AuthLayout, MainLayout } from "../components/layouts";
import LoginPage from "./(auth)/login/page";
import ForgotPasswordPage from "./(auth)/forgot-password/page";
import DashboardPage from "./(main)/dashboard/page";
import { BlankPage } from "../pages";

export const router = createHashRouter([
  {
    element: (
      <PageDepthProvider>
        <Outlet />
      </PageDepthProvider>
    ),
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/", element: <LoginPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          // Dashboard
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/dashboard/overview", element: <BlankPage /> },
          { path: "/dashboard/system-status", element: <BlankPage /> },

          // Users Management (Admin)
          { path: "/users/accounts", element: <BlankPage /> },
          { path: "/users/rbac", element: <BlankPage /> },
          { path: "/users/teachers", element: <BlankPage /> },
          { path: "/users/students", element: <BlankPage /> },

          // Classes Management (Admin)
          { path: "/classes/create", element: <BlankPage /> },
          { path: "/classes/schedule", element: <BlankPage /> },
          { path: "/classes/assignments", element: <BlankPage /> },

          // Infrastructure (Admin)
          { path: "/infrastructure/rooms", element: <BlankPage /> },
          { path: "/infrastructure/monitoring", element: <BlankPage /> },
          { path: "/infrastructure/config", element: <BlankPage /> },

          // Reports (Admin)
          { path: "/reports/teaching", element: <BlankPage /> },
          { path: "/reports/audit-logs", element: <BlankPage /> },
          { path: "/reports/backup", element: <BlankPage /> },

          // Live Class (Teacher/Student)
          { path: "/live-class/control", element: <BlankPage /> },
          { path: "/live-class/teaching", element: <BlankPage /> },
          { path: "/live-class/interaction", element: <BlankPage /> },
          { path: "/live-class/join", element: <BlankPage /> },
          { path: "/live-class/chat", element: <BlankPage /> },

          // Learning Management
          { path: "/learning/classes", element: <BlankPage /> },
          { path: "/learning/content", element: <BlankPage /> },
          { path: "/learning/grades", element: <BlankPage /> },
          { path: "/learning/my-classes", element: <BlankPage /> },
          { path: "/learning/assignments", element: <BlankPage /> },

          // Settings
          { path: "/settings/schedule", element: <BlankPage /> },
          { path: "/settings/notifications", element: <BlankPage /> },

          // Catch-all for undefined routes within main layout
          { path: "*", element: <BlankPage /> },
        ],
      },
    ],
  },
]);
