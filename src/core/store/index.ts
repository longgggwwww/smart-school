/**
 * Core Store Module
 * Zustand-based global state management
 */

// Types
export type { AppState, AuthState, UIState, Toast } from "./types";

// App Store
export {
  useAppStore,
  useThemeStore,
  useLanguageStore,
  useIsInitialized,
  useGlobalError,
  appStoreActions,
} from "./appStore";

// Auth Store
export {
  useAuthStore,
  useCurrentUser,
  useIsAuthenticated,
  useAuthLoading,
  authStoreActions,
} from "./authStore";

// UI Store
export {
  useUIStore,
  useSidebarOpen,
  useActiveModal,
  useModalData,
  useToasts,
  uiStoreActions,
} from "./uiStore";
