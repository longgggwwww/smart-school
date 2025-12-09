/**
 * Auth Store
 * Authentication state using Zustand
 */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AuthState } from "./types";
import type { AuthUser } from "../../features/auth/types";
import {
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  removeStoredToken,
} from "../../features/auth/storage";

/**
 * Auth Store - NOT persisted (uses auth storage instead)
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: getStoredUser(),
      isAuthenticated: !!getStoredUser(),
      isLoading: false,

      setUser: (user: AuthUser | null) => {
        if (user) {
          setStoredUser(user);
        } else {
          removeStoredUser();
        }
        set(
          {
            user,
            isAuthenticated: !!user,
          },
          false,
          "setUser"
        );
      },

      setLoading: (isLoading: boolean) =>
        set({ isLoading }, false, "setLoading"),

      login: (user: AuthUser) => {
        setStoredUser(user);
        set(
          {
            user,
            isAuthenticated: true,
            isLoading: false,
          },
          false,
          "login"
        );
      },

      logout: () => {
        removeStoredUser();
        removeStoredToken();
        set(
          {
            user: null,
            isAuthenticated: false,
            isLoading: false,
          },
          false,
          "logout"
        );
      },
    }),
    { name: "AuthStore" }
  )
);

// Selector hooks
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

// Actions (for use outside React components)
export const authStoreActions = {
  setUser: (user: AuthUser | null) => useAuthStore.getState().setUser(user),
  setLoading: (loading: boolean) => useAuthStore.getState().setLoading(loading),
  login: (user: AuthUser) => useAuthStore.getState().login(user),
  logout: () => useAuthStore.getState().logout(),
};
