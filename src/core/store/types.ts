/**
 * Core Store Types
 * Types for global Zustand stores
 */
import type { AuthUser } from "@src/features/auth/types";
import type { Theme, Language } from "@src/core/config/types";

/**
 * App-wide state
 */
export interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Language
  language: Language;
  setLanguage: (language: Language) => void;

  // Loading state
  isInitialized: boolean;
  setInitialized: (value: boolean) => void;

  // Error state
  globalError: string | null;
  setGlobalError: (error: string | null) => void;
  clearError: () => void;
}

/**
 * Auth state
 */
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: AuthUser) => void;
  logout: () => void;
}

/**
 * UI state
 */
export interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Modal
  activeModal: string | null;
  modalData: Record<string, unknown> | null;
  openModal: (modalId: string, data?: Record<string, unknown>) => void;
  closeModal: () => void;

  // Toast notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}
