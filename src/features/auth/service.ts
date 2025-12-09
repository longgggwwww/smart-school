/**
 * Auth Feature - API Service
 * Handles authentication API calls
 */
import { invoke } from "@tauri-apps/api/core";
import {
  LoginRequest,
  LoginResponse,
  AuthUser,
  SavedAccount,
  AuthErrorCode,
  UserStatus,
} from "./types";
import {
  storeTokens,
  storeCurrentUser,
  clearTokens,
  getRefreshToken,
  getStoredUser,
  getAccessToken,
  AUTH_STORAGE_KEYS,
} from "./storage";

// Import mocks (will be replaced with real API later)
import {
  findUserByUsername,
  findAuthUserByUsername,
  validateMockPassword,
  getMockSavedAccounts,
  getPermissionStrings,
} from "./mocks";

// ============================================================================
// Error Class
// ============================================================================

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: AuthErrorCode,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

const MOCK_DELAY_MS = 500;

/**
 * Simulate network delay for mock API
 */
async function mockDelay(ms: number = MOCK_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate mock tokens
 */
function generateMockTokens(userId: string): {
  accessToken: string;
  refreshToken: string;
} {
  const timestamp = Date.now();
  return {
    accessToken: `mock_access_${userId}_${timestamp}`,
    refreshToken: `mock_refresh_${userId}_${timestamp}`,
  };
}

// ============================================================================
// Saved Accounts Management
// ============================================================================

/**
 * Get saved accounts from storage
 */
export async function getSavedAccounts(): Promise<SavedAccount[]> {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEYS.SAVED_ACCOUNTS);
    if (stored) {
      const accounts = JSON.parse(stored) as SavedAccount[];
      // Convert date strings back to Date objects
      return accounts.map((acc) => ({
        ...acc,
        last_login: acc.last_login ? new Date(acc.last_login) : undefined,
      }));
    }
  } catch (error) {
    console.error("Failed to get saved accounts:", error);
  }

  // Return mock accounts for development
  return getMockSavedAccounts();
}

/**
 * Save account for quick login
 */
export async function saveAccount(account: SavedAccount): Promise<void> {
  try {
    const accounts = await getSavedAccounts();
    const existingIndex = accounts.findIndex(
      (a) => a.user_id === account.user_id
    );

    if (existingIndex >= 0) {
      accounts[existingIndex] = account;
    } else {
      accounts.unshift(account);
    }

    // Keep only last 5 accounts
    const trimmedAccounts = accounts.slice(0, 5);
    localStorage.setItem(
      AUTH_STORAGE_KEYS.SAVED_ACCOUNTS,
      JSON.stringify(trimmedAccounts)
    );
  } catch (error) {
    console.error("Failed to save account:", error);
  }
}

/**
 * Remove saved account
 */
export async function removeSavedAccount(userId: string): Promise<void> {
  try {
    const accounts = await getSavedAccounts();
    const filtered = accounts.filter((a) => a.user_id !== userId);
    localStorage.setItem(
      AUTH_STORAGE_KEYS.SAVED_ACCOUNTS,
      JSON.stringify(filtered)
    );
  } catch (error) {
    console.error("Failed to remove saved account:", error);
  }
}

/**
 * Clear all saved accounts
 */
export async function clearSavedAccounts(): Promise<void> {
  localStorage.removeItem(AUTH_STORAGE_KEYS.SAVED_ACCOUNTS);
}

// ============================================================================
// Authentication Operations
// ============================================================================

/**
 * Login with username and password
 * Currently uses mock data - will be replaced with actual API call
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  await mockDelay();

  const { username, password, remember_me } = credentials;

  // Find user
  const user = findUserByUsername(username);

  if (!user) {
    throw new AuthError("User not found", AuthErrorCode.USER_NOT_FOUND);
  }

  // Check account status
  if (user.status === UserStatus.LOCKED || user.is_locked) {
    throw new AuthError("Account is locked", AuthErrorCode.ACCOUNT_LOCKED);
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new AuthError("Account is inactive", AuthErrorCode.ACCOUNT_INACTIVE);
  }

  if (user.status === UserStatus.PENDING) {
    throw new AuthError(
      "Account is pending activation",
      AuthErrorCode.ACCOUNT_INACTIVE
    );
  }

  // Validate password
  if (!validateMockPassword(username, password)) {
    throw new AuthError(
      "Invalid credentials",
      AuthErrorCode.INVALID_CREDENTIALS
    );
  }

  // Get auth user data
  const authUser = findAuthUserByUsername(username);
  if (!authUser) {
    throw new AuthError(
      "Auth user data not found",
      AuthErrorCode.UNKNOWN_ERROR
    );
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateMockTokens(user.user_id);

  // Store tokens and user
  storeTokens(accessToken, refreshToken);
  storeCurrentUser(authUser);

  // Save account for quick login if remember_me is true
  if (remember_me) {
    await saveAccount({
      user_id: user.user_id,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role_type: authUser.role_type,
      last_login: new Date(),
    });
  }

  // Build response
  const response: LoginResponse = {
    success: true,
    message: "Login successful",
    data: {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: 3600,
      user: authUser,
      permissions: getPermissionStrings(authUser.permissions),
      roles: authUser.roles,
    },
  };

  return response;
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  await mockDelay(200);
  clearTokens();
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}> {
  await mockDelay(300);

  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    throw new AuthError(
      "No refresh token available",
      AuthErrorCode.TOKEN_INVALID
    );
  }

  const user = getStoredUser();
  if (!user) {
    throw new AuthError("No stored user", AuthErrorCode.TOKEN_INVALID);
  }

  // Generate new tokens
  const { accessToken, refreshToken } = generateMockTokens(user.user_id);
  storeTokens(accessToken, refreshToken);

  return {
    accessToken,
    refreshToken,
    expiresIn: 3600,
  };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  return getStoredUser();
}

/**
 * Open main window after successful login (Tauri specific)
 */
export async function openMainWindow(): Promise<void> {
  await invoke("open_main_window");
}
