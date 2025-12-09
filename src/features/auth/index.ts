/**
 * Auth Feature Module
 * Export all auth-related functionality
 */

// Types
export * from "./types";

// Storage utilities
export * from "./storage";

// Service (API functions)
export {
  login,
  logout,
  refreshAccessToken,
  getCurrentUser,
  openMainWindow,
  getSavedAccounts,
  saveAccount,
  removeSavedAccount,
  clearSavedAccounts,
  AuthError,
} from "./service";

// Hooks
export { useAuth } from "./hooks";

// Routes
export { authRoutes } from "./routes";

// Pages
export * from "./pages";
