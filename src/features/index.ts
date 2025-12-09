/**
 * Features Module
 * Central registration point for all feature modules
 */
import { RouteObject } from "react-router-dom";

// Import feature routes
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";

/**
 * All auth-related routes (use AuthLayout)
 */
export const allAuthRoutes: RouteObject[] = [...authRoutes];

/**
 * All main app routes (use MainLayout)
 */
export const allMainRoutes: RouteObject[] = [...dashboardRoutes];

/**
 * Re-export features for direct access
 */
export * from "./auth";
export * from "./dashboard";
