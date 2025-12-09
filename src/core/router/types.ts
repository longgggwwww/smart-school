/**
 * Router utilities and types
 */
import type { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";

// Create a compatible route type without the problematic extension
type BaseRouteObject = IndexRouteObject | NonIndexRouteObject;

/**
 * Feature route configuration
 */
export type FeatureRoute = BaseRouteObject & {
  /**
   * Route metadata
   */
  meta?: {
    /** Route title for display */
    title?: string;
    /** Route icon name */
    icon?: string;
    /** Required permission to access this route */
    permission?: string;
    /** Required roles to access this route */
    roles?: string[];
    /** Whether to show in navigation */
    showInNav?: boolean;
    /** Navigation order */
    order?: number;
  };
};

/**
 * Feature module configuration
 */
export interface FeatureConfig {
  /** Feature name (unique identifier) */
  name: string;
  /** Feature routes */
  routes: FeatureRoute[];
  /** Feature layout wrapper (optional) */
  layout?: "auth" | "main" | "none";
}

/**
 * Page depth mapping for animations
 */
export const PAGE_DEPTH: Record<string, number> = {
  "/": 0,
  "/dashboard": 0,
  "/forgot-password": 1,
};

/**
 * Register page depth for a route
 */
export function registerPageDepth(path: string, depth: number): void {
  PAGE_DEPTH[path] = depth;
}

/**
 * Get page depth for a route
 */
export function getPageDepth(path: string): number {
  return PAGE_DEPTH[path] ?? 0;
}
