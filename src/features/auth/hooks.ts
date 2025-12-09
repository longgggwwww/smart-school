/**
 * Auth Feature Hook
 * Provides auth state and methods for components
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AuthState,
  LoginRequest,
  LoginResponse,
  UseAuthReturn,
  UserRoleType,
  PermissionAction,
  INITIAL_AUTH_STATE,
} from "./types";
import {
  login as authLogin,
  logout as authLogout,
  refreshAccessToken,
  getCurrentUser,
  AuthError,
} from "./service";
import {
  isAuthenticated as checkAuthenticated,
  getAccessToken,
  getRefreshToken,
} from "./storage";

/**
 * useAuth hook - provides authentication state and methods
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>(INITIAL_AUTH_STATE);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        if (checkAuthenticated()) {
          const user = await getCurrentUser();
          if (user) {
            setState({
              isAuthenticated: true,
              isLoading: false,
              error: null,
              user,
              permissions: user.permissions,
              accessToken: getAccessToken(),
              refreshToken: getRefreshToken(),
              expiresAt: null, // TODO: Calculate from token
            });
            return;
          }
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      }

      setState({ ...INITIAL_AUTH_STATE, isLoading: false });
    };

    initializeAuth();
  }, []);

  /**
   * Login with credentials
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await authLogin(credentials);

        if (response.success) {
          setState({
            isAuthenticated: true,
            isLoading: false,
            error: null,
            user: response.data.user,
            permissions: response.data.user.permissions,
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            expiresAt: Date.now() + response.data.expires_in * 1000,
          });
        }

        return response;
      } catch (error) {
        const errorMessage =
          error instanceof AuthError
            ? error.message
            : "An unexpected error occurred";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        throw error;
      }
    },
    []
  );

  /**
   * Logout current user
   */
  const logout = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authLogout();
    } finally {
      setState({ ...INITIAL_AUTH_STATE, isLoading: false });
    }
  }, []);

  /**
   * Refresh access token
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const result = await refreshAccessToken();
      setState((prev) => ({
        ...prev,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresAt: Date.now() + result.expiresIn * 1000,
      }));
    } catch (error) {
      // If refresh fails, logout
      await logout();
      throw error;
    }
  }, [logout]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback(
    (resource: string, action: PermissionAction): boolean => {
      if (!state.permissions || state.permissions.length === 0) {
        return false;
      }

      return state.permissions.some(
        (p) => p.resource === resource && p.action === action && p.allowed
      );
    },
    [state.permissions]
  );

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback(
    (roleName: string): boolean => {
      if (!state.user?.roles) {
        return false;
      }
      return state.user.roles.includes(roleName);
    },
    [state.user?.roles]
  );

  // Role type checks
  const isStudent = useMemo(
    () => state.user?.role_type === UserRoleType.STUDENT,
    [state.user?.role_type]
  );

  const isTeacher = useMemo(
    () => state.user?.role_type === UserRoleType.TEACHER,
    [state.user?.role_type]
  );

  const isAdmin = useMemo(
    () => state.user?.role_type === UserRoleType.ADMIN,
    [state.user?.role_type]
  );

  const isSuperAdmin = useMemo(
    () => state.user?.role_type === UserRoleType.SUPER_ADMIN,
    [state.user?.role_type]
  );

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
    isStudent,
    isTeacher,
    isAdmin,
    isSuperAdmin,
  };
}

export default useAuth;
