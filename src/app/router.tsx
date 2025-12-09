/**
 * App Router
 * Central router configuration using feature-based routes
 */
import { createHashRouter, Outlet } from "react-router-dom";
import { PageDepthProvider } from "../core/router";
import { AuthLayout, MainLayout } from "../layouts";
import { allAuthRoutes, allMainRoutes } from "../features";

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
