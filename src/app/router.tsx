import { createHashRouter, Outlet } from "react-router-dom";
import { PageDepthProvider } from "../contexts/PageDepthContext";
import { AuthLayout, MainLayout } from "../components/layouts";
import LoginPage from "./(auth)/login/page";
import ForgotPasswordPage from "./(auth)/forgot-password/page";
import DashboardPage from "./(main)/dashboard/page";

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
        children: [{ path: "/dashboard", element: <DashboardPage /> }],
      },
    ],
  },
]);
