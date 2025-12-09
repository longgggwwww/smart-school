/**
 * Auth Feature - Token Storage
 * Handles localStorage token management
 */
import { AuthUser } from "./types";

// ============================================================================
// Constants
// ============================================================================

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: "smart_school_access_token",
  REFRESH_TOKEN: "smart_school_refresh_token",
  SAVED_ACCOUNTS: "smart_school_saved_accounts",
  CURRENT_USER: "smart_school_current_user",
} as const;

// ============================================================================
// Token Storage
// ============================================================================

/**
 * Store tokens in localStorage
 */
export function storeTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Clear all stored tokens
 */
export function clearTokens(): void {
  localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_USER);
}

// ============================================================================
// User Storage
// ============================================================================

/**
 * Store current user
 */
export function storeCurrentUser(user: AuthUser): void {
  localStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

/**
 * Get stored current user
 */
export function getStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_USER);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken() && !!getStoredUser();
}

// Aliases for store compatibility
export const setStoredUser = storeCurrentUser;
export const removeStoredUser = (): void => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.CURRENT_USER);
};
export const removeStoredToken = clearTokens;
