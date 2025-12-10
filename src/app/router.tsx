/**
 * App Router
 * Central router configuration using feature-based routes
 */
import { createHashRouter, Outlet } from "react-router-dom";
import { PageDepthProvider } from "@src/core/router";
import { AuthLayout, MainLayout } from "@src/layouts";
import { allAuthRoutes, allMainRoutes } from "@src/features";

export const router = createHashRouter([
  {
    element: (
      <PageDepthProvider>
        <Outlet />
      </PageDepthProvider>
    ),
    children: [
      // Auth routes (login, forgot-password, etc.)
      {
        element: <AuthLayout />,
        children: allAuthRoutes,
      },
      // Main app routes (dashboard, features, etc.)
      {
        element: <MainLayout />,
        children: allMainRoutes,
      },
    ],
  },
]);
