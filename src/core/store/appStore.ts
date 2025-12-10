/**
 * App Store
 * Global app state using Zustand
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import type { AppState } from "./types";
import type { Theme, Language } from "@src/core/config/types";

/**
 * App Store - persisted to localStorage
 */
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Theme
        theme: "system",
        setTheme: (theme: Theme) => set({ theme }, false, "setTheme"),

        // Language
        language: "en",
        setLanguage: (language: Language) =>
          set({ language }, false, "setLanguage"),

        // Initialization
        isInitialized: false,
        setInitialized: (value: boolean) =>
          set({ isInitialized: value }, false, "setInitialized"),

        // Global error
        globalError: null,
        setGlobalError: (error: string | null) =>
          set({ globalError: error }, false, "setGlobalError"),
        clearError: () => set({ globalError: null }, false, "clearError"),
      }),
      {
        name: "app-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
        }),
      }
    ),
    { name: "AppStore" }
  )
);

// Selector hooks for performance optimization
export const useThemeStore = () => useAppStore((state) => state.theme);
export const useLanguageStore = () => useAppStore((state) => state.language);
export const useIsInitialized = () =>
  useAppStore((state) => state.isInitialized);
export const useGlobalError = () => useAppStore((state) => state.globalError);

// Actions (for use outside React components)
export const appStoreActions = {
  setTheme: (theme: Theme) => useAppStore.getState().setTheme(theme),
  setLanguage: (language: Language) =>
    useAppStore.getState().setLanguage(language),
  setInitialized: (value: boolean) =>
    useAppStore.getState().setInitialized(value),
  setGlobalError: (error: string | null) =>
    useAppStore.getState().setGlobalError(error),
  clearError: () => useAppStore.getState().clearError(),
};
